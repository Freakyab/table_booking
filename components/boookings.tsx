import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  Mail,
  Trash2,
  Gem,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BookingCard = ({
  booking,
  setRefresh,
}: {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  booking: {
    _id: string;
    firstName: string;
    lastName: string;
    date: string;
    time: string;
    partySize: number;
    phone: string;
    email: string;
    specialRequests: string;
  };
}) => {
  const { toast } = useToast();
  const handleDeleteBooking = async () => {
    try {
      if (!confirm("Are you sure you want to delete this booking?")) {
        return;
      }

      const res = await fetch(`http://localhost:8000/booking/${booking._id}`, {
        method: "DELETE",
      });
      if (res.status !== 200) {
        // console.error("Failed to delete booking");
        toast({
          title: "Error",
          description: "Failed to delete booking",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "Booking deleted successfully",
      });
      setRefresh((prev) => !prev);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error",
        description: "Failed to delete booking",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-96">
      <CardHeader className="bg-primary/5 ">
        <div className="flex justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {booking.firstName} {booking.lastName}'s Booking
            </h2>
            <span className="text-xs font-light text-primary">
              Order id: {booking._id}
            </span>
          </div>
          <Trash2
            className="h-6 w-6 text-red-500"
            onClick={handleDeleteBooking}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4 text-primary" />
          <span>{booking.date.split("T")[0]}</span>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-primary" />
          <span>{booking.time}</span>
        </div>

        <div className="flex items-center gap-3">
          <Users className="h-4 w-4 text-primary" />
          <span>
            {booking.partySize} {booking.partySize === 1 ? "person" : "people"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-primary" />
          <span>{booking.phone}</span>
        </div>

        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-primary" />
          <span className="break-all">{booking.email}</span>
        </div>

        {booking.specialRequests && (
          <div className="space-y-2">
            <Gem className="h-4 w-4 text-primary" />
            <p>{booking.specialRequests}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BookingCard;
