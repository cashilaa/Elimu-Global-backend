export interface User {
  id: string;
  created_at: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'instructor' | 'admin';
  avatar_url?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  qualification?: string;
  expertise?: string;
  experience?: string;
  bio?: string;
  phone_number?: string;
}

export interface Course {
  id: string;
  created_at: string;
  title: string;
  description: string;
  price: number;
  instructor_id: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  thumbnail_url?: string;
  status: 'draft' | 'published' | 'archived';
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  content: string;
  order: number;
  video_url?: string;
  duration?: number;
}

export interface Enrollment {
  id: string;
  created_at: string;
  user_id: string;
  course_id: string;
  status: 'active' | 'completed' | 'cancelled';
  progress: number;
}

export interface Payment {
  id: string;
  created_at: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  transaction_id: string;
}

export interface Review {
  id: string;
  created_at: string;
  user_id: string;
  course_id: string;
  rating: number;
  comment: string;
}
