export type BOQItem = {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
};

export type MapPointData = {
  id: string;
  title: string;
  description: string;
  image: {
    url: string;
    hint: string;
  };
}

export type MapPoint = MapPointData & {
  position: { lat: number; lng: number };
};
