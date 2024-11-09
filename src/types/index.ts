// Previous types remain unchanged...

export interface RoomsDetails {
  kitchens: number;
  living_rooms: number;
  dining_rooms: number;
  storage_rooms: number;
  maid_rooms: number;
  driver_rooms: number;
}

export interface OutdoorSpace {
  balcony: boolean;
  balcony_size?: number;
  roof: boolean;
  roof_size?: number;
  garden: boolean;
  garden_size?: number;
  patio: boolean;
  patio_size?: number;
}

export interface StreetDetails {
  street_width: number;
  street_type: 'commercial' | 'residential' | 'mixed';
  corner_plot: boolean;
  number_of_streets: number;
  main_street_view: boolean;
}

export interface OwnershipDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploaded_at: string;
}

// Update the Unit interface
export interface Unit {
  id: string;
  unit_number: string;
  floor_number?: string;
  type: 'apartment' | 'office' | 'shop' | 'warehouse';
  size_sqm: number;
  bedrooms?: number;
  bathrooms?: number;
  yearly_rent: number;
  payment_terms: 'annual' | 'semi-annual' | 'quarterly' | 'monthly';
  status: 'vacant' | 'occupied' | 'maintenance';
  features?: {
    water_meter?: string;
    electricity_meter?: string;
    has_ac?: boolean;
    has_kitchen?: boolean;
    notes?: string;
  };
  rooms_details?: RoomsDetails;
  outdoor_spaces?: OutdoorSpace;
  street_details?: StreetDetails;
  ownership_documents?: OwnershipDocument[];
  building?: {
    id: string;
    name: string;
  };
  is_listed_marketplace?: boolean;
  marketplace_description?: string;
  marketplace_photos?: string[];
  marketplace_amenities?: {
    parking?: boolean;
    security?: boolean;
    gym?: boolean;
    pool?: boolean;
    elevator?: boolean;
  };
  marketplace_virtual_tour_url?: string;
}