import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type UserRole = 'CUSTOMER' | 'ARTIST' | 'STAFF' | 'ADMIN';

// Data models for the Music Store application
export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    artistName?: string;
    cover?: string;
}

export interface Music {
    id: number;
    name: string;
    title?: string; // For backward compatibility
    artist: string;
    album?: string;
    genre?: string;
    imageUrl?: string;
    coverImage?: string; // For backward compatibility
    audioFilePath?: string;
    price: number;
    description?: string;
    releaseYear?: number;
    duration?: number;
    totalSales?: number;
    averageRating: number;
    totalReviews: number;
}

export interface Playlist {
    id: number;
    name: string;
    customerId: number;
    customerUsername: string;
    trackCount: number;
    createdAt: string;
    updatedAt: string;
    musics?: Music[];
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    password: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    artistName?: string;
    cover?: string;
}

// Review types based on API documentation
export interface Review {
    id: number;
    musicId: number;
    username: string;
    customerName: string;
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt: string;
    isOwnReview: boolean;
}

export interface CreateReviewRequest {
    rating: number;
    comment: string;
}

export interface UpdateReviewRequest {
    rating: number;
    comment: string;
}

export interface ReviewsResponse {
    content: Review[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        [key: string]: number;
    };
}

// Cart types
export interface CartItem {
    id: number;
    music: Music;
    price: number;
    quantity: number;
}

export interface Cart {
    id: number;
    customerId: number;
    items: CartItem[];
    totalPrice: number;
}

// Ticket System Types
export interface TicketMessage {
  id: number;
  content: string;
  timestamp: string;
  isFromStaff: boolean;
  customer?: {
    id: number;
    username: string;
  };
  staff?: {
    id: number;
    username: string;
  };
  // Optional unified sender/author object to make frontend rendering robust.
  // Backend should populate this with the minimal user info (id, username, role).
  sender?: {
    id: number;
    username: string;
    role?: UserRole;
  };
}

export interface Ticket {
  id: number;
  subject: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'URGENT' | 'CLOSED';
  description?: string;
  priority?: string;
  customer: {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
  staff?: {
    id: number;
    username: string;
    email: string;
  } | null;
  createdAt: string;
  lastUpdated?: string;
  closedAt?: string | null;
  messages?: TicketMessage[];

  // Legacy fields for backward compatibility
  customerName?: string;
  assignedStaffName?: string | null;
  assigned?: boolean;
  closed?: boolean;
}

export interface CreateTicketRequest {
  subject: string;
  description: string;
}

export interface AddMessageRequest {
  content: string;
}
