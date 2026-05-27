import { Injectable, signal } from '@angular/core';
import { City, DogSize } from '../models/spot.model';

@Injectable({ providedIn: 'root' })
export class DogSizeService {
  readonly selectedSize = signal<DogSize | null>(null);
  readonly selectedCity = signal<City | null>(null);

  setSize(size: DogSize) {
    this.selectedSize.set(size);
  }

  setCity(city: City | null) {
    this.selectedCity.set(city);
  }
}
