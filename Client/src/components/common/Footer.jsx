import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">JobPortal</h3>
            <p className="text-sm text-muted-foreground">
              Connecting talent with opportunity since 2023.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link
                to="/jobs"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Find Jobs
              </Link>
              <Link
                to="/companies"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Companies
              </Link>
              <Link
                to="/about"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resources</h3>
            <nav className="space-y-2">
              <Link
                to="/blog"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Blog
              </Link>
              <Link
                to="/faq"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                FAQ
              </Link>
              <Link
                to="/privacy"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="block text-sm text-muted-foreground hover:text-primary"
              >
                Terms of Service
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest job opportunities.
            </p>
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                Email
              </Label>
              <div className="flex space-x-2">
                <Input id="email" type="email" placeholder="Your email" />
                <Button variant="default" className="bg-green-900">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-primary">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-primary">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
