export type Offer = {
  id: number;
  title: string;
  type: string;
  price: number;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  previewImage?: string;
  image: string;
  city: {
    name: string;
  };
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
};

export const offers: Offer[] = [
  {
    id: 1,
    title: 'Beautiful & luxurious apartment at great location',
    type: 'Apartment',
    price: 120,
    isPremium: true,
    isFavorite: false,
    rating: 4.8,
    image: 'img/apartment-01.jpg',
    previewImage: 'img/apartment-01.jpg',
    city: { name: 'Amsterdam' },
    location: {
      latitude: 52.3909553943508,
      longitude: 4.85309666406198,
      zoom: 12
    }
  },
  {
    id: 2,
    title: 'Wood and stone place',
    type: 'Apartment',
    price: 80,
    isPremium: false,
    isFavorite: true,
    rating: 4.0,
    image: 'img/apartment-02.jpg',
    previewImage: 'img/apartment-02.jpg',
    city: { name: 'Amsterdam' },
    location: {
      latitude: 52.3609553943508,
      longitude: 4.85309666406198,
      zoom: 12
    }
  },
  {
    id: 3,
    title: 'Canal view Prinsengracht',
    type: 'House',
    price: 200,
    isPremium: false,
    isFavorite: false,
    rating: 4.5,
    image: 'img/apartment-03.jpg',
    previewImage: 'img/apartment-03.jpg',
    city: { name: 'Amsterdam' },
    location: {
      latitude: 52.3909553943508,
      longitude: 4.929309666406198,
      zoom: 12
    }
  },
  {
    id: 4,
    title: 'Nice, cozy, warm big bed apartment',
    type: 'Apartment',
    price: 150,
    isPremium: true,
    isFavorite: false,
    rating: 4.9,
    image: 'img/apartment-01.jpg',
    previewImage: 'img/apartment-01.jpg',
    city: { name: 'Amsterdam' },
    location: {
      latitude: 52.3809553943508,
      longitude: 4.939309666406198,
      zoom: 12
    }
  }
];
