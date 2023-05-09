export interface IUserResponceModel {
  success: boolean;
  data: {
    name: string;
    token: string;
  };
  message?: string;
}

export interface IProduct {
  _id: string;
  image: string;
  name: string;
  price: number;
  description: string;
}

export interface IProductResponceModel {
  success: boolean;
  data: IProduct[];
  message?: string;
}
