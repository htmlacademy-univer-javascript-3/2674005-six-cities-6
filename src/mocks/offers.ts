export type Offer = {
  id: number;
  title: string;
  type: string;
  price: number;
  isFavorite: boolean;
  isPremium: boolean;
  rating: number;
  city: string;
  image: string;
};

export const offers: Offer[] = [
  {
    id: 1,
    title: 'Уютная студия в центре Амстердама',
    type: 'Apartment',
    price: 120,
    isFavorite: true,
    isPremium: true,
    rating: 4.8,
    city: 'Amsterdam',
    image: 'img/apartment-01.jpg'
  },
  {
    id: 2,
    title: 'Просторный лофт рядом с парком',
    type: 'Apartment',
    price: 90,
    isFavorite: false,
    isPremium: false,
    rating: 4.3,
    city: 'Amsterdam',
    image: 'img/room.jpg'
  },
  {
    id: 3,
    title: 'Дом с видом на канал',
    type: 'House',
    price: 200,
    isFavorite: true,
    isPremium: false,
    rating: 4.9,
    city: 'Amsterdam',
    image: 'img/apartment-02.jpg'
  },
  {
    id: 4,
    title: 'Стильные апартаменты в историческом районе',
    type: 'Apartment',
    price: 150,
    isFavorite: false,
    isPremium: true,
    rating: 4.7,
    city: 'Amsterdam',
    image: 'img/apartment-03.jpg'
  }
];
