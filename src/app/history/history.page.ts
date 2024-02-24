import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem, IonCard, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle
} from '@ionic/angular/standalone';
import {Mahlzeit} from "../services/mahlzeit";
import {BackendService} from "../services/backend.service";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonCard, NgForOf, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, NgIf, NgOptimizedImage]
})
export class HistoryPage {
  constructor(public backend: BackendService) {
    backend.getMahlzeiten();
  }

  public createImageUri(mahlzeit: Mahlzeit): string {
    return this.backend.pocketbase.baseUrl + "/api/files/mahlzeiten/" + mahlzeit.id + "/" + mahlzeit.file;
  }
}
