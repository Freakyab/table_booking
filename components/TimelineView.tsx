import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

interface TimelineViewProps {
  weekDates: Date[];
  selectedDate: Date;
  selectedTime: string;
  onSelectDateTime: (date: Date, time: string) => void;
  setWeekDates: React.Dispatch<React.SetStateAction<Date[]>>;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}

export const TimelineView = ({
  weekDates,
  selectedDate,
  setDate,
  setWeekDates,
  selectedTime,
  onSelectDateTime,
}: TimelineViewProps) => {
  const [filledSlots, setFilledSlots] = useState<
    {
      date: Date;
      time: string;
    }[]
  >([]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchFilledSlots = async () => {
      const res = await fetch("http://localhost:8000/booking");
      const data = await res.json();
      if (res.status !== 200) {
        toast({
          title: "Error",
          description: "Failed to fetch filled",
          variant: "destructive",
        });
        return;
      }
      if (data.data) {
        setFilledSlots(data.data);
      }else{
        toast({
          title: "Error",
          description: "Failed to fetch filled",
          variant: "destructive",
        });
      }
    };

    fetchFilledSlots();
  }, [selectedDate]);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="flex justify-between my-4">
          <ChevronLeft
            className="w-6 h-6 text-gray-500 cursor-pointer"
            onClick={() =>
              setWeekDates((prev) =>
                weekDates.map(
                  (date) => new Date(date.setDate(date.getDate() - 1))
                )
              )
            }
          />
          {weekDates[0].toLocaleDateString("en-US", { day: "2-digit" })}{" "}
          {weekDates[0].toLocaleDateString("en-US", { month: "long" })}{" "}
          {weekDates[0].getFullYear()}
          <ChevronRight
            className="w-6 h-6 text-gray-500 cursor-pointer"
            onClick={() =>
              setWeekDates((prev) =>
                weekDates.map(
                  (date) => new Date(date.setDate(date.getDate() + 1))
                )
              )
            }
          />
        </div>
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="font-semibold text-gray-500">Time</div>
          {weekDates.map((date, index) => (
            <div key={index} className="text-center">
              <div className="font-semibold">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="text-sm text-gray-500">
                {date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          ))}
        </div>

        {Array.from({ length: 14 }, (_, i) => i + 10).map((hour) => (
          <div key={hour} className="grid grid-cols-8 gap-2 mb-4">
            <div className="text-sm text-gray-500">{`${hour}:00`}</div>
            {weekDates.map((date, index) => {
              const isAvailable = !filledSlots.some((slot) => {
                return (
                  new Date(slot.date).toISOString().split("T")[0] ===
                    date.toISOString().split("T")[0] &&
                  slot.time === `${hour}:00`
                );
              });

              return (
                <button
                  key={index}
                  className={`
                  p-2 h-12 relative
                  ${!isAvailable && "opacity-50 cursor-not-allowed"}
                  
                `}
                  onClick={() => {
                    if (isAvailable) {
                      onSelectDateTime(date, `${hour}:00`);
                      setDate(date);
                    }
                  }}
                  disabled={!isAvailable}>
                  {isAvailable ? (
                    <Badge
                      variant={
                        selectedDate.toISOString().split("T")[0] ===
                          date.toISOString().split("T")[0] &&
                        selectedTime === `${hour}:00`
                          ? "default"
                          : "secondary"
                      }
                      className="w-full h-full">
                      Open
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="w-full h-full">
                      Full
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
