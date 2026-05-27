import { Injectable, signal } from '@angular/core';

export type WeatherLevel = 'clear' | 'cloudy' | 'drizzle' | 'rain' | 'snow' | 'storm';

export interface WeatherInfo {
  level: WeatherLevel;
  emoji: string;
  label: string;
  tempC: number;
  // 1.0 = 변화 없음, <1 = 혼잡도 낮춤, >1 = 혼잡도 높임
  congestionFactor: number;
}

// Open-Meteo WMO weather code → WeatherLevel
function toLevel(code: number): WeatherLevel {
  if (code >= 95) return 'storm';
  if (code >= 71) return 'snow';
  if (code >= 61 || code >= 80) return 'rain';
  if (code >= 51) return 'drizzle';
  if (code >= 45) return 'cloudy';
  if (code >= 1)  return 'cloudy';
  return 'clear';
}

function toEmoji(level: WeatherLevel): string {
  return { clear: '☀️', cloudy: '⛅', drizzle: '🌦️', rain: '🌧️', snow: '❄️', storm: '⛈️' }[level];
}

function toLabel(level: WeatherLevel, temp: number): string {
  if (level === 'storm') return '천둥번개';
  if (level === 'snow')  return '눈';
  if (level === 'rain')  return '비';
  if (level === 'drizzle') return '이슬비';
  if (temp > 33) return '폭염';
  if (temp < 0)  return '한파';
  if (level === 'cloudy') return '흐림';
  return '맑음';
}

// 날씨·기온 → 혼잡도 보정 계수
function calcFactor(level: WeatherLevel, temp: number): number {
  if (level === 'storm')   return 0.05;
  if (level === 'snow')    return 0.15;
  if (level === 'rain')    return 0.20;
  if (level === 'drizzle') return 0.45;
  if (temp > 35 || temp < -5) return 0.35;
  if (temp > 30 || temp < 2)  return 0.60;
  // 맑고 쾌적한 날씨 → 평소보다 사람 많음
  if (level === 'clear' && temp >= 12 && temp <= 26) return 1.25;
  return 1.0;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  // 로딩 중엔 null, 가져온 후엔 WeatherInfo
  readonly current = signal<WeatherInfo | null>(null);

  constructor() {
    this.fetch();
    // 30분마다 갱신
    setInterval(() => this.fetch(), 30 * 60 * 1000);
  }

  private async fetch() {
    try {
      // 대전 중심 좌표 (세종과 30km 거리라 날씨 큰 차이 없음)
      const url =
        'https://api.open-meteo.com/v1/forecast' +
        '?latitude=36.35&longitude=127.38' +
        '&current=weather_code,temperature_2m,precipitation' +
        '&timezone=Asia%2FSeoul';
      const res = await fetch(url);
      const data = await res.json();
      const { weather_code, temperature_2m } = data.current;

      const level = toLevel(weather_code);
      const temp  = Math.round(temperature_2m);
      this.current.set({
        level,
        emoji:            toEmoji(level),
        label:            toLabel(level, temp),
        tempC:            temp,
        congestionFactor: calcFactor(level, temp),
      });
    } catch {
      // 네트워크 오류 시 기존 값 유지 (null이면 기존 시간대 로직만 사용)
    }
  }
}
