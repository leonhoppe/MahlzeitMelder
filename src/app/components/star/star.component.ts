import {Component, Input, Output} from '@angular/core';

@Component({
  selector: 'app-star',
  templateUrl: './star.component.html',
  styleUrls: ['./star.component.scss'],
  standalone: true
})
export class StarComponent {
  @Input() color: string;

  constructor() { }

}
