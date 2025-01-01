"use client";
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeSlot } from "./TimeSlot";
import { ContactForm } from "./ContactForm";
import { TimelineView } from "./TimelineView";
import { FormData } from "../types";
import { generateTimeSlots, validateForm, getWeekDates } from "../lib/utils";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TableBookingSystem = () => {
  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [partySize, setPartySize] = useState("2");
  const [weekDates, setWeekDates] = useState<Date[]>(getWeekDates(date));
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
  });
  const { toast } = useToast();

  const timeSlots = generateTimeSlots(date);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      setSelectedTime("");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const errors = validateForm(formData);

    if (Object.keys(errors).length === 0) {
      const res = await fetch("http://localhost:8000/booking/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          time: selectedTime,
          date,
          partySize,
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.status == "success") {
        toast({
          title: "Booking Successful",
          description: "Your table has been booked successfully!",
        });
        setSelectedTime("");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          specialRequests: "",
        });
        setDate(new Date());
        setPartySize("2");
      }
    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description:
          errors.email || errors.phone || errors.firstName || errors.lastName,
        
      });
    }
    setIsLoading(false);
  };

  const handleTimelineSelect = (newDate: Date, time: string) => {
    setDate(newDate);
    setSelectedTime(time);
  };

  return (
    <>
      {isLoading ? (
        <Loader2 className="w-10 h-10 text-primary-500 mx-auto animate-spin" />
      ) : (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Restaurant Table Booking
            </CardTitle>
            <CardDescription className="text-center">
              Choose your preferred view to select your dining time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="calendar" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calendar">Calendar View</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline View</TabsTrigger>
                </TabsList>

                <TabsContent value="calendar">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        className="rounded-md border"
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="mb-4">
                        <Label>Party Size</Label>
                        <Select value={partySize} onValueChange={setPartySize}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select party size" />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                              <SelectItem key={size} value={size.toString()}>
                                {size} {size === 1 ? "person" : "people"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Available Time Slots</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {timeSlots.map((slot) => (
                            <TimeSlot
                              key={slot.time}
                              time={slot.time}
                              available={slot.available}
                              selected={selectedTime === slot.time}
                              onSelect={setSelectedTime}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="timeline">
                  <TimelineView
                    weekDates={weekDates}
                    setWeekDates={setWeekDates}
                    selectedDate={date}
                    setDate={setDate}
                    selectedTime={selectedTime}
                    onSelectDateTime={handleTimelineSelect}
                  />
                </TabsContent>
              </Tabs>

              {selectedTime && (
                <ContactForm formData={formData} onChange={handleInputChange} />
              )}

              {selectedTime && (
                <Button type="submit" className="w-full" size="lg">
                  Book Table for {partySize}{" "}
                  {parseInt(partySize) === 1 ? "person" : "people"} on{" "}
                  {date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at {selectedTime}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default TableBookingSystem;
