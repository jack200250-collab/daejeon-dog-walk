import { Component, AfterViewInit, OnDestroy, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { DogSizeService } from '../../services/dog-size.service';
import { SpotsService } from '../../services/spots.service';
import { CongestionService } from '../../services/congestion.service';
import { WeatherService } from '../../services/weather.service';
import { CongestionBadge } from '../../components/congestion-badge/congestion-badge';
import { City, CITY_LABELS, DOG_SIZE_LABELS, Spot } from '../../models/spot.model';

const CITY_CENTERS: Record<string, { lat: number; lng: number; zoom: number }> = {
  daejeon: { lat: 36.3504, lng: 127.3845, zoom: 13 },
  sejong:  { lat: 36.5140, lng: 127.2650, zoom: 13 },
  all:     { lat: 36.4350, lng: 127.3300, zoom: 12 },
};

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrl: './map.css',
  imports: [CongestionBadge],
})
export class MapPage implements AfterViewInit, OnDestroy {
  private map!: L.Map;
  private markers: L.Layer[] = [];

  readonly selectedSpot = signal<Spot | null>(null);
  readonly mapLoading = signal(true);
  readonly mapError = signal(false);
  readonly selectedCity = computed(() => this.dogSizeService.selectedCity());
  readonly selectedSize = computed(() => this.dogSizeService.selectedSize());
  readonly spots = computed(() =>
    this.spotsService.getFiltered(this.selectedCity(), this.selectedSize()),
  );

  readonly cities: (City | null)[] = [null, 'daejeon', 'sejong'];
  readonly CITY_LABELS = CITY_LABELS;
  readonly DOG_SIZE_LABELS = DOG_SIZE_LABELS;

  constructor(
    private dogSizeService: DogSizeService,
    private spotsService: SpotsService,
    public congestionService: CongestionService,
    public weatherService: WeatherService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    // #leaflet-map은 항상 DOM에 있으므로 한 프레임 뒤 바로 초기화
    requestAnimationFrame(() => this.initMap());
  }

  private initMap() {
    const iconProto = L.Icon.Default.prototype as any;
    delete iconProto._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const center = CITY_CENTERS[this.selectedCity() ?? 'all'];
    this.map = L.map('leaflet-map', {
      center: [center.lat, center.lng],
      zoom: center.zoom,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(this.map);

    this.addMarkers();
    this.mapLoading.set(false);
    // 로딩 오버레이 제거 후 컨테이너 크기 재계산
    setTimeout(() => this.map.invalidateSize(), 50);
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  private addMarkers() {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    this.spots().forEach(spot => {
      const congestion = this.congestionService.getCongestion(spot.spot_type);

      const icon = L.divIcon({
        html: `<div class="custom-marker" style="background:${congestion.color}">
                 ${congestion.emoji} ${spot.name}
               </div>`,
        className: '',
        iconAnchor: [0, 36],
      });

      const marker = L.marker([spot.lat, spot.lng], { icon }).addTo(this.map);
      marker.on('click', () => this.selectedSpot.set(spot));
      this.markers.push(marker);
    });
  }

  selectCity(city: City | null) {
    this.dogSizeService.setCity(city);
    const center = CITY_CENTERS[city ?? 'all'];
    this.map.setView([center.lat, center.lng], center.zoom);
    this.selectedSpot.set(null);
    this.addMarkers();
  }

  retryMap() {}

  goBack() { this.router.navigate(['/list']); }
  goToDetail(id: string) { this.router.navigate(['/detail', id]); }
  closePanel() { this.selectedSpot.set(null); }
}
