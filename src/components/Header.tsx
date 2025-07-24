
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-serif text-2xl font-semibold tracking-tight text-bezel-black">
              CHRONOS
            </Link>
            <nav className="hidden md:ml-12 md:flex md:space-x-8">
              <Link to="/" className="text-sm font-medium text-bezel-gray hover:text-bezel-black transition-colors">
                Explore
              </Link>
              <Link to="/?featured=true" className="text-sm font-medium text-bezel-gray hover:text-bezel-black transition-colors">
                Featured
              </Link>
              <Link to="/list-watch" className="text-sm font-medium text-bezel-gray hover:text-bezel-black transition-colors">
                List Your Watch
              </Link>
              <Link to="/dashboard" className="text-sm font-medium text-bezel-gray hover:text-bezel-black transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-6">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-56 h-9 border-0 bg-bezel-light-gray text-sm placeholder:text-bezel-gray focus:ring-1 focus:ring-bezel-black"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                <Search className="h-4 w-4 text-bezel-gray" />
              </button>
            </form>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-bezel-light-gray">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImage} alt={user?.name} />
                      <AvatarFallback className="bg-bezel-black text-white text-xs">{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-bezel-light-gray">
                  <DropdownMenuLabel className="text-bezel-black">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="text-bezel-dark-gray hover:text-bezel-black">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/profile/${user?.id}`} className="text-bezel-dark-gray hover:text-bezel-black">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/list-watch" className="text-bezel-dark-gray hover:text-bezel-black">List a Watch</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-bezel-dark-gray hover:text-bezel-black">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="outline" size="sm" className="minimal-button">
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>

          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-bezel-gray hover:bg-bezel-light-gray hover:text-bezel-black"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-5 w-5" aria-hidden="true" />
              ) : (
                <MenuIcon className="block h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden border-t",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <div className="space-y-1 px-4 pb-4 pt-4">
          <Link
            to="/"
            className="block rounded-md px-3 py-2 text-sm font-medium text-bezel-dark-gray hover:bg-bezel-light-gray hover:text-bezel-black"
            onClick={closeMobileMenu}
          >
            Explore
          </Link>
          <Link
            to="/?featured=true"
            className="block rounded-md px-3 py-2 text-sm font-medium text-bezel-dark-gray hover:bg-bezel-light-gray hover:text-bezel-black"
            onClick={closeMobileMenu}
          >
            Featured
          </Link>
          <Link
            to="/list-watch"
            className="block rounded-md px-3 py-2 text-sm font-medium text-bezel-dark-gray hover:bg-bezel-light-gray hover:text-bezel-black"
            onClick={closeMobileMenu}
          >
            List Your Watch
          </Link>
          <Link
            to="/dashboard"
            className="block rounded-md px-3 py-2 text-sm font-medium text-bezel-dark-gray hover:bg-bezel-light-gray hover:text-bezel-black"
            onClick={closeMobileMenu}
          >
            Dashboard
          </Link>
          
          <form onSubmit={handleSearch} className="mt-4 px-3">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-bezel-light-gray border-0"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="mt-2 w-full bg-bezel-black hover:bg-bezel-dark-gray">
              Search
            </Button>
          </form>
          
          {!isAuthenticated && (
            <Link
              to="/auth"
              className="mt-4 block w-full rounded-md border border-bezel-light-gray bg-transparent px-3 py-2 text-center text-sm font-medium text-bezel-black hover:bg-bezel-light-gray transition-colors"
              onClick={closeMobileMenu}
            >
              Sign In
            </Link>
          )}
          
          {isAuthenticated && (
            <>
              <div className="mt-4 flex items-center px-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImage} alt={user?.name} />
                  <AvatarFallback className="bg-bezel-black text-white text-xs">{user?.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="text-sm font-medium text-bezel-black">
                    {user?.name}
                  </div>
                  <div className="text-xs text-bezel-gray">
                    {user?.email}
                  </div>
                </div>
              </div>
              <Link
                to={`/profile/${user?.id}`}
                className="block rounded-md px-3 py-2 text-sm font-medium text-bezel-dark-gray hover:bg-bezel-light-gray hover:text-bezel-black"
                onClick={closeMobileMenu}
              >
                Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  closeMobileMenu();
                }}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-bezel-dark-gray hover:bg-bezel-light-gray hover:text-bezel-black"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
