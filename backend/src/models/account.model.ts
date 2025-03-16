import { Record } from "jsforce";

export interface AccountRecord extends Record{
    name: string,
    website: string,
    type: string,
    description: string,
    phone: string,
    billingAddress: {
        city: string,
        country: string,
        postalCode: string,
        geocodeAccuracy: string,
        latitude: string,
        longitude: string,
        state: string,
        street: string
    },
    shippingAddress: string
    attributes: {
        type: string,
        url: string
    }
}

export interface Account {
  id: number
  name: string;
  website: string;
  type: string;
  description: string;
  phone: string;
  billingAddress: {
    city: string;
    country: string;
    postalCode: string;
    state: string;
    street: string;
  };
  shippingAddress: string;
}