
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWatches } from "@/context/WatchContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MessageSquare, Clock, Calendar } from "lucide-react";
import WatchCard from "@/components/WatchCard";
import { toast } from "sonner";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { watches } = useWatches();
  
  // Determine if this is the current user's profile
  const isOwnProfile = isAuthenticated && user?.id === id;
  
  // Get profile user (in a real app, this would be fetched from the backend)
  const profileUser = {
    id: id || "",
    name: isOwnProfile ? user?.name : "James Wilson",
    email: isOwnProfile ? user?.email : "james@example.com",
    profileImage: isOwnProfile 
      ? user?.profileImage 
      : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    location: "New York, NY",
    memberSince: "January 2022",
    bio: "Watch enthusiast and collector with a passion for mechanical timepieces. I've been collecting watches for over 10 years and love sharing my collection with others.",
    watches: watches.filter(watch => watch.ownerId === id)
  };
  
  // Mock reviews data
  const reviews = [
    {
      id: "1",
      reviewerName: "Emma Thompson",
      reviewerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 5,
      comment: "Great experience renting from James. The watch was in perfect condition and he was very responsive.",
      date: "March 15, 2023"
    },
    {
      id: "2",
      reviewerName: "John Smith",
      reviewerImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      rating: 4,
      comment: "Smooth transaction and the watch was as described. Would rent again!",
      date: "February 2, 2023"
    }
  ];
  
  // Mock transaction history (only visible to the profile owner)
  const transactions = [
    {
      id: "t1",
      type: "rental",
      watchBrand: "Rolex",
      watchModel: "Submariner",
      amount: 150,
      date: "April 10, 2023",
      status: "completed"
    },
    {
      id: "t2",
      type: "listing",
      watchBrand: "Audemars Piguet",
      watchModel: "Royal Oak",
      amount: 300,
      date: "March 5, 2023",
      status: "active"
    }
  ];
  
  const handleMessageUser = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to send a message");
      navigate("/auth");
      return;
    }
    
    toast.success("Message functionality will be implemented soon");
  };
  
  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / reviews.length;
  };
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-luxury-navy to-blue-600"></div>
            <CardContent className="relative pt-0">
              <div className="-mt-16 flex flex-col items-center">
                <Avatar className="h-32 w-32 border-4 border-white">
                  <AvatarImage src={profileUser.profileImage} alt={profileUser.name} />
                  <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h1 className="mt-4 text-2xl font-bold">{profileUser.name}</h1>
                <div className="mt-1 flex items-center space-x-1">
                  <span className="flex items-center">
                    {Array(5).fill(null).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < Math.round(getAverageRating())
                            ? "fill-luxury-gold text-luxury-gold"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </span>
                  <span className="text-sm text-gray-600">
                    ({reviews.length} reviews)
                  </span>
                </div>
                
                {profileUser.location && (
                  <p className="mt-2 text-gray-600">{profileUser.location}</p>
                )}
                
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>Member since {profileUser.memberSince}</span>
                </div>
                
                {!isOwnProfile && (
                  <Button
                    onClick={handleMessageUser}
                    className="mt-4 w-full"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                  </Button>
                )}
                
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => navigate("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                )}
              </div>
              
              {profileUser.bio && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium">About</h3>
                  <p className="mt-2 text-gray-600">{profileUser.bio}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {isOwnProfile && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/list-watch")}
                  >
                    List a New Watch
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate("/dashboard")}
                  >
                    View Your Bookings
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => toast.info("Settings functionality will be implemented soon")}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right Column - Tabs Content */}
        <div className="md:col-span-2">
          <Tabs defaultValue="watches" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="watches">
                Watches ({profileUser.watches.length})
              </TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
              {isOwnProfile && (
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              )}
            </TabsList>
            
            {/* Watches Tab */}
            <TabsContent value="watches" className="space-y-6">
              {profileUser.watches.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-3">
                      <Calendar className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">No watches listed yet</h3>
                    {isOwnProfile ? (
                      <>
                        <p className="mb-4 text-gray-600">
                          Share your collection with other enthusiasts
                        </p>
                        <Button
                          onClick={() => navigate("/list-watch")}
                          className="bg-luxury-navy hover:bg-luxury-navy/90"
                        >
                          List Your First Watch
                        </Button>
                      </>
                    ) : (
                      <p className="text-gray-600">
                        This user has not listed any watches yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {profileUser.watches.map((watch) => (
                    <WatchCard key={watch.id} watch={watch} featured={watch.featured} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Reviews Tab */}
            <TabsContent value="reviews" className="space-y-6">
              {reviews.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-4 rounded-full bg-gray-100 p-3">
                      <Star className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">No reviews yet</h3>
                    <p className="text-gray-600">
                      {isOwnProfile
                        ? "You haven't received any reviews yet"
                        : "This user hasn't received any reviews yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={review.reviewerImage} alt={review.reviewerName} />
                              <AvatarFallback>{review.reviewerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{review.reviewerName}</p>
                              <div className="mt-1 flex items-center space-x-1">
                                <span className="flex items-center">
                                  {Array(5).fill(null).map((_, index) => (
                                    <Star
                                      key={index}
                                      className={`h-4 w-4 ${
                                        index < review.rating
                                          ? "fill-luxury-gold text-luxury-gold"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </span>
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="mt-4 text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Transactions Tab (Only for profile owner) */}
            {isOwnProfile && (
              <TabsContent value="transactions" className="space-y-6">
                {transactions.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                      <div className="mb-4 rounded-full bg-gray-100 p-3">
                        <Calendar className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="mb-2 text-lg font-medium">No transactions yet</h3>
                      <p className="text-gray-600">
                        Your rental and listing transactions will appear here
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <Card key={transaction.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Badge className={transaction.type === "rental" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                                  {transaction.type === "rental" ? "Rental" : "Listing"}
                                </Badge>
                                <span className="font-medium">
                                  {transaction.watchBrand} {transaction.watchModel}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">{transaction.date}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-luxury-navy">${transaction.amount}</p>
                              <Badge className={
                                transaction.status === "completed" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-blue-100 text-blue-800"
                              }>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
