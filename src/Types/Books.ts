export interface Book {
    id: number;
    bookName: string;
    authorId: string;
    genreId: number;
    categoryId: number;
    bookDescription: string;
    averageRating: number;
  }
  
  export interface Genre {
    genreId: number;
    genreName: string;
  }
  
  export interface Category {
    categoryId: number;
    categoryName: string;
  }
  
  export interface User {
    id: string;
    userName: string;
    role: string;
  }
  
  export interface CriticRating {
    ratingId: number;
    bookId: number;
    ratingValue: number;
    raterId: string;
    bookName: string;
    genreId: number;
    categoryId: number;
  }
  