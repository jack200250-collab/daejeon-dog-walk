import { Injectable, signal } from '@angular/core';
import { DogSize } from '../models/spot.model';

@Injectable({ providedIn: 'root' })
export class DogSizeService {
  readonly selectedSize = signal<DogSize | null>(null);

  setSize(size: DogSize) {
    this.selectedSize.set(size);
  }
}
