"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChevronDown, Menu, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAVIGATION_ITEMS = [
  { path: "/jobs", label: "Find Jobs" },
  { path: "/companies", label: "Companies" },
  { path: "/company/create-company", label: "Create Company" },
  { path: "/company/manage-jobs", label: "Manage Jobs" },
  { path: "/company/create-job", label: "Create Job" },
  { path: "/about", label: "About" },
];

const USER_MENU_ITEMS = [
  { path: "/profile", label: "Profile" },
  { path: "/my-applications", label: "My Applications" },
  { path: "/settings", label: "Settings" },
];

// Hover Dropdown
const NavDropdown = ({ trigger, children, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  useEffect(() => {
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-gray-900 cursor-pointer transition-colors",
          isOpen && "text-gray-900",
          className
        )}
      >
        {trigger}
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
          {children}
        </div>
      )}
    </div>
  );
};

export default function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSection, setExpandedMobileSection] = useState(null);

  const userInitials = useMemo(() => {
    if (!user?.fullname) return "U";
    return user.fullname
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user?.fullname]);

  const handleNavigation = (path) => {
    try {
      navigate(path);
      setIsMobileMenuOpen(false);
    } catch (err) {
      console.error("Navigation error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      navigate("/");
    }
  };

  const jobsItems = NAVIGATION_ITEMS.filter(
    (item) => item.path.includes("/jobs") || item.label.includes("Jobs")
  );
  const companyItems = NAVIGATION_ITEMS.filter(
    (item) => item.path.includes("/company") || item.label.includes("Company")
  );
  const otherItems = NAVIGATION_ITEMS.filter(
    (item) => !item.path.includes("/jobs") && !item.path.includes("/company")
  );

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavigation("/")}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white">
              <User className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-gray-900">JobPortal</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavDropdown
              trigger={<span className="font-medium">Find Jobs</span>}
            >
              <div className="py-2">
                {jobsItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </NavDropdown>

            <NavDropdown
              trigger={<span className="font-medium">Companies</span>}
            >
              <div className="py-2">
                {companyItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </NavDropdown>

            {otherItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden lg:flex items-center space-x-3">
            {loading ? (
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded" />
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.profile?.profilePhoto || ""}
                        alt={user.fullname}
                      />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.fullname}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
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
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleNavigation("/login")}
                  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-medium px-6 bg-transparent"
                >
                  <User className="w-4 h-4 mr-2" />
                  Log In
                </Button>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-6"
                  onClick={() => handleNavigation("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <div className="flex flex-col h-full">
                {/* Mobile User Info */}
                {!loading && isAuthenticated && user && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user.profile?.profilePhoto || ""}
                          alt={user.fullname}
                        />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user.fullname}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile Links */}
                <div className="flex-1 py-6 px-6 space-y-1">
                  {[
                    ["jobs", jobsItems],
                    ["companies", companyItems],
                  ].map(([label, items]) => (
                    <div key={label} className="py-3 border-b border-gray-100">
                      <button
                        onClick={() =>
                          setExpandedMobileSection((s) =>
                            s === label ? null : label
                          )
                        }
                        className="flex items-center justify-between w-full text-left text-gray-700 hover:text-gray-900 font-medium"
                      >
                        <span>
                          {label === "jobs" ? "Find Jobs" : "Companies"}
                        </span>
                        <ChevronDown
                          className={cn(
                            "w-4 h-4 transition-transform",
                            expandedMobileSection === label && "rotate-180"
                          )}
                        />
                      </button>
                      {expandedMobileSection === label && (
                        <div className="mt-2 ml-4 space-y-2">
                          {items.map((item) => (
                            <button
                              key={item.path}
                              onClick={() => handleNavigation(item.path)}
                              className="block w-full text-left py-1 text-sm text-gray-600 hover:text-gray-900"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {otherItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => handleNavigation(item.path)}
                      className="block w-full text-left py-3 text-gray-700 hover:text-gray-900 font-medium border-b border-gray-100"
                    >
                      {item.label}
                    </button>
                  ))}
                  {!loading && isAuthenticated && user && (
                    <div className="pt-4 border-t border-gray-100 space-y-1">
                      {USER_MENU_ITEMS.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => handleNavigation(item.path)}
                          className="block w-full text-left py-3 text-gray-700 hover:text-gray-900 font-medium border-b border-gray-100"
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left py-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                  {!loading && !isAuthenticated && (
                    <div className="pt-4 border-t space-y-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleNavigation("/login")}
                        className="w-full justify-start"
                      >
                        Log In
                      </Button>
                      <Button
                        onClick={() => handleNavigation("/register")}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
