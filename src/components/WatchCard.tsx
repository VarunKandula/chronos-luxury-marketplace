
import { Link } from "react-router-dom";
import { Watch } from "@/context/WatchContext";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface WatchCardProps {
  watch: Watch;
  featured?: boolean;
}

const WatchCard = ({ watch, featured }: WatchCardProps) => {
  const formatPrice = (price: number, period: string) => {
    return `$${price}/${period.charAt(0)}`;
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${featured ? 'border-luxury-gold border-2' : ''}`}>
      <div className="relative">
        {featured && (
          <div className="absolute top-0 right-0 z-10 m-2">
            <Badge variant="default" className="bg-luxury-gold hover:bg-luxury-gold/90">
              Featured
            </Badge>
          </div>
        )}
        <Link to={`/watch/${watch.id}`}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={watch.images[0]} 
              alt={`${watch.brand} ${watch.model}`} 
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" 
            />
          </div>
        </Link>
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-medium">{watch.brand}</h3>
          <span className="font-serif text-lg font-semibold text-luxury-navy">
            {formatPrice(watch.price, watch.rentalPeriod)}
          </span>
        </div>
        <p className="text-sm text-gray-600">{watch.model}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={watch.ownerProfileImage} alt={watch.ownerName} />
              <AvatarFallback>{watch.ownerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">{watch.ownerName}</span>
          </div>
          <div className="text-xs text-gray-500">
            {watch.specifications.condition}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchCard;
