
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
    <Card className={`overflow-hidden hover-lift group border-bezel-light-gray ${featured ? 'ring-1 ring-bezel-black' : ''}`}>
      <div className="relative">
        {featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="default" className="bg-bezel-black text-white text-xs px-2 py-1">
              Featured
            </Badge>
          </div>
        )}
        <Link to={`/watch/${watch.id}`}>
          <div className="aspect-square overflow-hidden bg-bezel-light-gray">
            <img 
              src={watch.images[0]} 
              alt={`${watch.brand} ${watch.model}`} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" 
            />
          </div>
        </Link>
      </div>
      <CardContent className="p-5">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base font-medium text-bezel-black tracking-tight">{watch.brand}</h3>
            <p className="text-sm text-bezel-gray mt-0.5">{watch.model}</p>
          </div>
          <span className="font-serif text-base font-medium text-bezel-black">
            {formatPrice(watch.price, watch.rentalPeriod)}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={watch.ownerProfileImage} alt={watch.ownerName} />
              <AvatarFallback className="bg-bezel-light-gray text-bezel-black text-xs">{watch.ownerName.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-bezel-gray">{watch.ownerName}</span>
          </div>
          <div className="text-xs text-bezel-gray">
            {watch.specifications.condition}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WatchCard;
