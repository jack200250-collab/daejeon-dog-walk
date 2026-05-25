export type DogSize = 'small' | 'medium' | 'large';
export type SpotType = 'park' | 'trail' | 'riverside' | 'forest';
export type CongestionLevel = 'low' | 'moderate' | 'high';

export interface Spot {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  size_suitable: DogSize[];
  features: string[];
  image_url: string;
  spot_type: SpotType;
}

export interface CongestionInfo {
  level: CongestionLevel;
  label: '여유' | '원활' | '복잡';
  color: string;
  emoji: string;
}

export const DOG_SIZE_LABELS: Record<DogSize, string> = {
  small: '소형견',
  medium: '중형견',
  large: '대형견',
};

export const FEATURE_LABELS: Record<string, string | undefined> = {
  fence: '펜스 있음',
  water: '음수대',
  parking: '주차 가능',
  offleash: '목줄 해제 가능',
  shade: '그늘 충분',
  trail: '산책로 정비',
  bench: '벤치/쉼터',
  toilet: '화장실',
};
