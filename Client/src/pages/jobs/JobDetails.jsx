import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { getJobById } from "@/services/jobsService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApplyJobPage from "@/components/applications/Application";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Calendar, MapPin, Briefcase, DollarSign, Users } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import useToastNotification from "@/components/common/Toast";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const { showError } = useToastNotification();

  const fetchJobById = () => getJobById(jobId);

  const { data: response, loading, error } = useFetch(fetchJobById, [jobId]);

  const job = response?.data;

  // Show error toast when there's an error
  useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch job details. Please try again.";
      showError("Error Loading Job", errorMessage);
    }
  }, [error]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-4">
              Failed to load job details
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-green-600 hover:text-green-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Job not found state
  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">Job not found</p>
            <p className="text-gray-400 text-sm">
              The job you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/jobs">Jobs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Job Details</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Job Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.companyId?.name || "Unknown Company"}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "Recently"}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-sm">
                  {job.jobType}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Job Meta */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-medium">
                        $
                        {job.salary
                          ? job.salary.toLocaleString()
                          : "Competitive"}
                        /year
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">
                        {job.location || "Not specified"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Positions</p>
                      <p className="font-medium">{job.position || 1}</p>
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Job Description</h3>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {job.description || "No description available."}
                  </p>
                </div>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Requirements</h3>
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Application Button */}
                <div className="flex gap-2 justify-end">
                  <ApplyJobPage job={job} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Company Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  {job.companyId?.logo?.url ? (
                    <img
                      src={job.companyId?.logo?.url}
                      alt={`${job.companyId?.name} logo`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-medium">
                      {(job.companyId?.name || "C").charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium">
                    {job.companyId?.name || "Unknown Company"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {job.companyId?.description ||
                      "No company description available."}
                  </p>
                </div>
              </div>
              {(job.companyId?.website || job.company?.website) && (
                <div>
                  <Button variant="outline" className="w-full">
                    <a
                      href={job.companyId?.website || job.company?.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      Visit Company Website
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Applications
                </span>
                <span className="text-sm font-medium">
                  {job.applications?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posted</span>
                <span className="text-sm font-medium">
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "Recently"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm font-medium">
                  {job.jobType || "Not specified"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
