export interface Store {
  id: string;
  slug: string;
  name: string;
  description: string;
  logo_url: string | null;
  whatsapp_number: string;
  phone: string | null;
  address: string | null;
  maps_url: string | null;
  instagram: string | null;
  hours: HoursConfig;
  accepts_delivery: boolean;
  delivery_fee: number;
  min_order: number;
  accepts_pickup: boolean;
  payment_methods: string[];
  theme: ThemeConfig;
  welcome_message: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HoursConfig {
  [key: string]: string; // "HH:MM-HH:MM" or "closed"
}

export interface StoreTheme {
  primary: string;
  secondary: string;
  accent: string;
  radius: string;
}

export interface StoreFormValues {
  name: string;
  description: string;
  logo_url: string;
  whatsapp_number: string;
  phone: string;
  address: string;
  maps_url: string;
  instagram: string;
  accepts_delivery: boolean;
  delivery_fee: number;
  min_order: number;
  accepts_pickup: boolean;
  payment_methods: string[];
  theme: StoreTheme;
  welcome_message: string;
  is_active: boolean;
}