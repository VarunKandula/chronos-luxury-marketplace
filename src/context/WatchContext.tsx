
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Watch type definition
export interface Watch {
  id: string;
  brand: string;
  model: string;
  price: number;
  rentalPeriod: 'day' | 'week' | 'month';
  images: string[];
  description: string;
  specifications: {
    diameter: string;
    movement: string;
    caseMaterial: string;
    strapMaterial: string;
    yearOfManufacture: string;
    condition: string;
  };
  ownerId: string;
  ownerName: string;
  ownerProfileImage?: string;
  availability: {
    from: string;
    to: string;
  };
  reviews?: {
    rating: number;
    comment: string;
    reviewerId: string;
    reviewerName: string;
  }[];
  featured?: boolean;
}

// Filter type definition
export interface WatchFilters {
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  rentalPeriod?: 'day' | 'week' | 'month';
  searchTerm?: string;
}

// WatchContext type definition
interface WatchContextType {
  watches: Watch[];
  filteredWatches: Watch[];
  featuredWatches: Watch[];
  filters: WatchFilters;
  setFilters: (filters: WatchFilters) => void;
  getWatchById: (id: string) => Watch | undefined;
  addWatch: (watch: Omit<Watch, 'id'>) => void;
}

// Create context
const WatchContext = createContext<WatchContextType | undefined>(undefined);

// Mock data
const mockWatches: Watch[] = [
  {
    id: '1',
    brand: 'Rolex',
    model: 'Submariner',
    price: 150,
    rentalPeriod: 'day',
    images: [
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1180&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1180&auto=format&fit=crop'
    ],
    description: 'A classic diving watch with timeless design. The Rolex Submariner is a perfect companion for both casual and formal occasions.',
    specifications: {
      diameter: '40mm',
      movement: 'Automatic',
      caseMaterial: 'Stainless Steel',
      strapMaterial: 'Stainless Steel',
      yearOfManufacture: '2019',
      condition: 'Excellent'
    },
    ownerId: '456',
    ownerName: 'James Wilson',
    ownerProfileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    availability: {
      from: '2023-01-01',
      to: '2023-12-31'
    },
    reviews: [
      {
        rating: 5,
        comment: 'Beautiful watch, arrived on time and in perfect condition.',
        reviewerId: '789',
        reviewerName: 'Emma Thompson'
      }
    ],
    featured: true
  },
  {
    id: '2',
    brand: 'Omega',
    model: 'Speedmaster',
    price: 125,
    rentalPeriod: 'day',
    images: [
      'https://images.unsplash.com/photo-1548171915-cc30f57b2d70?q=80&w=1180&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1740&auto=format&fit=crop'
    ],
    description: 'The Omega Speedmaster, also known as the "Moonwatch," is a timeless chronograph that was the first watch worn on the moon.',
    specifications: {
      diameter: '42mm',
      movement: 'Manual',
      caseMaterial: 'Stainless Steel',
      strapMaterial: 'Leather',
      yearOfManufacture: '2018',
      condition: 'Very Good'
    },
    ownerId: '456',
    ownerName: 'James Wilson',
    ownerProfileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    availability: {
      from: '2023-01-01',
      to: '2023-12-31'
    },
    featured: true
  },
  {
    id: '3',
    brand: 'Audemars Piguet',
    model: 'Royal Oak',
    price: 300,
    rentalPeriod: 'day',
    images: [
      'https://images.unsplash.com/photo-1612520986361-3980b0f457e9?q=80&w=1170&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612520961850-435ad79eaaee?q=80&w=1180&auto=format&fit=crop'
    ],
    description: 'The Royal Oak is an iconic luxury sports watch with a distinctive octagonal bezel and "tapisserie" dial pattern.',
    specifications: {
      diameter: '41mm',
      movement: 'Automatic',
      caseMaterial: 'Stainless Steel',
      strapMaterial: 'Stainless Steel',
      yearOfManufacture: '2020',
      condition: 'Mint'
    },
    ownerId: '123',
    ownerName: 'John Smith',
    ownerProfileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    availability: {
      from: '2023-01-01',
      to: '2023-12-31'
    },
    featured: true
  },
  {
    id: '4',
    brand: 'Patek Philippe',
    model: 'Nautilus',
    price: 500,
    rentalPeriod: 'day',
    images: [
      'https://images.unsplash.com/photo-1623998021446-45a51a0a9b6f?q=80&w=1180&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1180&auto=format&fit=crop'
    ],
    description: 'The Patek Philippe Nautilus is a luxury sports watch with an iconic porthole-shaped case design.',
    specifications: {
      diameter: '40mm',
      movement: 'Automatic',
      caseMaterial: 'Stainless Steel',
      strapMaterial: 'Stainless Steel',
      yearOfManufacture: '2021',
      condition: 'Mint'
    },
    ownerId: '789',
    ownerName: 'Emma Thompson',
    ownerProfileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    availability: {
      from: '2023-01-01',
      to: '2023-12-31'
    }
  },
  {
    id: '5',
    brand: 'IWC',
    model: 'Portugieser',
    price: 180,
    rentalPeriod: 'day',
    images: [
      'https://images.unsplash.com/photo-1639407622229-8c87d71be851?q=80&w=1180&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1180&auto=format&fit=crop'
    ],
    description: 'The IWC Portugieser is an elegant dress watch with a clean dial design and Arabic numerals.',
    specifications: {
      diameter: '42mm',
      movement: 'Automatic',
      caseMaterial: 'Stainless Steel',
      strapMaterial: 'Leather',
      yearOfManufacture: '2019',
      condition: 'Excellent'
    },
    ownerId: '789',
    ownerName: 'Emma Thompson',
    ownerProfileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    availability: {
      from: '2023-01-01',
      to: '2023-12-31'
    }
  },
  {
    id: '6',
    brand: 'TAG Heuer',
    model: 'Carrera',
    price: 100,
    rentalPeriod: 'day',
    images: [
      'https://images.unsplash.com/photo-1636952129218-ec8ca272a3d7?q=80&w=1180&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592415499556-74fcb9f18667?q=80&w=1180&auto=format&fit=crop'
    ],
    description: 'The TAG Heuer Carrera is a classic racing chronograph with a clean and legible dial.',
    specifications: {
      diameter: '44mm',
      movement: 'Automatic',
      caseMaterial: 'Stainless Steel',
      strapMaterial: 'Leather',
      yearOfManufacture: '2017',
      condition: 'Very Good'
    },
    ownerId: '123',
    ownerName: 'John Smith',
    ownerProfileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    availability: {
      from: '2023-01-01',
      to: '2023-12-31'
    }
  }
];

// Provider component
export const WatchProvider = ({ children }: { children: ReactNode }) => {
  const [watches, setWatches] = useState<Watch[]>(mockWatches);
  const [filters, setFilters] = useState<WatchFilters>({});
  const [filteredWatches, setFilteredWatches] = useState<Watch[]>(mockWatches);
  
  // Filter watches when filters or watch data changes
  useEffect(() => {
    let result = [...watches];
    
    if (filters.brand) {
      result = result.filter(watch => 
        watch.brand.toLowerCase().includes(filters.brand!.toLowerCase())
      );
    }
    
    if (filters.priceMin !== undefined) {
      result = result.filter(watch => watch.price >= filters.priceMin!);
    }
    
    if (filters.priceMax !== undefined) {
      result = result.filter(watch => watch.price <= filters.priceMax!);
    }
    
    if (filters.rentalPeriod) {
      result = result.filter(watch => watch.rentalPeriod === filters.rentalPeriod);
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(watch => 
        watch.brand.toLowerCase().includes(searchLower) ||
        watch.model.toLowerCase().includes(searchLower) ||
        watch.description.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredWatches(result);
  }, [watches, filters]);
  
  // Get featured watches
  const featuredWatches = watches.filter(watch => watch.featured);
  
  // Get watch by ID
  const getWatchById = (id: string) => {
    return watches.find(watch => watch.id === id);
  };
  
  // Add a new watch
  const addWatch = (watch: Omit<Watch, 'id'>) => {
    const newWatch = {
      ...watch,
      id: Date.now().toString(),
    };
    setWatches(prevWatches => [...prevWatches, newWatch]);
  };
  
  return (
    <WatchContext.Provider
      value={{
        watches,
        filteredWatches,
        featuredWatches,
        filters,
        setFilters,
        getWatchById,
        addWatch
      }}
    >
      {children}
    </WatchContext.Provider>
  );
};

// Hook to use the context
export const useWatches = () => {
  const context = useContext(WatchContext);
  if (context === undefined) {
    throw new Error('useWatches must be used within a WatchProvider');
  }
  return context;
};
