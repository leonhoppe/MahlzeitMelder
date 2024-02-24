import {Component, ViewChild} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem, IonCard, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLoading
} from '@ionic/angular/standalone';
import {Mahlzeit} from "../services/mahlzeit";
import {BackendService} from "../services/backend.service";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonCard, NgForOf, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, NgIf, NgOptimizedImage, IonLoading]
})
export class HistoryPage {
  @ViewChild('loading') public loading: IonLoading;

  constructor(public backend: BackendService, private router: Router) {}

  public createImageUri(mahlzeit: Mahlzeit): string {
    return this.backend.pocketbase.baseUrl + "/api/files/mahlzeiten/" + mahlzeit.id + "/" + mahlzeit.file;
  }

  public async ionViewDidEnter() {
    if (!this.backend.isLoggedIn()) {
      await this.router.navigate(["/tabs/account"]);
    }

    await this.loading.present();
    await this.backend.getMahlzeiten();
    await this.loading.dismiss();
  }
}
