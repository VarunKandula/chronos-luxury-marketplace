
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useWatches } from "@/context/WatchContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const WatchDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getWatchById } = useWatches();
  const { isAuthenticated, user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [bookingRange, setBookingRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  
  const watch = getWatchById(id ?? "");
  
  if (!watch) {
    return (
      <div className="container mx-auto px-4 py-12 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-3xl font-bold">Watch Not Found</h2>
        <p className="mb-8 text-lg text-gray-600">The watch you're looking for does not exist or has been removed.</p>
        <Button onClick={() => navigate("/")}>Return to Home</Button>
      </div>
    );
  }
  
  const handleRentNow = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to rent this watch");
      return;
    }
    
    if (!bookingRange.from || !bookingRange.to) {
      toast.error("Please select a rental period");
      return;
    }
    
    // Here would be the logic to handle the rental process
    toast.success("Booking request sent to the owner!");
  };
  
  const handleContactOwner = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to contact the owner");
      return;
    }
    
    // Here would be the logic to open a messaging interface
    toast.success("Message sent to the owner!");
  };
  
  const formatPrice = (price: number, period: string) => {
    const periodMap: Record<string, string> = {
      day: "day",
      week: "week",
      month: "month",
    };
    return `$${price} per ${periodMap[period]}`;
  };
  
  const calculateTotalPrice = () => {
    if (!bookingRange.from || !bookingRange.to) return 0;
    
    const start = new Date(bookingRange.from);
    const end = new Date(bookingRange.to);
    let days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (days < 1) days = 1;
    
    let totalPrice = 0;
    
    if (watch.rentalPeriod === "day") {
      totalPrice = days * watch.price;
    } else if (watch.rentalPeriod === "week") {
      const weeks = Math.ceil(days / 7);
      totalPrice = weeks * watch.price;
    } else if (watch.rentalPeriod === "month") {
      const months = Math.ceil(days / 30);
      totalPrice = months * watch.price;
    }
    
    return totalPrice;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column - Images */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg">
            <img
              src={watch.images[selectedImage]}
              alt={`${watch.brand} ${watch.model}`}
              className="h-auto w-full object-cover"
            />
          </div>
          
          {watch.images.length > 1 && (
            <div className="mt-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {watch.images.map((image, index) => (
                    <CarouselItem key={index} className="basis-1/4 md:basis-1/5">
                      <div 
                        className={cn(
                          "cursor-pointer overflow-hidden rounded border-2",
                          selectedImage === index 
                            ? "border-luxury-navy" 
                            : "border-transparent"
                        )}
                        onClick={() => setSelectedImage(index)}
                      >
                        <img
                          src={image}
                          alt={`${watch.brand} ${watch.model} thumbnail ${index + 1}`}
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0" />
                <CarouselNext className="right-0" />
              </Carousel>
            </div>
          )}
          
          {/* Watch Details */}
          <div className="mt-8">
            <div className="flex flex-wrap items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold">
                  {watch.brand} {watch.model}
                </h1>
                <p className="mt-1 text-xl font-medium text-luxury-navy">
                  {formatPrice(watch.price, watch.rentalPeriod)}
                </p>
              </div>
              
              {watch.reviews && watch.reviews.length > 0 && (
                <div className="flex items-center">
                  <span className="flex items-center">
                    {Array(5).fill(null).map((_, index) => (
                      <Star
                        key={index}
                        className={cn(
                          "h-5 w-5",
                          index < Math.round(
                            watch.reviews!.reduce((acc, review) => acc + review.rating, 0) / 
                            watch.reviews!.length
                          )
                            ? "fill-luxury-gold text-luxury-gold"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    ({watch.reviews.length} reviews)
                  </span>
                </div>
              )}
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-6">
              <div>
                <h2 className="mb-2 text-xl font-medium">Description</h2>
                <p className="text-gray-700">{watch.description}</p>
              </div>
              
              <div>
                <h2 className="mb-2 text-xl font-medium">Specifications</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <span className="text-sm text-gray-500">Diameter</span>
                    <p className="font-medium">{watch.specifications.diameter}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <span className="text-sm text-gray-500">Movement</span>
                    <p className="font-medium">{watch.specifications.movement}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <span className="text-sm text-gray-500">Case Material</span>
                    <p className="font-medium">{watch.specifications.caseMaterial}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <span className="text-sm text-gray-500">Strap Material</span>
                    <p className="font-medium">{watch.specifications.strapMaterial}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <span className="text-sm text-gray-500">Year of Manufacture</span>
                    <p className="font-medium">{watch.specifications.yearOfManufacture}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3">
                    <span className="text-sm text-gray-500">Condition</span>
                    <p className="font-medium">{watch.specifications.condition}</p>
                  </div>
                </div>
              </div>
              
              {watch.reviews && watch.reviews.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-medium">Reviews</h2>
                  <div className="space-y-4">
                    {watch.reviews.map((review, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{review.reviewerName}</span>
                              <div className="flex">
                                {Array(5).fill(null).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={cn(
                                      "h-4 w-4",
                                      i < review.rating
                                        ? "fill-luxury-gold text-luxury-gold"
                                        : "text-gray-300"
                                    )}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Right Column - Booking & Owner Info */}
        <div className="space-y-6">
          {/* Booking Card */}
          <Card>
            <CardHeader>
              <CardTitle>Book This Watch</CardTitle>
              <CardDescription>
                Select your rental dates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium">From</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingRange.from ? (
                            format(bookingRange.from, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={bookingRange.from}
                          onSelect={(date) =>
                            setBookingRange((prev) => ({ ...prev, from: date }))
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">To</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !bookingRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {bookingRange.to ? (
                            format(bookingRange.to, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={bookingRange.to}
                          onSelect={(date) =>
                            setBookingRange((prev) => ({ ...prev, to: date }))
                          }
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                {bookingRange.from && bookingRange.to && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex justify-between">
                      <span>Price</span>
                      <span>{formatPrice(watch.price, watch.rentalPeriod)}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">${calculateTotalPrice()}</span>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleRentNow} className="w-full bg-luxury-navy hover:bg-luxury-navy/90">
                    Rent Now
                  </Button>
                  <Button onClick={handleContactOwner} variant="outline" className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                  </Button>
                </div>
                
                <p className="text-xs text-gray-500">
                  By renting, you agree to our rental terms and conditions including insurance requirements.
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Owner Info */}
          <Card>
            <CardHeader>
              <CardTitle>About the Owner</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={watch.ownerProfileImage} alt={watch.ownerName} />
                  <AvatarFallback>{watch.ownerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{watch.ownerName}</p>
                  <p className="text-sm text-gray-500">Watch Enthusiast</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/profile/${watch.ownerId}`)}
              >
                View Profile
              </Button>
            </CardFooter>
          </Card>
          
          {/* Policy Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Rental Policies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start space-x-2">
                <Badge className="mt-0.5 bg-green-100 text-green-800 hover:bg-green-100">Insurance</Badge>
                <p className="text-sm">All watches are fully insured during the rental period.</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="mt-0.5 bg-blue-100 text-blue-800 hover:bg-blue-100">Deposit</Badge>
                <p className="text-sm">A security deposit will be required before rental.</p>
              </div>
              <div className="flex items-start space-x-2">
                <Badge className="mt-0.5 bg-amber-100 text-amber-800 hover:bg-amber-100">Verification</Badge>
                <p className="text-sm">ID verification required for all rentals.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WatchDetailPage;
