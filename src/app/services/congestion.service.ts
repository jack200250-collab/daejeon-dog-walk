import { Injectable } from '@angular/core';
import { CongestionInfo, SpotType } from '../models/spot.model';
import { WeatherService } from './weather.service';

type Level = 'low' | 'moderate' | 'high';
const LEVELS: Level[] = ['low', 'moderate', 'high'];

@Injectable({ providedIn: 'root' })
export class CongestionService {
  constructor(private weather: WeatherService) {}

  getCongestion(spotType: SpotType): CongestionInfo {
    const now = new Date();
    const level = this.applyWeather(
      this.calcLevel(spotType, now.getHours(), now.getDay() === 0 || now.getDay() === 6),
    );
    return this.toInfo(level);
  }

  // 날씨 factor를 적용해 혼잡도 레벨을 조정
  private applyWeather(base: Level): Level {
    const factor = this.weather.current()?.congestionFactor ?? 1.0;
    const idx    = LEVELS.indexOf(base);
    if (factor <= 0.25) return 'low';
    if (factor <= 0.55) return LEVELS[Math.max(0, idx - 1)];
    if (factor >= 1.15) return LEVELS[Math.min(2, idx + 1)];
    return base;
  }

  private calcLevel(type: SpotType, hour: number, isWeekend: boolean): Level {
    if (isWeekend) {
      if (hour >= 10 && hour < 14) return 'high';
      if (hour >= 14 && hour < 18) return type === 'forest' ? 'moderate' : 'high';
      if (hour >= 7  && hour < 10) return 'moderate';
      return 'low';
    } else {
      if (hour >= 17 && hour < 21) return type === 'forest' ? 'moderate' : 'high';
      if (hour >= 6  && hour < 9)  return 'moderate';
      if (hour >= 11 && hour < 14) return type === 'park' ? 'moderate' : 'low';
      return 'low';
    }
  }

  private toInfo(level: Level): CongestionInfo {
    const map: Record<Level, CongestionInfo> = {
      low:      { level: 'low',      label: '여유', color: '#4CAF50', emoji: '🟢' },
      moderate: { level: 'moderate', label: '원활', color: '#FF9800', emoji: '🟡' },
      high:     { level: 'high',     label: '복잡', color: '#F44336', emoji: '🔴' },
    };
    return map[level];
  }

  // 상세 페이지 시간대 예보 — 날씨 factor는 적용하지 않음 (미래 예보이므로)
  getSchedulePreview(spotType: SpotType): { label: string; level: CongestionInfo }[] {
    const slots = [
      { label: '평일 오전 (6~9시)',   hour: 7,  weekend: false },
      { label: '평일 낮 (11~14시)',   hour: 12, weekend: false },
      { label: '평일 저녁 (17~21시)', hour: 18, weekend: false },
      { label: '주말 오전 (7~10시)',  hour: 8,  weekend: true  },
      { label: '주말 낮 (10~14시)',   hour: 11, weekend: true  },
      { label: '주말 오후 (14~18시)', hour: 15, weekend: true  },
    ];
    return slots.map(s => ({
      label: s.label,
      level: this.toInfo(this.calcLevel(spotType, s.hour, s.weekend)),
    }));
  }
}
