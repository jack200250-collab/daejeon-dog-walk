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

  readonly selectedSpot = signal<Spot | null>(null);
  readonly mapError = signal(false);
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
    if (typeof kakao === 'undefined' || typeof kakao.maps === 'undefined') {
      this.mapError.set(true);
      return;
    }
    // kakao.maps.load() 는 SDK가 완전히 준비된 후 콜백을 실행 — SPA 필수 패턴
    kakao.maps.load(() => this.initMap());
  }

  ngOnDestroy() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];
  }

  private initMap() {
    const container = document.getElementById('kakao-map');
    if (!container) return;

    const options = {
      center: new kakao.maps.LatLng(36.3504, 127.3845),
      level: 8,
    };
    this.map = new kakao.maps.Map(container, options);
    this.addMarkers();
  }

  private addMarkers() {
    this.markers.forEach(m => m.setMap(null));
    this.markers = [];

    this.spots().forEach(spot => {
      const pos = new kakao.maps.LatLng(spot.lat, spot.lng);
      const congestion = this.congestionService.getCongestion(spot.spot_type);

      // CustomOverlay 대신 표준 Marker 사용 — 클릭 이벤트가 안정적
      const marker = new kakao.maps.Marker({
        map: this.map,
        position: pos,
        title: spot.name,
      });

      // 마커 위에 혼잡도 라벨 표시
      const label = new kakao.maps.CustomOverlay({
        map: this.map,
        position: pos,
        content: `<div style="
          background:${congestion.color};color:#fff;
          padding:4px 8px;border-radius:12px;
          font-size:11px;font-weight:700;white-space:nowrap;
          box-shadow:0 2px 6px rgba(0,0,0,0.25);
          margin-bottom:4px;pointer-events:none;
        ">${congestion.emoji} ${congestion.label}</div>`,
        yAnchor: 3.2,
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        this.selectedSpot.set(spot);
      });

      this.markers.push(marker, label);
    });
  }

  goBack() {
    this.router.navigate(['/list']);
  }

  goToDetail(id: string) {
    this.router.navigate(['/detail', id]);
  }

  closePanel() {
    this.selectedSpot.set(null);
  }
}
