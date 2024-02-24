import {Component} from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {ServiceWorkerModule} from "@angular/service-worker";
import {notificationWorkerConfig} from "./services/notification-worker-config";
import {BackendService} from "./services/backend.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
