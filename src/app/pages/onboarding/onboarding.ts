import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DogSizeService } from '../../services/dog-size.service';
import { DogSize, DOG_SIZE_LABELS } from '../../models/spot.model';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class OnboardingPage {
  readonly sizes: { value: DogSize; label: string; desc: string; emoji: string; kg: string }[] = [
    { value: 'small',  label: DOG_SIZE_LABELS.small,  desc: '치와와, 포메라니안, 말티즈 등', emoji: '🐾', kg: '10kg 미만' },
    { value: 'medium', label: DOG_SIZE_LABELS.medium, desc: '코카스패니얼, 시바견, 웰시코기 등', emoji: '🐕', kg: '10~25kg' },
    { value: 'large',  label: DOG_SIZE_LABELS.large,  desc: '래브라도, 골든리트리버, 허스키 등', emoji: '🦮', kg: '25kg 이상' },
  ];

  constructor(private dogSizeService: DogSizeService, private router: Router) {}

  select(size: DogSize) {
    this.dogSizeService.setSize(size);
    this.router.navigate(['/list']);
  }
}
