import { Injectable } from '@angular/core';
import PocketBase, {RecordModel} from 'pocketbase'

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  private pocketbase: PocketBase;

  constructor() {
    this.pocketbase = new PocketBase("http://localhost:8090");
  }

  public async login(email: string, password: string) {
    await this.pocketbase.collection('users').authWithPassword(email, password);
  }

  public async logout() {
    this.pocketbase.authStore.clear();
  }

  public async uploadMahlzeit(message: string | undefined, file: File | undefined) {
    await this.pocketbase.collection("mahlzeiten").create({
      user: this.pocketbase.authStore.model['id'],
      message: message,
      file: file
    });
  }
}
