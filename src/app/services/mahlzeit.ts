export interface Mahlzeit {
  id: string;
  collectionId: string;
  collectionName: string;
  created: Date;
  updated: Date;
  user: string;
  message: string;
  file: string;
  rating: number;
}
