import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol, IonInput, IonAlert, IonCard, IonItem, IonList, IonLabel, IonListHeader
} from '@ionic/angular/standalone';
import {BackendService} from "../services/backend.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonInput, IonAlert, IonCard, IonItem, IonList, IonLabel, IonListHeader],
})
export class HomePage {
  constructor(private backend: BackendService, private router: Router) {}

  public async ionViewDidEnter() {
    if (!this.backend.isLoggedIn()) {
      await this.router.navigate(["/tabs/account"]);
    }
  }

  public async sendMahlzeit(messageInput: IonInput, filesInput: IonInput, alert: IonAlert, form: HTMLFormElement) {
    const message = messageInput.value as string;
    const file = (await filesInput.getInputElement()).files;

    await this.backend.uploadMahlzeit(message, file[0] || undefined);
    await this.backend.getMahlzeiten();
    form.reset();
    await alert.present();
  }
}
