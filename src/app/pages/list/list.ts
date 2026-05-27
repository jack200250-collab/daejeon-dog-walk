import { Component, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DogSizeService } from '../../services/dog-size.service';
import { SpotsService } from '../../services/spots.service';
import { CongestionService } from '../../services/congestion.service';
import { WeatherService } from '../../services/weather.service';
import { CongestionBadge } from '../../components/congestion-badge/congestion-badge';
import { City, CITY_LABELS, DogSize, DOG_SIZE_LABELS, FEATURE_LABELS } from '../../models/spot.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.html',
  styleUrl: './list.css',
  imports: [CongestionBadge, RouterLink],
})
export class ListPage {
  readonly selectedSize = computed(() => this.dogSizeService.selectedSize());
  readonly selectedCity = computed(() => this.dogSizeService.selectedCity());

  readonly spots = computed(() =>
    this.spotsService.getFiltered(this.selectedCity(), this.selectedSize()),
  );

  readonly cityLabel = computed(() => {
    const c = this.selectedCity();
    return c ? CITY_LABELS[c] : '전체 지역';
  });

  readonly sizeLabel = computed(() => {
    const s = this.selectedSize();
    return s ? DOG_SIZE_LABELS[s] : '전체';
  });

  readonly cities: (City | null)[] = [null, 'daejeon', 'sejong'];
  readonly sizes: DogSize[] = ['small', 'medium', 'large'];
  readonly CITY_LABELS = CITY_LABELS;
  readonly DOG_SIZE_LABELS = DOG_SIZE_LABELS;

  constructor(
    private dogSizeService: DogSizeService,
    private spotsService: SpotsService,
    public congestionService: CongestionService,
    public weatherService: WeatherService,
    private router: Router,
  ) {}

  setCity(city: City | null) {
    this.dogSizeService.setCity(city);
  }

  setSize(size: DogSize) {
    this.dogSizeService.setSize(size);
  }

  goToMap() {
    this.router.navigate(['/map']);
  }

  getFeatureLabel(key: string): string {
    return FEATURE_LABELS[key] ?? key;
  }
}
