export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests: string;
  }
export interface SlotTime {
  date: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests: string;
    _id : string;
    time: string;
  }
  
  export interface TimeSlot {
    time: string;
    available: boolean;
  }
  
  export interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }