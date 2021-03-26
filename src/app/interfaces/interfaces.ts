export interface Menu {
    title: string;
    icon: string;
    redirect: string;
};

export interface LoginForm {
    email: string;
    password: string;
    source: string;
    firebaseToken: string;
};

export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    mobile: string;
    userType: string;
};

export interface UpdateForm {
    name: string;
    gender: string;
    weight: string;
    height: string;
    mobile: string;
    birthday: string;
    email: string;
    userType: string;
}

export interface Diseases {
    diabetes: boolean;
    hypertension: boolean;
    heartDisease: boolean;
    epilepsy: boolean;
    prevSurgeries: boolean;
}

export interface Card {
    number: string;
    month: string;
    year: string;
    cvc: string;
    user: string;
}

export interface Address {
    city: string
    country: string
    latitude: number
    longitude: number
    name: string
    neighborhood: string
    state: string
    street: string
}

export interface AddressList {
    _id: string,
    city: string
    clientId: string
    country: string
    latitude: number
    longitude: number
    name: string
    neighborhood: string
    number: string
    references: string
    state: string
    street: string
    zipcode: string
}

export interface ItemCart {
    _id: string,
    name: string,
    description: string,
    price: number,
    quantity: number,
    fileName: string
  }

export interface PayMethod {
    brand: string, 
    cardID: string, 
    default_source: string, 
    last4: string
}

export interface ScheduledEvent {
    title: string,
    endTime: Date,
    startTime: Date,
    hour: string,
    allDay: boolean
}

export interface ItemPharm {
    _id: string
    description: string
    parent: string
    quantity: number
    total_amount: number
    unit_amount: number
}

