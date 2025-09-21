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
    averageRating?: number;
    reviewCount?: number;
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

export interface RegistrationData extends LoginCredentials {
    email: string;
    role: 'CUSTOMER' | 'ARTIST';
    firstName?: string;
    lastName?: string;
    artistName?: string;
    cover?: string;
}

// Cart-related types for backend integration
export interface CartItem {
    id: number;
    unitPrice: number;
    totalPrice: number;
    music: Music;
}

export interface Cart {
    id: number;
    customerUsername: string;
    total: number;
    items: CartItem[];
}

export interface CartDto {
    id: number;
    customerUsername: string;
    total: number;
    items: CartItem[];
}

export interface OrderItem {
    id: number;
    music: Music;
    unitPrice: number;
    musicTitle: string;
    artistName: string;
}

export interface Order {
    id: number;
    customer: User;
    orderDate: string;
    totalAmount: number;
    status: string;
    paymentMethod?: string;
    orderItems: OrderItem[];
}

export interface Artist {
    id: number;
    name: string;
    biography?: string;
    imageUrl?: string;
}

export interface Genre {
    id: number;
    name: string;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}
