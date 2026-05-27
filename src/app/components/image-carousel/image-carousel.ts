import { Component, input, signal, computed } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.html',
  styleUrl: './image-carousel.css',
})
export class ImageCarousel {
  readonly images = input.required<string[]>();
  readonly alt = input<string>('');

  readonly currentIndex = signal(0);

  readonly hasMultiple = computed(() => this.images().length > 1);

  prev() {
    const len = this.images().length;
    this.currentIndex.update(i => (i - 1 + len) % len);
  }

  next() {
    const len = this.images().length;
    this.currentIndex.update(i => (i + 1) % len);
  }

  goTo(i: number) {
    this.currentIndex.set(i);
  }
}
