
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useWatches } from "@/context/WatchContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, X, Upload } from "lucide-react";
import { toast } from "sonner";

const ListingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { addWatch } = useWatches();
  
  // Redirect if not authenticated
  useState(() => {
    if (!isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  });
  
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    price: "",
    rentalPeriod: "day",
    description: "",
    images: [] as string[],
    specifications: {
      diameter: "",
      movement: "",
      caseMaterial: "",
      strapMaterial: "",
      yearOfManufacture: "",
      condition: "Excellent"
    },
    availability: {
      from: new Date(),
      to: new Date(new Date().setMonth(new Date().getMonth() + 6))
    }
  });
  
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSpecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };
  
  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSpecSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };
  
  const handleDateRangeChange = (range: 'from' | 'to', date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        availability: {
          ...prev.availability,
          [range]: date
        }
      }));
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, this would upload to a storage service
    // For now, we'll use placeholder images for the demo
    
    const placeholderImages = [
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1180&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548690312-e3b507d8c110?q=80&w=1740&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612520986361-3980b0f457e9?q=80&w=1170&auto=format&fit=crop"
    ];
    
    // Add the next available placeholder image
    if (selectedImages.length < 4) {
      const newImage = placeholderImages[selectedImages.length];
      setSelectedImages([...selectedImages, newImage]);
    }
  };
  
  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedImages.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    
    if (!formData.brand || !formData.model || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const newWatch = {
        brand: formData.brand,
        model: formData.model,
        price: parseFloat(formData.price),
        rentalPeriod: formData.rentalPeriod as 'day' | 'week' | 'month',
        images: selectedImages,
        description: formData.description,
        specifications: formData.specifications,
        ownerId: user?.id || "123",
        ownerName: user?.name || "John Smith",
        ownerProfileImage: user?.profileImage,
        availability: {
          from: formData.availability.from.toISOString(),
          to: formData.availability.to.toISOString(),
        },
        reviews: [],
      };
      
      addWatch(newWatch);
      toast.success("Watch listed successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to list watch. Please try again.");
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">List Your Watch</h1>
        <p className="mt-2 text-gray-600">
          Share your luxury timepiece with other enthusiasts
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Watch Details</CardTitle>
                <CardDescription>
                  Provide details about your watch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Rolex, Omega, Patek Philippe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., Submariner, Speedmaster, Nautilus"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        $
                      </span>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        min="1"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="pl-6"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rentalPeriod">Per</Label>
                    <Select
                      value={formData.rentalPeriod}
                      onValueChange={(value) => handleSelectChange("rentalPeriod", value)}
                    >
                      <SelectTrigger id="rentalPeriod">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your watch, its history, and any special features"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>
                  Add detailed specifications for your watch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diameter">Diameter</Label>
                    <Input
                      id="diameter"
                      name="diameter"
                      value={formData.specifications.diameter}
                      onChange={handleSpecChange}
                      placeholder="e.g., 40mm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="movement">Movement</Label>
                    <Select
                      value={formData.specifications.movement}
                      onValueChange={(value) => handleSpecSelectChange("movement", value)}
                    >
                      <SelectTrigger id="movement">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Automatic">Automatic</SelectItem>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="Quartz">Quartz</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="caseMaterial">Case Material</Label>
                    <Select
                      value={formData.specifications.caseMaterial}
                      onValueChange={(value) => handleSpecSelectChange("caseMaterial", value)}
                    >
                      <SelectTrigger id="caseMaterial">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                        <SelectItem value="Gold">Gold</SelectItem>
                        <SelectItem value="Titanium">Titanium</SelectItem>
                        <SelectItem value="Platinum">Platinum</SelectItem>
                        <SelectItem value="Ceramic">Ceramic</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="strapMaterial">Strap Material</Label>
                    <Select
                      value={formData.specifications.strapMaterial}
                      onValueChange={(value) => handleSpecSelectChange("strapMaterial", value)}
                    >
                      <SelectTrigger id="strapMaterial">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                        <SelectItem value="Leather">Leather</SelectItem>
                        <SelectItem value="Rubber">Rubber</SelectItem>
                        <SelectItem value="NATO">NATO</SelectItem>
                        <SelectItem value="Fabric">Fabric</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearOfManufacture">Year of Manufacture</Label>
                    <Input
                      id="yearOfManufacture"
                      name="yearOfManufacture"
                      value={formData.specifications.yearOfManufacture}
                      onChange={handleSpecChange}
                      placeholder="e.g., 2019"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={formData.specifications.condition}
                      onValueChange={(value) => handleSpecSelectChange("condition", value)}
                    >
                      <SelectTrigger id="condition">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mint">Mint</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Very Good">Very Good</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Watch Images</CardTitle>
                <CardDescription>
                  Upload high-quality images of your watch (up to 4)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative">
                        <div className="relative aspect-square overflow-hidden rounded-md border">
                          <img
                            src={image}
                            alt={`Watch image ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white hover:bg-black/90"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {selectedImages.length < 4 && (
                      <div className="flex aspect-square items-center justify-center rounded-md border border-dashed border-gray-300 p-4 hover:bg-gray-50">
                        <label htmlFor="image-upload" className="flex cursor-pointer flex-col items-center justify-center">
                          <div className="mb-2 rounded-full bg-gray-100 p-2">
                            <Upload className="h-5 w-5 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-600">Upload Image</span>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    <p>Tips for great watch photos:</p>
                    <ul className="ml-4 list-disc">
                      <li>Use natural lighting</li>
                      <li>Include photos from different angles</li>
                      <li>Show any box or papers if available</li>
                      <li>Capture any unique features or imperfections</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>
                  Set the period when your watch is available for rent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Available From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.availability.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.availability.from ? (
                            format(formData.availability.from, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={formData.availability.from}
                          onSelect={(date) => handleDateRangeChange('from', date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label>Available To</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.availability.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.availability.to ? (
                            format(formData.availability.to, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={formData.availability.to}
                          onSelect={(date) => handleDateRangeChange('to', date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Rental Terms</CardTitle>
                <CardDescription>
                  Review our rental terms and conditions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
                    <p className="font-medium">By listing your watch, you agree to:</p>
                    <ul className="ml-4 mt-2 list-disc">
                      <li>Provide accurate information about your watch</li>
                      <li>Maintain your watch in the condition described</li>
                      <li>Ship or deliver the watch as agreed upon with renters</li>
                      <li>Our platform's 5% listing fee on successful rentals</li>
                      <li>Our insurance and damage protection policies</li>
                    </ul>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 rounded border-gray-300 text-luxury-navy focus:ring-luxury-navy"
                      required
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the rental terms and conditions
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-luxury-navy hover:bg-luxury-navy/90"
                >
                  List My Watch
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListingPage;
