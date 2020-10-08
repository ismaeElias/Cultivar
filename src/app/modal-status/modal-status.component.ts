import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
declare var google;
@Component({
  selector: 'app-modal-status',
  templateUrl: './modal-status.component.html',
  styleUrls: ['./modal-status.component.scss'],
})
export class ModalStatusComponent {

  @Input() valor: string;
  @Input() temperatura: string;
  @Input() umidade: string;
  @Input() luminosidade: string;
  
  constructor(public modalCtrl: ModalController) {
  }

  ngOnInit() { 

  }

  fechar() {
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }
  ionViewDidEnter() {
    this.plotSimpleBarChart();
  }

  plotSimpleBarChart() {
    var data = google.visualization.arrayToDataTable([
      ['Label', 'Value'],
      ['Temperatura',  parseFloat(this.temperatura)],
      ['Umidade',      parseFloat(this.umidade)],
      ['Luminosidade', parseFloat(this.luminosidade)]
    ]);

    var options = {
      width: 400, height: 120,
      redFrom: 90, redTo: 100,
      yellowFrom:75, yellowTo: 90,
      minorTicks: 5
    };

    var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

    chart.draw(data, options);
  }
}
