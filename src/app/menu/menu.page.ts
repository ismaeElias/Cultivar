import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {


  isCheckTemperatura: boolean = false;
  isCheckIluminacao: boolean = false;
  isCheckIrrigacao: boolean = false;

  constructor(private bluetoothSerial: BluetoothSerial, private alertController: AlertController) { }

  ngOnInit() {
    /* this.alertSincronizacao()*/
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
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Cancelar',
        }
      ]
    });
    await alert.present();
  }

  sendBluetooth() {
    this.bluetoothSerial.write('Funcionou garai!');
    alert('Clicou');
  }
}