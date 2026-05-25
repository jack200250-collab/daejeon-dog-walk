import { Component, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DogSizeService } from '../../services/dog-size.service';
import { SpotsService } from '../../services/spots.service';
import { CongestionService } from '../../services/congestion.service';
import { CongestionBadge } from '../../components/congestion-badge/congestion-badge';
import { DogSize, DOG_SIZE_LABELS, FEATURE_LABELS, Spot } from '../../models/spot.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.html',
  styleUrl: './list.css',
  imports: [CongestionBadge, RouterLink],
})
export class ListPage {
  readonly selectedSize = computed(() => this.dogSizeService.selectedSize());

  readonly spots = computed(() => {
    const size = this.selectedSize();
    return size ? this.spotsService.getBySize(size) : this.spotsService.getAll();
  });

  readonly sizeLabel = computed(() => {
    const s = this.selectedSize();
    return s ? DOG_SIZE_LABELS[s] : '전체';
  });

  readonly sizes: DogSize[] = ['small', 'medium', 'large'];
  readonly DOG_SIZE_LABELS = DOG_SIZE_LABELS;

  constructor(
    private dogSizeService: DogSizeService,
    private spotsService: SpotsService,
    public congestionService: CongestionService,
    private router: Router,
  ) {}

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
