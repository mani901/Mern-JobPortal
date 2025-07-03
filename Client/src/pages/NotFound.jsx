import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Home,
  Search,
  ArrowLeft,
  Briefcase,
  Building2,
  Users,
  AlertCircle,
  RefreshCw
} from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  // Navigation handlers
  const goHome = useCallback(() => navigate("/"), [navigate]);
  const goBack = useCallback(() => navigate(-1), [navigate]);
  const goToJobs = useCallback(() => navigate("/jobs"), [navigate]);
  const goToCompanies = useCallback(() => navigate("/companies"), [navigate]);

  // Handle search functionality
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get("search");
    if (searchQuery?.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [navigate]);

  // Refresh page
  const refreshPage = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Error Display */}
        <div className="relative mb-8">
          {/* 404 Number with Gradient */}
          <div className="relative">
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800 leading-none">
              404
            </h1>
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="absolute -bottom-2 -left-4 w-8 h-8 bg-green-200 rounded-full opacity-60"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">
            The page you're looking for seems to have wandered off. Don't worry, even the best job seekers sometimes take a wrong turn!
          </p>
          <p className="text-gray-500 max-w-xl mx-auto">
            Let's get you back on track to finding your dream job.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button
            onClick={goHome}
            variant="default"
            className="h-14 bg-green-900 hover:bg-green-800 text-white"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>

          <Button
            onClick={goBack}
            variant="outline"
            className="h-14 border-gray-300 hover:border-green-300 hover:bg-green-50"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </Button>

          <Button
            onClick={goToJobs}
            variant="outline"
            className="h-14 border-gray-300 hover:border-green-300 hover:bg-green-50"
          >
            <Briefcase className="w-5 h-5 mr-2" />
            Browse Jobs
          </Button>

          <Button
            onClick={refreshPage}
            variant="outline"
            className="h-14 border-gray-300 hover:border-green-300 hover:bg-green-50"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Looking for something specific?
            </h3>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  name="search"
                  placeholder="Search for jobs, companies, or roles..."
                  className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-12 px-6 bg-green-900 hover:bg-green-800 text-white"
              >
                Search Jobs
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Destinations */}
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Popular Destinations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Job Categories */}
              <div
                onClick={goToJobs}
                className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Briefcase className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 group-hover:text-green-800">Find Jobs</p>
                    <p className="text-sm text-gray-500">Browse available positions</p>
                  </div>
                </div>
              </div>

              {/* Companies */}
              <div
                onClick={goToCompanies}
                className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Building2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 group-hover:text-green-800">Companies</p>
                    <p className="text-sm text-gray-500">Explore top employers</p>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div
                onClick={() => navigate("/profile")}
                className="group p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900 group-hover:text-green-800">Your Profile</p>
                    <p className="text-sm text-gray-500">Manage your account</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Still having trouble? Try checking the URL for typos or{" "}
            <button
              onClick={() => window.location.href = "mailto:support@jobportal.com"}
              className="text-green-600 hover:text-green-800 underline font-medium"
            >
              contact our support team
            </button>
            .
          </p>
        </div>

        {/* Decorative Background Elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-32 w-80 h-80 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-32 -left-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full opacity-10 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
