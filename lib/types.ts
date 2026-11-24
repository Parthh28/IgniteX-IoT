// TypeScript definitions for IgniteX IoT Club

export type EventMode = 'offline' | 'online';
export type EventStatus = 'open' | 'closed' | 'upcoming';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string | null;
  venue: string;
  mode: EventMode;
  tag: string;
  status: EventStatus;
  registration_link?: string | null;
  created_at?: string;
}

export interface Registration {
  id?: string;
  event_id: string;
  full_name: string;
  email: string;
  roll_number: string;
  phone?: string | null;
  branch?: string | null;
  semester?: string | null;
  created_at?: string;
}

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  message: string;
  created_at?: string;
}

export interface MemberSocialLinks {
  github?: string | null;
  linkedin?: string | null;
  instagram?: string | null;
  email?: string | null;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo_url?: string | null;
  is_faculty: boolean;
  order_index: number;
  parent_id?: string | null;
  auth_user_id?: string | null;
  member_email?: string | null;
  course?: string | null;
  projects?: string[] | null;
  social_links?: MemberSocialLinks | null;
  sub_coordinators?: TeamMember[];
  created_at?: string;
}

export interface EventPhoto {
  id: string;
  title: string;
  event_name?: string | null;
  image_url: string;
  caption?: string | null;
  taken_date?: string | null;
  order_index: number;
  created_at?: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  error?: string;
}
