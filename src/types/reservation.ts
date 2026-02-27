export type ReservationStatus =
  | "confirmed"
  | "seated"
  | "completed"
  | "cancelled"
  | "no_show";

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
  status: ReservationStatus;
  created_at: string;
}

export interface CreateReservationPayload {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
}