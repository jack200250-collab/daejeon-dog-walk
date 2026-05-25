import { Component, AfterViewInit, OnDestroy, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DogSizeService } from '../../services/dog-size.service';
import { SpotsService } from '../../services/spots.service';
import { CongestionService } from '../../services/congestion.service';
import { CongestionBadge } from '../../components/congestion-badge/congestion-badge';
import { DOG_SIZE_LABELS, Spot } from '../../models/spot.model';

declare const kakao: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrl: './map.css',
  imports: [CongestionBadge],
})
export class MapPage implements AfterViewInit, OnDestroy {
  private map: any;
  private markers: any[] = [];
  private retryTimer: any;

  readonly selectedSpot = signal<Spot | null>(null);
  readonly mapError = signal(false);
  readonly mapLoading = signal(true);
  readonly selectedSize = computed(() => this.dogSizeService.selectedSize());
  readonly spots = computed(() => {
    const size = this.selectedSize();
    return size ? this.spotsService.getBySize(size) : this.spotsService.getAll();
  });

  readonly DOG_SIZE_LABELS = DOG_SIZE_LABELS;

  constructor(
    private dogSizeService: DogSizeService,
    private spotsService: SpotsService,
    public congestionService: CongestionService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    this.waitForKakao(0);
  }

  ngOnDestroy() {
    clearTimeout(this.retryTimer);
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
  }

  // SDK가 완전히 로드될 때까지 최대 6초(20회 × 300ms) 재시도
  private waitForKakao(attempt: number) {
    if (typeof kakao !== 'undefined') {
      kakao.maps.load(() => {
        this.mapLoading.set(false);
        this.initMap();
      });
    } else if (attempt < 20) {
      this.retryTimer = setTimeout(() => this.waitForKakao(attempt + 1), 300);
    } else {
      this.mapLoading.set(false);
      this.mapError.set(true);
    }
  }

  private initMap() {
    try {
      const container = document.getElementById('kakao-map');
      if (!container) return;

      this.map = new kakao.maps.Map(container, {
        center: new kakao.maps.LatLng(36.3504, 127.3845),
        level: 8,
      });
      this.addMarkers();
    } catch (e) {
      console.error('Kakao Map init error:', e);
      this.mapError.set(true);
    }
  }

  private addMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    this.spots().forEach(spot => {
      const pos = new kakao.maps.LatLng(spot.lat, spot.lng);
      const congestion = this.congestionService.getCongestion(spot.spot_type);

      const marker = new kakao.maps.Marker({
        map: this.map,
        position: pos,
        title: spot.name,
      });

      const label = new kakao.maps.CustomOverlay({
        map: this.map,
        position: pos,
        content: `<div style="
          background:${congestion.color};color:#fff;
          padding:4px 8px;border-radius:12px;
          font-size:11px;font-weight:700;white-space:nowrap;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
          pointer-events:none;
        ">${congestion.emoji} ${congestion.label}</div>`,
        yAnchor: 3.2,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        this.selectedSpot.set(spot);
      });

      this.markers.push(marker, label);
    });
  }

  goBack() { this.router.navigate(['/list']); }
  goToDetail(id: string) { this.router.navigate(['/detail', id]); }
  closePanel() { this.selectedSpot.set(null); }
}
