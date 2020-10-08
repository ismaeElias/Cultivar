import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ModalController, ToastController } from '@ionic/angular';
import { ModalStatusComponent } from '../modal-status/modal-status.component';

declare var google;

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage {

  output: string = "";
  isCheckTemperatura: boolean = false;
  isCheckIluminacao: boolean = false;
  isCheckIrrigacao: boolean = false;
  readOk: boolean;
  dadosArduino: string;

  Temperatura: string
  Umidade: string
  Luminosidade: string



  constructor(private bluetoothSerial: BluetoothSerial,
    public toastController: ToastController,
    public modalController: ModalController,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone) {
    this.Temperatura = '0';
    this.Umidade = '0';
    this.Luminosidade = '0'
  }
  // Ao iniciar inicia um timeout para ficar lendo [Pendente]
  ngOnInit() {
    this.bluetoothSerial.write('MostrarStatus');
    setTimeout(() => {
      this.readData();
    }, 250)
  }

  // Envia mensagem para o arduino e mostra informação [OK]
  async showStatus() {
    this.bluetoothSerial.write('MostrarStatus');
    alert(this.dadosArduino);
    /*const modal = await this.modalController.create({
      component: ModalStatusComponent,
      componentProps: {
        'valor': this.dadosArduino,
        'temperatura': this.Temperatura,
        'umidade': this.Umidade,
        'luminosidade': this.Luminosidade,
      },
      cssClass: 'modal-status-component-css'
    });
    return await modal.present();*/
  }

  // Liga e desliga sensores [OK]
  checkTemperatura(event) {
    if (event.checked) {
      this.bluetoothSerial.write('LTE');
    } else {
      this.bluetoothSerial.write('DTE');
    }
  }

  checkIrrigacao(event) {
    if (event.checked) {
      this.bluetoothSerial.write('LIR');
    } else {
      this.bluetoothSerial.write('DIR');
    }
  }

  checkIluminacao(event) {
    if (event.checked) {
      this.bluetoothSerial.write('LIL');
    } else {
      this.bluetoothSerial.write('DIL');
    }
  }
  // Le informação do arduino [+/-] Está lendo porém só mostra a primeira leitura.
  async readData() {
    this.bluetoothSerial.isConnected()
      .then(data => {
        this.bluetoothSerial.read().then(buffer => {
          // this.dadosArduino = buffer  
          /*this.Temperatura = data.substring(2, 7);
          this.Umidade = data.substring(9, 14);
          this.Luminosidade = data.substring(16, 30);*/

          let data = new Uint8Array(buffer)
          this.ngZone.run(() => {
            this.dadosArduino = data[0] + '';
          })
          //this.cdr.detectChanges();
        },
          error => {
            this.output += "\r\nRead Error : " + JSON.stringify(error);
          });
      })
      .catch(error => {
        this.output += "\r\nBT disconnected";
      });

  }

  //Grafico de gauge
  plotSimpleBarChart() {
    var data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Temperatura', this.Temperatura],
      ['Umidade', this.Umidade],
      ['Luminosidade', this.Luminosidade]
    ]);

    var options = {
      width: 400, height: 120,
      redFrom: 90, redTo: 100,
      yellowFrom: 75, yellowTo: 90,
      minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

    chart.draw(data, options);
  }



}