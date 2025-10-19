import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  type: "Open Class" | "Seminar" | "Webinar";
  date: string;
  time: string;
  location: string;
  quota: number;
  registered: number;
  description: string;
  status: "open" | "closed" | "full";
}

const EventCard = ({ id, title, type, date, time, location, quota, registered, description, status }: EventCardProps) => {
  const typeColors = {
    "Open Class": "bg-primary/10 text-primary border-primary/20",
    "Seminar": "bg-accent/10 text-accent border-accent/20",
    "Webinar": "bg-secondary text-secondary-foreground border-border",
  };

  const availableSpots = quota - registered;
  const isAvailable = status === "open" && availableSpots > 0;

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <Badge className={typeColors[type]}>
            {type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 text-primary" />
          <span>{date} • {time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span className={availableSpots <= 5 && availableSpots > 0 ? "text-destructive font-medium" : "text-muted-foreground"}>
            {registered}/{quota} peserta
            {availableSpots <= 5 && availableSpots > 0 && (
              <span className="ml-1 text-xs">({availableSpots} slot tersisa)</span>
            )}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Link to={`/kegiatan/${id}`} className="w-full">
          <Button 
            variant={isAvailable ? "hero" : "outline"} 
            className="w-full"
            disabled={!isAvailable}
          >
            {status === "closed" ? "Ditutup" : status === "full" ? "Kuota Penuh" : "Lihat Detail"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
