import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotsService } from '../../services/spots.service';
import { CongestionService } from '../../services/congestion.service';
import { CongestionBadge } from '../../components/congestion-badge/congestion-badge';
import { FEATURE_LABELS, DOG_SIZE_LABELS, Spot } from '../../models/spot.model';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.html',
  styleUrl: './detail.css',
  imports: [CongestionBadge],
})
export class DetailPage {
  readonly spot = signal<Spot | undefined>(undefined);
  readonly schedule = computed(() => {
    const s = this.spot();
    return s ? this.congestionService.getSchedulePreview(s.spot_type) : [];
  });
  readonly currentCongestion = computed(() => {
    const s = this.spot();
    return s ? this.congestionService.getCongestion(s.spot_type) : null;
  });

  readonly FEATURE_LABELS = FEATURE_LABELS;
  readonly DOG_SIZE_LABELS = DOG_SIZE_LABELS;

  constructor(
    private route: ActivatedRoute,
    private spotsService: SpotsService,
    public congestionService: CongestionService,
    private router: Router,
  ) {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.spot.set(this.spotsService.getById(id));
  }

  goBack() {
    this.router.navigate(['/list']);
  }
}
