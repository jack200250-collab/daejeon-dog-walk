import { Injectable, signal } from '@angular/core';
import { DogSize, Spot } from '../models/spot.model';

const SPOTS: Spot[] = [
  {
    id: '1',
    name: '한밭수목원',
    address: '대전 서구 둔산대로 169',
    lat: 36.3665, lng: 127.3884,
    description: '대전 도심 속 넓은 수목원. 잘 정비된 산책로와 넓은 잔디밭이 있어 대형견도 마음껏 산책 가능합니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['parking', 'toilet', 'bench', 'trail', 'shade'],
    image_url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80',
    spot_type: 'park',
  },
  {
    id: '2',
    name: '갑천 자연생태공원',
    address: '대전 서구 갑천로 217',
    lat: 36.3532, lng: 127.3423,
    description: '갑천변을 따라 이어지는 긴 산책로. 탁 트인 강변에서 강아지와 함께 시원하게 산책할 수 있습니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['trail', 'bench', 'water', 'shade'],
    image_url: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80',
    spot_type: 'riverside',
  },
  {
    id: '3',
    name: '엑스포 과학공원',
    address: '대전 유성구 대덕대로 480',
    lat: 36.3740, lng: 127.3814,
    description: '넓은 잔디광장과 산책로가 있는 과학공원. 주말에는 다소 혼잡하지만 공간이 넓어 쾌적하게 산책 가능합니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['parking', 'toilet', 'bench', 'trail', 'water'],
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    spot_type: 'park',
  },
  {
    id: '4',
    name: '보문산 시민공원',
    address: '대전 중구 보문산공원로 170',
    lat: 36.2967, lng: 127.4076,
    description: '자연 그대로의 숲길 산책로. 소형~중형견에게 적합하며, 경사가 있어 대형견은 보호자가 주의가 필요합니다.',
    size_suitable: ['small', 'medium'],
    features: ['trail', 'shade', 'bench', 'toilet', 'parking'],
    image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    spot_type: 'forest',
  },
  {
    id: '5',
    name: '계족산 황톳길',
    address: '대전 대덕구 장동 산 12',
    lat: 36.3952, lng: 127.4782,
    description: '맨발 걷기로 유명한 황톳길. 14.5km의 긴 코스로 체력 좋은 강아지에게 최적. 소형견은 짧은 코스 추천.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['trail', 'shade', 'parking', 'toilet', 'bench'],
    image_url: 'https://images.unsplash.com/photo-1513836279014-a89f7d3b0e7a?w=600&q=80',
    spot_type: 'trail',
  },
  {
    id: '6',
    name: '월평공원',
    address: '대전 서구 월평동 산 1-1',
    lat: 36.3499, lng: 127.3631,
    description: '대전 서구의 대표 도시숲. 잘 정비된 둘레길과 운동시설이 있어 강아지와 함께 가볍게 산책하기 좋습니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['trail', 'shade', 'bench', 'parking'],
    image_url: 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?w=600&q=80',
    spot_type: 'forest',
  },
  {
    id: '7',
    name: '유성 근린공원',
    address: '대전 유성구 봉명동 278',
    lat: 36.3624, lng: 127.3363,
    description: '유성 온천 지구 인근의 조용한 근린공원. 소형견 산책에 특히 적합하며 벤치와 그늘이 풍부합니다.',
    size_suitable: ['small', 'medium'],
    features: ['bench', 'shade', 'water', 'toilet'],
    image_url: 'https://images.unsplash.com/photo-1567093351-f17dbf6f2e6e?w=600&q=80',
    spot_type: 'park',
  },
  {
    id: '8',
    name: '도안 근린공원',
    address: '대전 서구 도안동 1374',
    lat: 36.3243, lng: 127.3362,
    description: '신도시 도안에 조성된 넓은 공원. 잔디광장이 넓어 대형견이 뛰어놀기 좋고 주차도 편리합니다.',
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
    description: '대청댐 인근 호수 수변공원. 주말 드라이브 겸 강아지 산책으로 인기. 넓고 한적해 모든 크기의 강아지에 좋습니다.',
    size_suitable: ['small', 'medium', 'large'],
    features: ['parking', 'bench', 'trail', 'shade', 'toilet'],
    image_url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=600&q=80',
    spot_type: 'riverside',
  },
  {
    id: '10',
    name: '천연기념물센터 생태공원',
    address: '대전 유성구 대덕대로 481번길 92',
    lat: 36.3682, lng: 127.3005,
    description: '조용하고 한적한 생태공원. 평일에는 거의 사람이 없어 소형견과 여유롭게 산책하기 최고의 장소입니다.',
    size_suitable: ['small', 'medium'],
    features: ['trail', 'shade', 'bench', 'parking'],
    image_url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80',
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
