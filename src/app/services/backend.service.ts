import { Injectable } from '@angular/core';
import PocketBase, {RecordModel} from 'pocketbase'
import {Mahlzeit} from "./mahlzeit";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public pocketbase: PocketBase;
  public mahlzeitCache: Mahlzeit[] = [];

  constructor() {
    this.pocketbase = new PocketBase(environment.backend);
  }

  public isLoggedIn(): boolean {
    return this.pocketbase?.authStore.model != undefined;
  }

  public async login(email: string, password: string) {
    await this.pocketbase.collection('users').authWithPassword(email, password);
  }

  public async logout() {
    this.pocketbase.authStore.clear();
  }

  public async registerPushSubscription(sub: PushSubscription) {
    const record = await this.pocketbase.collection('push_subscriptions').create({
      user: this.pocketbase.authStore.model['id'],
      subscription: sub
    });

    localStorage.setItem('push_id', record.id);
  }

  public async deletePushSubscription() {
    await this.pocketbase.collection('push_subscriptions').delete(localStorage.getItem('push_id'));
    localStorage.removeItem('push_id');
  }

  public async uploadMahlzeit(message: string | undefined, file: File | undefined) {
    await this.pocketbase.collection("mahlzeiten").create({
      user: this.pocketbase.authStore.model['id'],
      message: message,
      file: file
    });

    let subscriptions = await this.pocketbase.collection('push_subscriptions').getFullList();
    subscriptions = subscriptions.filter(sub => sub['user'] !== this.pocketbase.authStore.model['id']);

    await fetch(location.origin + "/notification", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        subscriptions: subscriptions,
        payload: this.pocketbase.authStore.model['name'] + " mahlzeitet jetzt!"
      })
    });
  }

  public async getMahlzeiten(): Promise<Mahlzeit[]> {
    const records = await this.pocketbase.collection<Mahlzeit>('mahlzeiten').getFullList({
      sort: '-created'
    });

    const users = await this.pocketbase.collection('users').getFullList();

    for (let mahlzeit of records) {
      mahlzeit.created = new Date(mahlzeit.created);
      mahlzeit.updated = new Date(mahlzeit.updated);

      for (let user of users) {
        if (user.id != mahlzeit.user) continue;
        mahlzeit.user = user['name'];
      }
    }

    this.mahlzeitCache = records;
    return records;
  }
}
