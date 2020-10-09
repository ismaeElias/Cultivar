import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { ModalController, ToastController } from '@ionic/angular';

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

  Temperatura: string  = '0';
  Umidade: string      = '0';
  Luminosidade: string = '0';



  constructor(private bluetoothSerial: BluetoothSerial,
    public toastController: ToastController,
    public modalController: ModalController,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone) {

  }
  // Ao iniciar inicia um timeout para ficar lendo [Pendente]
  ngOnInit() {
    this.readData();
    this.plotSimpleBarChart();
    /*let self = this;
    this.bluetoothSerial.write('MostrarStatus');
    setTimeout(() => {
      self.readData();
    }, 250)*/
  }
  ionViewDidEnter() {
    this.plotSimpleBarChart();
  }
  // Envia mensagem para o arduino e mostra informação [OK]
  async showStatus() {
    this.readData();
    
    //this.bluetoothSerial.write('MostrarStatus');
    // alert(this.dadosArduino);
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
    this.bluetoothSerial.write('MostrarStatus');
    this.bluetoothSerial.isConnected()
      .then(data => {
        this.bluetoothSerial.read().then(buffer => {

          this.ngZone.run(() => {
            this.dadosArduino = buffer;
            this.Temperatura = buffer.substring(2, 7);
            this.Umidade = buffer.substring(9, 14);
            this.Luminosidade = buffer.substring(16, 30);
            this.plotSimpleBarChart();
          })
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
      ['Temperatura', parseFloat(this.Temperatura)],
      ['Umidade', parseFloat(this.Umidade)],
      ['Luminosidade', parseFloat(this.Luminosidade)]
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