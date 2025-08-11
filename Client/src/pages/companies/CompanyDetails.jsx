import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlertCircle, Building } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getCompanies, updateCompany } from "@/services/companyService";
import useToastNotification from "@/components/common/Toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // ShadCN Dialog (Modal)
import { Input } from "@/components/ui/input"; // ShadCN Input
import { Textarea } from "@/components/ui/textarea"; // ShadCN Textarea
import { Label } from "@/components/ui/label"; // ShadCN Label

export default function CompanyDetails() {
  const { showSuccess, showError } = useToastNotification();
  const { data: response, loading, error, refetch } = useFetch(getCompanies);

  const companies = response?.data?.companies || [];
  console.log("company data: ", companies);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logoUrl: "",
  });

  const openEditModal = (company) => {
    setSelectedCompany(company);
    setFormData({
      name: company.name,
      description: company.description || "",
      website: company.website || "",
      location: company.location || "",
      logoUrl: company.logo?.url || "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedCompany || !formData.name) return;

    const payload = {
      name: formData.name,
      description: formData.description,
      website: formData.website,
      location: formData.location,
    };

    try {
      const res = await updateCompany(selectedCompany._id, payload);
      showSuccess(
        "Updated",
        res?.data?.message || "Company updated successfully"
      );
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      const description =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to update company";
      showError("Update failed", description);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-lg font-semibold text-red-500">
          {error?.message || "Something went wrong"}
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <Building className="w-16 h-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Companies Found</h2>
        <p className="text-muted-foreground mb-6">
          It looks like you haven't added any companies yet.
        </p>
        <Button variant="default" className="bg-green-800 hover:bg-green-700">
          Create a Company
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
        Your Companies
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Card
            key={company._id}
            className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700"
          >
            <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-green-900 dark:to-green-800 p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={company.logo?.url} alt={company.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-400 text-white">
                    {company.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl font-bold">
                    {company.name}
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {company.location || "Location not specified"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                {company.description || "No description available."}
              </p>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm"
                >
                  Visit Website
                </a>
              )}
            </CardContent>
            <CardFooter className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between text-xs text-muted-foreground">
              <span>
                Created: {new Date(company.createdAt).toLocaleDateString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openEditModal(company)}
              >
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent">
              Edit Company
            </DialogTitle>
            <DialogDescription>
              Update the company details below. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name (Required)</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Company Name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Company Description"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                name="logoUrl"
                value={formData.logoUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg bg-green-800 text-white hover:bg-green-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
