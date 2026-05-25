import { Injectable } from '@angular/core';
import { DogSize, Spot } from '../models/spot.model';

// 이미지 출처: Wikimedia Commons (CC 라이선스) 및 Unsplash
const SPOTS: Spot[] = [
  {
    id: '1',
    name: '한밭수목원',
    address: '대전 서구 둔산대로 169',
    lat: 36.3665, lng: 127.3884,
    description: '대전 도심 속 넓은 수목원. 동·서원 합계 38만㎡의 잘 정비된 산책로와 넓은 잔디밭이 있어 모든 크기의 강아지와 여유롭게 산책할 수 있습니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['parking', 'toilet', 'bench', 'trail', 'shade'],
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Hanbat_Aboretum_Garden_under_the_Moon.jpg',
    spot_type: 'park',
  },
  {
    id: '2',
    name: '갑천 자연생태공원',
    address: '대전 서구 갑천로 217',
    lat: 36.3532, lng: 127.3423,
    description: '갑천변을 따라 이어지는 긴 직선 산책로. 탁 트인 강변 공간이 넓어 중·대형견이 마음껏 뛰기에 최적입니다. 소형견은 자전거 통행에 주의가 필요합니다.',
    size_suitable: ['medium', 'large'],
    features: ['trail', 'bench', 'water', 'shade'],
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Yuseong_at_Wolpyeong_park.JPG',
    spot_type: 'riverside',
  },
  {
    id: '3',
    name: '엑스포 과학공원',
    address: '대전 유성구 대덕대로 480',
    lat: 36.3740, lng: 127.3814,
    description: '93 대전엑스포 터에 조성된 대형 공원. 잔디광장과 호수 산책로가 잘 갖춰져 있으며 크기 제한 없이 산책하기 좋습니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['parking', 'toilet', 'bench', 'trail', 'water'],
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Daejeon_Expo_Science_Park.jpg',
    spot_type: 'park',
  },
  {
    id: '4',
    name: '보문산 시민공원',
    address: '대전 중구 보문산공원로 170',
    lat: 36.2967, lng: 127.4076,
    description: '대전 시내를 내려다볼 수 있는 숲길 산책로. 경사 구간이 있어 소형·중형견에게 적합하며, 대형견은 체력 부담이 있을 수 있습니다.',
    size_suitable: ['small', 'medium'],
    features: ['trail', 'shade', 'bench', 'toilet', 'parking'],
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Daejeon_Metropolitan_City_in_Korea%2C_view_from_Bomunsan_Fortress.jpg',
    spot_type: 'forest',
  },
  {
    id: '5',
    name: '계족산 황톳길',
    address: '대전 대덕구 장동 산 12',
    lat: 36.3952, lng: 127.4782,
    description: '총 14.5km의 황톳길 트레일. 체력이 좋은 중·대형견에게 최적의 장거리 코스입니다. 소형견은 체력 소모가 크므로 짧은 코스(2~3km)만 권장합니다.',
    size_suitable: ['medium', 'large'],
    features: ['trail', 'shade', 'parking', 'toilet', 'bench'],
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/76/Daejeon_southern_cityscape_from_Gyejoksan.jpg',
    spot_type: 'trail',
  },
  {
    id: '6',
    name: '월평공원',
    address: '대전 서구 월평동 산 1-1',
    lat: 36.3499, lng: 127.3631,
    description: '서구 도심 속 도시숲. 잘 정비된 평탄한 둘레길이 있어 소형·중형견의 일상 산책 코스로 안성맞춤입니다.',
    size_suitable: ['small', 'medium'],
    features: ['trail', 'shade', 'bench', 'parking'],
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Wolpyeong_Park.JPG',
    spot_type: 'forest',
  },
  {
    id: '7',
    name: '유성 근린공원',
    address: '대전 유성구 봉명동 278',
    lat: 36.3624, lng: 127.3363,
    description: '유성온천 인근의 아담한 근린공원. 조용하고 한적해 소형견과 느긋하게 산책하기 좋습니다. 벤치와 그늘이 풍부해 쉬어가기도 편합니다.',
    size_suitable: ['small'],
    features: ['bench', 'shade', 'water', 'toilet'],
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Yuseong_Foot_Spa_at_Night.jpg',
    spot_type: 'park',
  },
  {
    id: '8',
    name: '도안 근린공원',
    address: '대전 서구 도안동 1374',
    lat: 36.3243, lng: 127.3362,
    description: '도안 신도시에 조성된 넓은 잔디광장 공원. 펜스 구역이 있어 대형견이 목줄을 풀고 뛰어놀 수 있습니다. 주차도 넉넉합니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['parking', 'bench', 'water', 'trail', 'offleash'],
    image_url: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600&q=80',
    spot_type: 'park',
  },
  {
    id: '9',
    name: '대청호 수변공원',
    address: '대전 대덕구 미호동 일원',
    lat: 36.4634, lng: 127.5130,
    description: '대청댐 인근 광활한 호수 수변공원. 드넓은 자연 속에서 대형견이 자유롭게 산책할 수 있으며, 소형견과 함께하는 드라이브 겸 나들이 코스로도 인기입니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['parking', 'bench', 'trail', 'shade', 'toilet'],
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Daecheong_Dam_Water_Culture_Center_-_%EB%8C%80%EC%B2%AD%EB%8C%90%EB%AC%BC%EB%AC%B8%ED%99%94%EA%B4%80.jpg',
    spot_type: 'riverside',
  },
  {
    id: '10',
    name: '천연기념물센터 생태공원',
    address: '대전 유성구 대덕대로 481번길 92',
    lat: 36.3682, lng: 127.3005,
    description: '평일에는 거의 방문객이 없는 조용한 생태공원. 자연 그대로의 숲길이 소형견과 느린 산책을 즐기기에 완벽합니다.',
    size_suitable: ['small', 'medium'],
    features: ['trail', 'shade', 'bench', 'parking'],
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    spot_type: 'forest',
  },
];

@Injectable({ providedIn: 'root' })
export class SpotsService {
  getAll(): Spot[] {
    return SPOTS;
  }

  getById(id: string): Spot | undefined {
    return SPOTS.find(s => s.id === id);
  }

  getBySize(size: DogSize): Spot[] {
    return SPOTS.filter(s => s.size_suitable.includes(size));
  }
}
