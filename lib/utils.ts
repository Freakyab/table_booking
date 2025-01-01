import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { FormData, TimeSlot, FormErrors, SlotTime } from '@/types';
import { useState, useEffect } from "react";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateTimeSlots = (selectedDate: Date): TimeSlot[] => {
  const [allFilledSlots, setAllFilledSlots] = useState<SlotTime[]>([]);

  useEffect(() => {
    const fetchTimeSlots = async () => {
      const res = await fetch("http://localhost:8000/booking/getDate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: selectedDate }),

      });
      const data = await res.json();
      setAllFilledSlots(data.data);
    };
    fetchTimeSlots();
  }, [selectedDate]);

  const slots = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startHour = selectedDate.getDate() === today.getDate() ?
    new Date().getHours() + 1 : 10;

  for (let hour = startHour; hour <= 23; hour++) {
    const time = `${hour.toString().padStart(2, '0')}:00`;

    const isAvailable = allFilledSlots.filter((slot) => slot.time === time && new Date(slot.date).getDate() === selectedDate.getDate()
    ).length === 0;

    slots.push({ time, available: isAvailable });

  }
  
  return slots;
};
export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {};
  if (!formData.firstName.trim()) errors.firstName = 'First name is required';
  if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!formData.email.includes('@') || !formData.email.includes('.')) {
    errors.email = 'Invalid email format';
  }
  if (!formData.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else {
    const cleanedPhone = formData.phone.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      errors.phone = 'Invalid phone number';
    }
  }
  return errors;
};

export const getWeekDates = (date: Date): Date[] => {
  const dates = [];
  const currentDate = new Date(date);
  const Sunday = currentDate.getDate() - currentDate.getDay();
  currentDate.setDate(Sunday);

  for (let i = 0; i < 7; i++) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};