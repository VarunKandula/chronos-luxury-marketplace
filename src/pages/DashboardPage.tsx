
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWatches, Watch } from "@/context/WatchContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, MessageSquare, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { watches } = useWatches();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [isAuthenticated, navigate]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Filter watches owned by the current user
  const userWatches = watches.filter((watch) => watch.ownerId === user.id);
  
  // Mock bookings data (in a real app, this would come from a backend)
  const myBookings = [
    {
      id: "booking1",
      watchId: "2", // ID of the Omega Speedmaster
      status: "active",
      startDate: "2023-06-15",
      endDate: "2023-06-20",
      totalPrice: 625,
    },
    {
      id: "booking2",
      watchId: "4", // ID of the Patek Philippe
      status: "upcoming",
      startDate: "2023-07-01",
      endDate: "2023-07-05",
      totalPrice: 2500,
    },
  ];
  
  // Mock bookings for watches the user owns
  const receivedBookings = [
    {
      id: "received1",
      watchId: "3", // ID of the Audemars Piguet
      renterName: "Emma Thompson",
      renterProfileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      status: "pending",
      startDate: "2023-06-20",
      endDate: "2023-06-25",
      totalPrice: 1500,
    },
    {
      id: "received2",
      watchId: "6", // ID of the TAG Heuer
      renterName: "James Wilson",
      renterProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      status: "confirmed",
      startDate: "2023-06-10",
      endDate: "2023-06-13",
      totalPrice: 300,
    },
  ];
  
  // Mock messages
  const messages = [
    {
      id: "msg1",
      sender: "Emma Thompson",
      senderProfileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      preview: "I'm interested in renting your Audemars Piguet...",
      timestamp: "2023-06-08T14:30:00",
      unread: true,
    },
    {
      id: "msg2",
      sender: "James Wilson",
      senderProfileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      preview: "Thanks for renting the TAG Heuer. I'll take good...",
      timestamp: "2023-06-05T09:15:00",
      unread: false,
    },
  ];
  
  const getWatchById = (id: string): Watch | undefined => {
    return watches.find((watch) => watch.id === id);
  };
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };
  
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "pending":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100";
      case "confirmed":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "completed":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
  
  const handleApproveBooking = (bookingId: string) => {
    toast.success("Booking approved successfully");
  };
  
  const handleDeclineBooking = (bookingId: string) => {
    toast.success("Booking declined");
  };
  
  const handleCancelBooking = (bookingId: string) => {
    toast.success("Booking cancelled");
  };
  
  const handleViewMessage = (messageId: string) => {
    toast.info("Message functionality will be implemented soon");
  };
  
  const handleDeleteWatch = (watchId: string) => {
    toast.success("Watch deleted successfully");
  };
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">
          Manage your watches, bookings, and messages
        </p>
      </div>
      
      {/* Main Dashboard Content */}
      <Tabs defaultValue="watches">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="watches">My Watches</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="requests">Booking Requests</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        {/* My Watches Tab */}
        <TabsContent value="watches" className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-xl font-medium">Your Listed Watches</h2>
            <Button 
              onClick={() => navigate("/list-watch")}
              className="bg-luxury-navy hover:bg-luxury-navy/90"
            >
              Add New Watch
            </Button>
          </div>
          
          {userWatches.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-3">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No watches listed yet</h3>
                <p className="mb-4 text-gray-600">
                  Start sharing your collection with other enthusiasts
                </p>
                <Button 
                  onClick={() => navigate("/list-watch")}
                  className="bg-luxury-navy hover:bg-luxury-navy/90"
                >
                  List Your First Watch
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userWatches.map((watch) => (
                <Card key={watch.id}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={watch.images[0]}
                      alt={`${watch.brand} ${watch.model}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{watch.brand} {watch.model}</CardTitle>
                    <CardDescription className="font-medium text-luxury-navy">
                      ${watch.price}/{watch.rentalPeriod.charAt(0)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{watch.specifications.condition}</Badge>
                      {watch.featured && <Badge className="bg-luxury-gold hover:bg-luxury-gold/90">Featured</Badge>}
                    </div>
                  </CardContent>
                  <CardFooter className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/watch/${watch.id}`)}
                    >
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleDeleteWatch(watch.id)}
                    >
                      <Trash2 className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* My Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <h2 className="text-xl font-medium">Your Bookings</h2>
          
          {myBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-3">
                  <CalendarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No bookings yet</h3>
                <p className="mb-4 text-gray-600">
                  Browse watches and make your first booking
                </p>
                <Button 
                  onClick={() => navigate("/")}
                  className="bg-luxury-navy hover:bg-luxury-navy/90"
                >
                  Browse Watches
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myBookings.map((booking) => {
                const watch = getWatchById(booking.watchId);
                if (!watch) return null;
                
                return (
                  <Card key={booking.id}>
                    <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                      <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                        <div className="h-24 w-24 overflow-hidden rounded-md">
                          <img
                            src={watch.images[0]}
                            alt={`${watch.brand} ${watch.model}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              {watch.brand} {watch.model}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                              Owner: {watch.ownerName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-luxury-navy">
                              ${booking.totalPrice}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/watch/${watch.id}`)}
                          >
                            Watch Details
                          </Button>
                          {booking.status === "upcoming" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => handleCancelBooking(booking.id)}
                            >
                              Cancel Booking
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        {/* Booking Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <h2 className="text-xl font-medium">Booking Requests for Your Watches</h2>
          
          {receivedBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-3">
                  <CalendarIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No booking requests</h3>
                <p className="mb-4 text-gray-600">
                  When someone requests to rent your watch, it will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {receivedBookings.map((booking) => {
                const watch = getWatchById(booking.watchId);
                if (!watch) return null;
                
                return (
                  <Card key={booking.id}>
                    <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                      <div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
                        <div className="h-24 w-24 overflow-hidden rounded-md">
                          <img
                            src={watch.images[0]}
                            alt={`${watch.brand} ${watch.model}`}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="flex flex-wrap items-start justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              {watch.brand} {watch.model}
                            </h3>
                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                              <span className="text-sm text-gray-600">
                                {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center">
                              <Avatar className="mr-2 h-6 w-6">
                                <AvatarImage src={booking.renterProfileImage} alt={booking.renterName} />
                                <AvatarFallback>{booking.renterName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">
                                Renter: {booking.renterName}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-luxury-navy">
                              ${booking.totalPrice}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveBooking(booking.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeclineBooking(booking.id)}
                              >
                                Decline
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/watch/${watch.id}`)}
                          >
                            Watch Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <h2 className="text-xl font-medium">Messages</h2>
          
          {messages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                <div className="mb-4 rounded-full bg-gray-100 p-3">
                  <MessageSquare className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No messages</h3>
                <p className="mb-4 text-gray-600">
                  When you receive messages from other users, they will appear here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {messages.map((message) => (
                <Card 
                  key={message.id}
                  className={`${message.unread ? 'border-l-4 border-l-luxury-navy' : ''}`}
                >
                  <div 
                    className="flex cursor-pointer items-start p-4 hover:bg-gray-50"
                    onClick={() => handleViewMessage(message.id)}
                  >
                    <Avatar className="mr-4 h-10 w-10">
                      <AvatarImage src={message.senderProfileImage} alt={message.sender} />
                      <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${message.unread ? 'text-luxury-navy' : ''}`}>
                          {message.sender}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className={`mt-1 text-sm ${message.unread ? 'font-medium' : 'text-gray-600'}`}>
                        {message.preview}
                      </p>
                    </div>
                    {message.unread && (
                      <div className="ml-2 h-2 w-2 rounded-full bg-luxury-navy"></div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
