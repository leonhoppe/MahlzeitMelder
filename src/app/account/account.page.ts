import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonLabel,
  IonList,
  IonItem,
  IonListHeader,
  IonText,
  IonButton,
  IonAlert,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent, IonButtons
} from '@ionic/angular/standalone';
import {BackendService} from "../services/backend.service";

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonLabel, IonList, IonItem, IonListHeader, IonText, IonButton, IonAlert, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButtons],
})
export class AccountPage {
  public loginVisible: boolean = false;
  public accountVisible: boolean = false;
  public account: any = undefined;
  private subscription: PushSubscription = undefined;

  constructor(public backend: BackendService) {
    if (!backend.isLoggedIn()) {
      this.loginVisible = true;
    }else {
      this.account = this.backend.pocketbase.authStore.model;
      this.accountVisible = true;
      this.setupPushNotifications();
    }
  }

  public async login(email: string, password: string, alert: IonAlert) {
    try {
      await this.backend.login(email, password);
      await this.setupPushNotifications();
      this.account = this.backend.pocketbase.authStore.model;
      this.loginVisible = false;
      this.accountVisible = true;

    } catch {
      await alert.present();
    }
  }

  public async logout() {
    await this.subscription?.unsubscribe();
    await this.backend.deletePushSubscription();
    await this.backend.logout();

    this.accountVisible = false;
    this.loginVisible = true;
  }

  private async setupPushNotifications() {
    try {
      const registration = await navigator.serviceWorker.ready;

      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        const response = await fetch(location.origin + "/vapid");
        const vapidKey = (await response.json()).publicKey;

        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidKey)
        });

        await this.backend.registerPushSubscription(subscription);
      }

      this.subscription = subscription;
    } catch {}
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
