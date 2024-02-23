import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol, IonInput
} from '@ionic/angular/standalone';
import {BackendService} from "../services/backend.service";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonInput],
})
export class HomePage {
  constructor(private backend: BackendService) {}

  public async sendMahlzeit(messageInput: IonInput, filesInput: IonInput) {
    const message = messageInput.value as string;
    const file = (await filesInput.getInputElement()).files;

    await this.backend.login("leon@ladenbau-hoppe.de", "1234567890");
    await this.backend.uploadMahlzeit(message, file[0] || undefined);
  }
}
