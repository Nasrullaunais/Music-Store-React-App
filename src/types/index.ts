import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};
// Data models for the Music Store application
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'CUSTOMER' | 'ARTIST' | 'STAFF' | 'ADMIN';
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
    album?: string; // This should be here and accessible
    genre?: string;
    imageUrl?: string;
    coverImage?: string; // For backward compatibility
    audioFilePath?: string;
    price: number;
    description?: string;
    releaseYear?: number;
    duration?: number;
    // Analytics and stats properties
    totalSales?: number;
    averageRating?: number;
    reviewCount?: number;
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



export interface Album {
    id: number;
    title: string;
    artist: string;
    genre: string;
    price: number;
    releaseDate: string;
    imageUrl?: string;
    description?: string;
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

export interface CartItem {
    id: number;
    album: Album;
    quantity: number;
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface CartItem {
    id: number;
    music: Music;
    quantity: number;
    totalPrice: number;
}

export interface Order {
    id: number;
    totalAmount: number;
    orderDate: string;
    status: string;
    items: Array<{
        id: number;
        music: Music;
        quantity: number;
        price: number;
    }>;
}

export interface Playlist {
    id: number;
    name: string;
    description?: string;
    tracks: Music[];
    coverImage?: string;
    isPublic: boolean;
    createdAt: string;
}




export type UserRole = 'CUSTOMER' | 'ARTIST' | 'STAFF' | 'ADMIN';
