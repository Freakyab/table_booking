import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimeSlotProps {
  time: string;
  available: boolean;
  selected: boolean;
  onSelect: (time: string) => void;
}

export const TimeSlot = ({
  time,
  available,
  selected,
  onSelect,
}: TimeSlotProps) => (


  <Button
    type="button"
    variant={selected ? "default" : "outline"}
    className={`w-full ${!available && "opacity-50 cursor-not-allowed"}`}
    onClick={() => available && onSelect(time)}
    disabled={!available || time === ""}>
    {time}
    {available ? (
      <div>
        <Badge variant="secondary" className="ml-2">
          Available
        </Badge>
      </div>
    ) : (
      <div>
        <Badge variant="destructive" className="ml-2">
          Booked
        </Badge>
      </div>
    )}
  </Button>
);
