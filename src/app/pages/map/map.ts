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
    this.initMap();
  }

  ngOnDestroy() {
    this.markers = [];
  }

  private initMap() {
    if (typeof kakao === 'undefined') {
      console.warn('카카오맵 SDK가 로드되지 않았습니다. index.html의 API 키를 확인하세요.');
      return;
    }
    const container = document.getElementById('kakao-map');
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

    const spots = this.spots();
    spots.forEach(spot => {
      const pos = new kakao.maps.LatLng(spot.lat, spot.lng);
      const congestion = this.congestionService.getCongestion(spot.spot_type);

      const content = `
        <div style="
          background:${congestion.color};
          color:#fff;
          padding:6px 10px;
          border-radius:20px;
          font-size:12px;
          font-weight:700;
          white-space:nowrap;
          box-shadow:0 2px 8px rgba(0,0,0,0.2);
          cursor:pointer;
        ">${congestion.emoji} ${spot.name}</div>
      `;

      const overlay = new kakao.maps.CustomOverlay({
        position: pos,
        content,
        yAnchor: 1.3,
      });
      overlay.setMap(this.map);

      const listener = () => this.selectedSpot.set(spot);
      overlay.getContent()?.addEventListener?.('click', listener);

      this.markers.push(overlay);
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
