import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial/ngx';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
 
@Component({
 selector: 'app-home',
 templateUrl: 'home.page.html',
 styleUrls: ['home.page.scss'],
})
export class HomePage {

 unpairedDevices: any;
 pairedDevices: any;
 gettingDevices: boolean;
 
 constructor(private bluetoothSerial: BluetoothSerial, private alertController: AlertController,private router : Router) {
   bluetoothSerial.enable();
 }
 
 routeMenu(){
  this.router.navigate(['menu'])
}

 startScanning() {
   this.pairedDevices = null;
   this.unpairedDevices = null;
   this.gettingDevices = true;
   const unPair = [];
   
   this.bluetoothSerial.discoverUnpaired().then((success) => {
     success.forEach((value, key) => {
       var exists = false;
       unPair.forEach((val2, i) => {
         if (value.id === val2.id) {
           exists = true;
         }
       });
       if (exists === false && value.id !== '') {
         unPair.push(value);
       }
     });
     this.unpairedDevices = unPair;
     this.gettingDevices = false;
   },
     (err) => {
       console.log(err);
     });
 
   this.bluetoothSerial.list().then((success) => {
     this.pairedDevices = success;
   },
     (err) => {
 
     });
   }
 
 success = (data) => {
   this.deviceConnected();
 }
 fail = (error) => {
   alert(error);
 }
 
 async selectDevice(id: any) {
 
   const alert = await this.alertController.create({
     header: 'Conectar ',
     message: 'Deseja conectar ?',
     buttons: [
       {
         text: 'Cancelar',
         role: 'cancelar',
         handler: () => {
           console.log('Cancelar');
         }
       },
       {
         text: 'Conectado',
         handler: () => {
           this.bluetoothSerial.connect(id).subscribe(this.success, this.fail);
         }
       }
     ]
   });
   await alert.present();
 }
 
 deviceConnected() {
   this.bluetoothSerial.isConnected().then(success => {
    alert('Conectado com sucesso!');
     this.routeMenu();
   }, error => {
     alert('error' + JSON.stringify(error));
   });
 }
 
 async disconnect() {
   const alert = await this.alertController.create({
     header: 'Desconectar ?',
     message: 'Você deseja desconectar ?',
     buttons: [
       {
         text: 'Cancelar',
         role: 'cancelar',
         handler: () => {
           console.log('Cancelado');
         }
       },
       {
         text: 'Desconectar',
         handler: () => {
           this.bluetoothSerial.disconnect();
         }
       }
     ]
   });
   await alert.present();
 }
}