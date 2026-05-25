import { Component, input } from '@angular/core';
import { CongestionInfo } from '../../models/spot.model';

@Component({
  selector: 'app-congestion-badge',
  templateUrl: './congestion-badge.html',
  styleUrl: './congestion-badge.css',
})
export class CongestionBadge {
  info = input.required<CongestionInfo>();
}
