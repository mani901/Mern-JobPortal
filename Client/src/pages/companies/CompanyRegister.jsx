import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import usePost from "@/hooks/usePost";
import { RegisterCompany } from "@/services/companyService";
import useToastNotification from "@/components/common/Toast";

const CompanyRegister = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastNotification();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logo: "",
  });

  const {
    execute: registerCompany,
    loading,
    response,
  } = usePost(RegisterCompany);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerCompany(formData);
      showSuccess("Success!", response.message);
      navigate("/"); // Redirect after successful registration
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      showError("Registration Failed", errorMessage);
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader>
          <CardTitle className="text-2xl">Register Your Company</CardTitle>
          <CardDescription>
            Complete your company profile to get started
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your Company Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Brief about your company"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                type="text"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                name="logo"
                type="url"
                placeholder="https://example.com/logo.png"
                value={formData.logo}
                onChange={handleChange}
              />
              {formData.logo && (
                <div className="mt-2 flex flex-col items-start">
                  <span className="text-sm text-muted-foreground mb-1">
                    Preview:
                  </span>
                  <img
                    src={formData.logo}
                    alt="Company logo preview"
                    className="h-16 w-16 object-contain rounded border"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-900 hover:bg-green-800"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Company"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyRegister;
