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
  }, [error, showError]);

  return (
    <div>
      <div className="grid grid-cols-5 grid-rows-5 gap-4 mt-10 mb-8">
        <div className="row-span-5">
          <JobFilterSidebar />
        </div>

        <div className="col-span-4 row-span-5">
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
