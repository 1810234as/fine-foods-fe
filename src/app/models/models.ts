export interface IUserResponceModel {
  success: boolean;
  data: {
    name: string;
    token: string;
  };
  message?: string;
}

export interface IProduct {
  id: string;
  _id: string;
  name: string;
  price: number;
  description: string;
}

export interface IProductResponceModel {
  success: boolean;
  data: IProduct[];
  message?: string;
}

export interface DialogData {
  type: 'create' | 'update';
  product?: IProduct
}