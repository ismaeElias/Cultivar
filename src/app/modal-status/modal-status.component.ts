import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-status',
  templateUrl: './modal-status.component.html',
  styleUrls: ['./modal-status.component.scss'],
})
export class ModalStatusComponent implements OnInit {

  @Input() valor: string
  Temperatura : string
  Umidade : string
  Luminosidade : string
  constructor(public modalCtrl: ModalController) {}

  ngOnInit() { 
    this.Temperatura      = this.valor.substring(2,7);
    this.Umidade          = this.valor.substring(9,14);
    this.Luminosidade     = this.valor.substring(16,30);
  }

  fechar() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
}
