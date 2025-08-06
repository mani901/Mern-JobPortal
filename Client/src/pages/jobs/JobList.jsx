import React, { useEffect } from "react";
import JobCard from "@/components/jobs/JobCard";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import JobFilterSidebar from "@/components/jobs/JobFilter";
import LoadingSpinner from "@/components/LoadingSpinner";
import useFetch from "@/hooks/useFetch";
import { getAllJobs } from "@/services/jobsService";
import useToastNotification from "@/components/common/Toast";

const JobList = () => {
  const { showError } = useToastNotification();
  const { data: response, loading, error } = useFetch(getAllJobs);

  const jobs = response?.data || [];

  useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch jobs. Please try again.";
      showError("Error Loading Jobs", errorMessage);
    }
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - appears first on mobile, then on the left on desktop */}
        <div className="w-full lg:w-1/4 xl:w-1/5">
          <JobFilterSidebar />
        </div>

        {/* Main content area */}
        <div className="w-full lg:w-3/4 xl:w-4/5">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Failed to load jobs</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-green-600 hover:text-green-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : jobs && jobs.length > 0 ? (
            <>
              <h1>Jobs Found: {jobs.length}</h1>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job._id || job.id}
                    jobId={job._id || job.id}
                    title={job.title}
                    company={
                      job.companyId?.name ||
                      job.company?.name ||
                      job.companyName ||
                      "Unknown Company"
                    }
                    category={job.category || "Technology"}
                    type={job.jobType || job.type}
                    salary={job.salary ? `$${job.salary}` : "Competitive"}
                    location={job.location}
                    timeAgo={
                      job.createdAt
                        ? new Date(job.createdAt).toLocaleDateString()
                        : "Recently"
                    }
                    job={job}
                  />
                ))}
              </div>
              {jobs.length > 3 && (
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-2">No jobs found</p>
                <p className="text-gray-400 text-sm">
                  Check back later for new opportunities
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
