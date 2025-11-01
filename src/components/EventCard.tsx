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

const EventCard = ({ 
  id, 
  title, 
  type, 
  date, 
  time, 
  location, 
  quota, 
  registered, 
  description, 
  status 
}: EventCardProps) => {
  const typeColors = {
    "Open Class": "bg-primary/10 text-primary border-primary/20",
    "Seminar": "bg-purple-100 text-purple-700 border-purple-200",
    "Webinar": "bg-emerald-100 text-emerald-700 border-emerald-200",
  };

  const availableSpots = quota - registered;
  const isAvailable = status === "open" && availableSpots > 0;
  const progressPercentage = (registered / quota) * 100;

  return (
    <Card className="group hover:shadow-md transition-all duration-300 border border-border bg-card h-full flex flex-col">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </CardTitle>
          <Badge 
            variant="outline" 
            className={`${typeColors[type]} text-xs font-medium whitespace-nowrap flex-shrink-0`}
          >
            {type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {description}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-3 pb-4 flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{date} • {time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{location}</span>
        </div>
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {registered}/{quota} peserta
              </span>
            </div>
            {availableSpots <= 5 && availableSpots > 0 && (
              <span className="text-xs font-medium text-destructive">
                {availableSpots} tersisa
              </span>
            )}
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                progressPercentage > 80 ? "bg-destructive" : "bg-primary"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link to={`/informasi/${id}`} className="w-full">
          <Button 
            variant={isAvailable ? "default" : "outline"} 
            className="w-full text-sm font-medium"
            size="sm"
            disabled={!isAvailable}
          >
            {status === "closed" ? "Ditutup" : status === "full" ? "Penuh" : "Lihat Detail"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard