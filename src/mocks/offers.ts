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
  },
  {
    id: 5,
    title: 'Charming apartment in the heart of Paris',
    type: 'Apartment',
    price: 180,
    isPremium: true,
    isFavorite: false,
    rating: 4.7,
    image: 'img/apartment-02.jpg',
    previewImage: 'img/apartment-02.jpg',
    city: { name: 'Paris' },
    location: {
      latitude: 48.8566,
      longitude: 2.3522,
      zoom: 12
    }
  },
  {
    id: 6,
    title: 'Eiffel Tower view studio',
    type: 'Apartment',
    price: 220,
    isPremium: false,
    isFavorite: true,
    rating: 4.9,
    image: 'img/apartment-03.jpg',
    previewImage: 'img/apartment-03.jpg',
    city: { name: 'Paris' },
    location: {
      latitude: 48.8606,
      longitude: 2.3376,
      zoom: 12
    }
  },
  {
    id: 7,
    title: 'Cozy place in Montmartre',
    type: 'Room',
    price: 90,
    isPremium: false,
    isFavorite: false,
    rating: 4.3,
    image: 'img/room.jpg',
    previewImage: 'img/room.jpg',
    city: { name: 'Paris' },
    location: {
      latitude: 48.8866,
      longitude: 2.3431,
      zoom: 12
    }
  },
  {
    id: 8,
    title: 'Modern loft in Cologne',
    type: 'Apartment',
    price: 130,
    isPremium: false,
    isFavorite: false,
    rating: 4.5,
    image: 'img/apartment-01.jpg',
    previewImage: 'img/apartment-01.jpg',
    city: { name: 'Cologne' },
    location: {
      latitude: 50.9375,
      longitude: 6.9603,
      zoom: 12
    }
  },
  {
    id: 9,
    title: 'Cathedral view apartment',
    type: 'Apartment',
    price: 160,
    isPremium: true,
    isFavorite: false,
    rating: 4.8,
    image: 'img/apartment-02.jpg',
    previewImage: 'img/apartment-02.jpg',
    city: { name: 'Cologne' },
    location: {
      latitude: 50.9413,
      longitude: 6.9583,
      zoom: 12
    }
  },
  {
    id: 10,
    title: 'Stylish apartment in Brussels',
    type: 'Apartment',
    price: 140,
    isPremium: false,
    isFavorite: false,
    rating: 4.4,
    image: 'img/apartment-03.jpg',
    previewImage: 'img/apartment-03.jpg',
    city: { name: 'Brussels' },
    location: {
      latitude: 50.8503,
      longitude: 4.3517,
      zoom: 12
    }
  },
  {
    id: 11,
    title: 'Grand Place nearby apartment',
    type: 'Apartment',
    price: 170,
    isPremium: true,
    isFavorite: true,
    rating: 4.6,
    image: 'img/apartment-01.jpg',
    previewImage: 'img/apartment-01.jpg',
    city: { name: 'Brussels' },
    location: {
      latitude: 50.8467,
      longitude: 4.3525,
      zoom: 12
    }
  },
  {
    id: 12,
    title: 'Hamburg harbor view',
    type: 'Apartment',
    price: 145,
    isPremium: false,
    isFavorite: false,
    rating: 4.2,
    image: 'img/apartment-02.jpg',
    previewImage: 'img/apartment-02.jpg',
    city: { name: 'Hamburg' },
    location: {
      latitude: 53.5511,
      longitude: 9.9937,
      zoom: 12
    }
  },
  {
    id: 13,
    title: 'Modern apartment in Hamburg',
    type: 'Apartment',
    price: 155,
    isPremium: true,
    isFavorite: false,
    rating: 4.7,
    image: 'img/apartment-03.jpg',
    previewImage: 'img/apartment-03.jpg',
    city: { name: 'Hamburg' },
    location: {
      latitude: 53.5653,
      longitude: 10.0014,
      zoom: 12
    }
  },
  {
    id: 14,
    title: 'Cozy studio in Dusseldorf',
    type: 'Apartment',
    price: 110,
    isPremium: false,
    isFavorite: false,
    rating: 4.0,
    image: 'img/apartment-01.jpg',
    previewImage: 'img/apartment-01.jpg',
    city: { name: 'Dusseldorf' },
    location: {
      latitude: 51.2277,
      longitude: 6.7735,
      zoom: 12
    }
  },
  {
    id: 15,
    title: 'Rhine view apartment',
    type: 'Apartment',
    price: 135,
    isPremium: false,
    isFavorite: false,
    rating: 4.3,
    image: 'img/apartment-02.jpg',
    previewImage: 'img/apartment-02.jpg',
    city: { name: 'Dusseldorf' },
    location: {
      latitude: 51.2254,
      longitude: 6.7763,
      zoom: 12
    }
  }
];
