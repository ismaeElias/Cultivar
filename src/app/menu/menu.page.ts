import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  output: string = ""; 
  isCheckTemperatura: boolean = false;
  isCheckIluminacao: boolean = false;
  isCheckIrrigacao: boolean = false;
  readOk: boolean;

  constructor(private bluetoothSerial: BluetoothSerial, private alertController: AlertController,public toastController: ToastController) { }

  ngOnInit() {
    /* this.alertSincronizacao()*/
  }

  showStatus() {
    this.bluetoothSerial.write('MostrarStatus');
    this.alertSincronizacao();
  }

  

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

  async alertSincronizacao() {
    const alert = await this.alertController.create({
      header: 'Alerta',
      message: 'Deseja sincronizar os dados ?',
      buttons: [
        {
          text: 'Confirmar',
          role: 'confirmar',
          handler: () => {
              this.bluetoothSerial.isConnected()
              .then(data => {
                this.bluetoothSerial.read().then(async data => {  
                  this.output += "\r\n\r\nRead : " + data;
                  const toast = await this.toastController.create({
                    message: data,
                    duration: 2000
                  });
                  toast.present();
                },
                error =>{
                  this.output += "\r\nRead Error : " + JSON.stringify(error);    
                });
              })
              .catch(error => {
                this.output += "\r\nBT disconnected";
              });
          }
        },
        {
          text: 'Cancelar',
        }
      ]
    });
    await alert.present();
  }

}