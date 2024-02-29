import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase'
import {Mahlzeit} from "./mahlzeit";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public pocketbase: PocketBase;
  public readonly PER_PAGE: number = 10;

  constructor() {
    this.pocketbase = new PocketBase(environment.backend);
  }

  public isLoggedIn(): boolean {
    return this.pocketbase?.authStore.model != undefined;
  }

  public async login(email: string, password: string): Promise<boolean> {
    try {
      await this.pocketbase.collection('users').authWithPassword(email, password);
    }catch {
      return false;
    }

    return true;
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
    try {
      await this.pocketbase.collection('push_subscriptions').delete(localStorage.getItem('push_id'));
      localStorage.removeItem('push_id');
    } catch {}
  }

  public async uploadMahlzeit(message: string | undefined, file: File | undefined, rating: number) {
    await this.pocketbase.collection("mahlzeiten").create({
      user: this.pocketbase.authStore.model['id'],
      message: message,
      file: file,
      rating: rating
    });

    try {
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
    }catch {}
  }

  public async getMahlzeiten(page: number): Promise<Mahlzeit[]> {
    const records = await this.pocketbase.collection<Mahlzeit>('mahlzeiten').getList(page, this.PER_PAGE, {
      sort: '-created'
    });
    const mahlzeiten = records.items;


    const users = await this.pocketbase.collection('users').getFullList();

    for (let mahlzeit of mahlzeiten) {
      mahlzeit.created = new Date(mahlzeit.created);
      mahlzeit.updated = new Date(mahlzeit.updated);

      for (let user of users) {
        if (user.id != mahlzeit.user) continue;
        mahlzeit.user = user['name'];
      }
    }

    return mahlzeiten;
  }
}
