import { Component, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpotsService } from '../../services/spots.service';
import { CongestionService } from '../../services/congestion.service';
import { WeatherService } from '../../services/weather.service';
import { CongestionBadge } from '../../components/congestion-badge/congestion-badge';
import { FEATURE_ICONS, FEATURE_LABELS, DOG_SIZE_LABELS, CITY_LABELS, Spot } from '../../models/spot.model';

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
  readonly FEATURE_ICONS = FEATURE_ICONS;
  readonly DOG_SIZE_LABELS = DOG_SIZE_LABELS;
  readonly CITY_LABELS = CITY_LABELS;

  constructor(
    private route: ActivatedRoute,
    private spotsService: SpotsService,
    public congestionService: CongestionService,
    public weatherService: WeatherService,
    private router: Router,
  ) {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.spot.set(this.spotsService.getById(id));
  }

  getFeatureIcon(key: string): string {
    return FEATURE_ICONS[key] ?? '✓';
  }

  getFeatureLabel(key: string): string {
    return FEATURE_LABELS[key] ?? key;
  }

  getAmenityDetail(spot: Spot, key: string): string | undefined {
    return spot.amenity_detail[key];
  }

  goBack() {
    this.router.navigate(['/list']);
  }
}
