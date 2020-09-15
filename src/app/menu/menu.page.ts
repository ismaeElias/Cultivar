import { Component, OnInit } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import {  ModalController, ToastController } from '@ionic/angular';
import { ModalStatusComponent } from '../modal-status/modal-status.component';

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
  dadosArduino : any;

  constructor(private bluetoothSerial: BluetoothSerial, 
              public toastController: ToastController,
              public modalController: ModalController) { }

  ngOnInit() {
    this.bluetoothSerial.write('MostrarStatus');
    this.readData();
  }

  async showStatus() {
    const modal = await this.modalController.create({
      component: ModalStatusComponent,
      componentProps:{
        'valor' : this.dadosArduino
      },
      cssClass : 'modal-status-component-css'
    });
    return await modal.present();
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

  readData() {
    this.bluetoothSerial.isConnected()
      .then(data => {
        this.bluetoothSerial.read().then( data => {
          this.dadosArduino = data
        },
          error => {
            this.output += "\r\nRead Error : " + JSON.stringify(error);
          });
      })
      .catch(error => {
        this.output += "\r\nBT disconnected";
      });
  }


}