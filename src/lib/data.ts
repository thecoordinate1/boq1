import type { BOQItem, MapPoint, MapPointData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const initialBoqItems: BOQItem[] = [
  {
    id: '1',
    description: 'Site clearance and removal of vegetation',
    unit: 'sq.m',
    quantity: 150,
    rate: 15.50,
  },
  {
    id: '2',
    description: 'Excavation of existing drainage channel',
    unit: 'cu.m',
    quantity: 75,
    rate: 55.00,
  },
  {
    id: '3',
    description: 'Supply and lay 150mm diameter perforated drainage pipe',
    unit: 'm',
    quantity: 200,
    rate: 45.75,
  },
  {
    id: '4',
    description: 'Backfilling with approved granular material',
    unit: 'cu.m',
    quantity: 80,
    rate: 85.20,
  },
];

const mapPointPlaceholders: MapPointData[] = PlaceHolderImages.map(p => ({
  id: p.id,
  title: p.description,
  description: p.description, // Can be more detailed if needed
  image: {
    url: p.imageUrl,
    hint: p.imageHint,
  }
}));

export const mapPoints: MapPoint[] = [
  {
    ...mapPointPlaceholders.find(p => p.id === 'map-point-1')!,
    position: { lat: 51.518, lng: -0.095 },
  },
  {
    ...mapPointPlaceholders.find(p => p.id === 'map-point-2')!,
    position: { lat: 51.512, lng: -0.088 },
  },
  {
    ...mapPointPlaceholders.find(p => p.id === 'map-point-3')!,
    position: { lat: 51.516, lng: -0.082 },
  },
];
