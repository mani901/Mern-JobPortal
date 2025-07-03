import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Static data moved outside component to prevent recreation on each render
const NAVIGATION_ITEMS = [
  { path: "/jobs", label: "Find Jobs" },
  { path: "/companies", label: "Companies" },
  { path: "/about", label: "About" },
];

const USER_MENU_ITEMS = [
  { path: "/profile", label: "Profile" },
  { path: "/my-applications", label: "My Applications" },
  { path: "/settings", label: "Settings" },
];

// Style constants to prevent recreation
const STYLES = {
  link: "text-gray-600 hover:text-green-800 transition-colors duration-200",
  container: "container mx-auto px-4 py-4 flex items-center justify-between",
  mobileMenu: "md:hidden bg-white border-t border-gray-200",
  loadingSkeleton: "h-8 w-16 animate-pulse bg-gray-200 rounded",
};

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoized callbacks to prevent recreation on each render
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Unified navigation handler with error handling
  const handleNavigation = useCallback(
    (path) => {
      try {
        navigate(path);
        closeMobileMenu();
      } catch (error) {
        console.error("Navigation error:", error);
      }
    },
    [navigate, closeMobileMenu]
  );

  // Handle logout with proper error handling
  const handleLogout = useCallback(async () => {
    try {
      await logout();
      closeMobileMenu();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still navigate to home even if logout API fails
      navigate("/");
    }
  }, [logout, navigate, closeMobileMenu]);

  // Memoized navigation links component
  const NavigationLinks = useMemo(
    () =>
      NAVIGATION_ITEMS.map((item) => (
        <button
          key={item.path}
          onClick={() => handleNavigation(item.path)}
          className={STYLES.link}
          type="button"
          aria-label={`Navigate to ${item.label}`}
        >
          {item.label}
        </button>
      )),
    [handleNavigation]
  );

  // Memoized mobile navigation links
  const MobileNavigationLinks = useMemo(
    () =>
      NAVIGATION_ITEMS.map((item) => (
        <button
          key={`mobile-${item.path}`}
          onClick={() => handleNavigation(item.path)}
          className={`${STYLES.link} w-full text-left py-2`}
          type="button"
          aria-label={`Navigate to ${item.label}`}
        >
          {item.label}
        </button>
      )),
    [handleNavigation]
  );

  // Memoized user initials for avatar fallback
  const userInitials = useMemo(() => {
    if (!user?.fullname) return "U";
    return user.fullname
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.fullname]);

  // Memoized authentication section
  const AuthenticationSection = useMemo(() => {
    // Show loading skeleton while checking authentication
    if (loading) {
      return (
        <div className="flex items-center justify-center">
          <div className={STYLES.loadingSkeleton} aria-label="Loading authentication status" />
        </div>
      );
    }

    // Authenticated user - show user menu
    if (isAuthenticated && user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.profile?.profilePhoto || ""} alt={user.fullname} />
                <AvatarFallback className="bg-green-100 text-green-700">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.fullname}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {USER_MENU_ITEMS.map((item) => (
              <DropdownMenuItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="cursor-pointer"
              >
                {item.label}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    // Not authenticated - show login/signup buttons
    return (
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          onClick={() => handleNavigation("/login")}
          className={STYLES.link}
        >
          Log In
        </Button>
        <Button
          onClick={() => handleNavigation("/register")}
          className="bg-green-900 hover:bg-green-800 text-white"
        >
          Sign Up
        </Button>
      </div>
    );
  }, [loading, isAuthenticated, user, userInitials, handleNavigation, handleLogout]);

  // Memoized mobile authentication section
  const MobileAuthenticationSection = useMemo(() => {
    if (loading) {
      return (
        <div className="flex justify-center py-2">
          <div className={STYLES.loadingSkeleton} />
        </div>
      );
    }

    if (isAuthenticated && user) {
      return (
        <div className="flex flex-col space-y-2 pt-4 border-t">
          <div className="flex items-center space-x-3 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.profile?.profilePhoto || ""} alt={user.fullname} />
              <AvatarFallback className="bg-green-100 text-green-700">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user.fullname}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          {USER_MENU_ITEMS.map((item) => (
            <button
              key={`mobile-user-${item.path}`}
              onClick={() => handleNavigation(item.path)}
              className={`${STYLES.link} w-full text-left py-2`}
              type="button"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 text-red-600 hover:text-red-800 transition-colors"
            type="button"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-2 pt-4 border-t">
        <Button
          variant="ghost"
          onClick={() => handleNavigation("/login")}
          className="w-full justify-start"
        >
          Log In
        </Button>
        <Button
          onClick={() => handleNavigation("/register")}
          className="w-full bg-green-900 hover:bg-green-800 text-white"
        >
          Sign Up
        </Button>
      </div>
    );
  }, [loading, isAuthenticated, user, userInitials, handleNavigation, handleLogout]);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className={STYLES.container}>
        {/* Logo */}
        <button
          onClick={() => handleNavigation("/")}
          className="text-xl font-bold text-gray-900 hover:text-green-800 transition-colors"
          type="button"
          aria-label="Go to homepage"
        >
          JobPortal
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {NavigationLinks}
          {AuthenticationSection}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-md"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          type="button"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className={STYLES.mobileMenu} role="menu">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            {MobileNavigationLinks}
            {MobileAuthenticationSection}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
