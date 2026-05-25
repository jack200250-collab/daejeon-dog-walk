import { Injectable } from '@angular/core';
import { CongestionInfo, SpotType } from '../models/spot.model';

@Injectable({ providedIn: 'root' })
export class CongestionService {
  getCongestion(spotType: SpotType): CongestionInfo {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const isWeekend = day === 0 || day === 6;

    const level = this.calcLevel(spotType, hour, isWeekend);
    return this.toInfo(level);
  }

  private calcLevel(type: SpotType, hour: number, isWeekend: boolean): 'low' | 'moderate' | 'high' {
    if (isWeekend) {
      if (hour >= 10 && hour < 14) return 'high';
      if (hour >= 14 && hour < 18) return type === 'forest' ? 'moderate' : 'high';
      if (hour >= 7 && hour < 10) return 'moderate';
      return 'low';
    } else {
      if (hour >= 17 && hour < 21) return type === 'forest' ? 'moderate' : 'high';
      if (hour >= 6 && hour < 9) return 'moderate';
      if (hour >= 11 && hour < 14) return type === 'park' ? 'moderate' : 'low';
      return 'low';
    }
  }

  private toInfo(level: 'low' | 'moderate' | 'high'): CongestionInfo {
    const map: Record<string, CongestionInfo> = {
      low:      { level: 'low',      label: '여유', color: '#4CAF50', emoji: '🟢' },
      moderate: { level: 'moderate', label: '원활', color: '#FF9800', emoji: '🟡' },
      high:     { level: 'high',     label: '복잡', color: '#F44336', emoji: '🔴' },
    };
    return map[level];
  }

  getSchedulePreview(spotType: SpotType): { label: string; level: CongestionInfo }[] {
    const slots = [
      { label: '평일 오전 (6~9시)', hour: 7, weekend: false },
      { label: '평일 낮 (11~14시)', hour: 12, weekend: false },
      { label: '평일 저녁 (17~21시)', hour: 18, weekend: false },
      { label: '주말 오전 (7~10시)', hour: 8, weekend: true },
      { label: '주말 낮 (10~14시)', hour: 11, weekend: true },
      { label: '주말 오후 (14~18시)', hour: 15, weekend: true },
    ];
    return slots.map(s => ({
      label: s.label,
      level: this.toInfo(this.calcLevel(spotType, s.hour, s.weekend)),
    }));
  }
}
