import firebase from 'firebase/compat/app';

export type User = firebase.User

export type Coffee = {
  id?: number,
  name?: string,
  detail?: string,
  lsizePrice?: number,
  msizePrice?: number,
  pic?: string
}

export type Topping = {
  id?: number,
  name?: string,
  lsizePrice?: number,
  msizePrice?: number,
}

export type CartType = {
  id?: string,
  userName: string,
  address: string,
  addressNumber: string,
  phoneNumber: string,
  cartItemList: {
    id: number,
    quantity: number,
    total: number,
    size: string,
    topping: string[]
  }[],
  mailAddress: string,
  deliveryDate: string,
  deliveryTime: string,
  orderDate: string,
  status: number,
}

export type MyCart = {
  coffee: {
    id?: number | undefined;
    name?: string | undefined;
    detail?: string | undefined;
    lsizePrice?: number | undefined;
    msizePrice?: number | undefined;
    pic?: string | undefined;
  };
  cart: {
    id: number;
    quantity: number;
    total: number;
    size: string;
    topping: string[];
  };
}

export type CartInfo = {
  id: number;
  quantity: number;
  total: number;
  size: string;
  topping: string[];
}

export type Error = {
  name?: string,
  email?: string,
  addressnum?: string,
  address?: string,
  tel?: string,
  date?: string,
  time?: string,
  status?: string,
}

export type HistoryData = {
  price: number,
  coffee: string[],
  orderDate: string
}