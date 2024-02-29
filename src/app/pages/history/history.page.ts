import {Component, ViewChild} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonListHeader,
  IonLabel,
  IonItem,
  IonCard,
  IonButton,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonLoading,
  IonInfiniteScroll, IonInfiniteScrollContent
} from '@ionic/angular/standalone';
import {Mahlzeit} from "../../services/mahlzeit";
import {BackendService} from "../../services/backend.service";
import {NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-history',
  templateUrl: 'history.page.html',
  styleUrls: ['history.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonLabel, IonItem, IonCard, NgForOf, IonButton, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, NgIf, NgOptimizedImage, IonLoading, IonInfiniteScroll, IonInfiniteScrollContent]
})
export class HistoryPage {
  @ViewChild('loading') public loading: IonLoading;
  public mahlzeiten: Mahlzeit[] = [];
  public reachedEnd = false;
  private loaded: boolean = false;
  private currentPage: number = 1;

  constructor(public backend: BackendService, private router: Router) {}

  public createImageUri(mahlzeit: Mahlzeit): string {
    return this.backend.pocketbase.baseUrl + "/api/files/mahlzeiten/" + mahlzeit.id + "/" + mahlzeit.file;
  }

  public async ionViewDidEnter() {
    if (!this.backend.isLoggedIn()) {
      await this.router.navigate(["/tabs/account"]);
    }

    await this.loading.present();
    this.mahlzeiten =  await this.backend.getMahlzeiten(this.currentPage);
    await this.loading.dismiss();
    this.loaded = true;
  }

  public async loadMore(event: any) {
    if (!this.loaded) return;
    this.currentPage++;
    const records = await this.backend.getMahlzeiten(this.currentPage);
    if (records.length < this.backend.PER_PAGE) {
      this.reachedEnd = true;
    }

    this.mahlzeiten.push(...records);
  }
}
