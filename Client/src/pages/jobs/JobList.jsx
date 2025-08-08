import React, { useState, useEffect } from "react";
import JobCard from "@/components/jobs/JobCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import JobFilterSidebar from "@/components/jobs/JobFilter";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getAllJobs, searchJobs } from "@/services/jobsService";
import useToastNotification from "@/components/common/Toast";

const JobList = () => {
  const { showError } = useToastNotification();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Check if we have active filters
  const hasActiveFilters = () => {
    return (
      Object.keys(filters).length > 0 &&
      Object.values(filters).some(
        (value) =>
          value !== undefined &&
          value !== null &&
          value !== "" &&
          (Array.isArray(value) ? value.length > 0 : true)
      )
    );
  };

  // Fetch jobs based on current state
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (hasActiveFilters()) {
        setIsSearching(true);
        response = await searchJobs(filters, currentPage, itemsPerPage);
      } else {
        setIsSearching(false);
        response = await getAllJobs(currentPage, itemsPerPage);
      }

      setJobs(response.data.data || []);
      setPagination(response.data.pagination || { total: 0, pages: 1 });
    } catch (err) {
      setError(err);
      const errorMessage =
        err.response?.data?.message ||
        "Failed to fetch jobs. Please try again.";
      showError("Error Loading Jobs", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when dependencies change
  useEffect(() => {
    fetchJobs();
  }, [currentPage, itemsPerPage, JSON.stringify(filters)]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setCurrentPage(newPage);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleRetry = () => {
    fetchJobs();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 xl:w-1/5 lg:sticky top-0 self-start max-h-[calc(100vh-2.5rem)] overflow-y-auto">
          <JobFilterSidebar
            onFilterChange={handleFilterChange}
            filters={filters}
          />
        </div>

        <div className="w-full lg:w-3/4 xl:w-4/5">
          {/* Header with results info and clear filters */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold">
                {isSearching ? "Search Results" : "All Jobs"}
              </h1>
              {pagination.total !== undefined && (
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.total} job{pagination.total !== 1 ? "s" : ""}{" "}
                  found
                </p>
              )}
            </div>
            {isSearching && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-500 mb-4">Failed to load jobs</p>
                <button
                  onClick={handleRetry}
                  className="text-green-600 hover:text-green-800 underline"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <>
              {jobs.length > 0 ? (
                <>
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

                  {pagination.pages > 1 && (
                    <div className="mt-8">
                      <Pagination>
                        <PaginationContent>
                          {currentPage > 1 && (
                            <PaginationItem>
                              <PaginationPrevious
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
                              />
                            </PaginationItem>
                          )}

                          {Array.from(
                            { length: pagination.pages },
                            (_, i) => i + 1
                          )
                            .filter(
                              (page) =>
                                page === 1 ||
                                page === pagination.pages ||
                                (page >= currentPage - 2 &&
                                  page <= currentPage + 2)
                            )
                            .map((page) => (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            ))}

                          {currentPage < pagination.pages && (
                            <PaginationItem>
                              <PaginationNext
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                              />
                            </PaginationItem>
                          )}
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <p className="text-gray-500 text-lg mb-2">
                      {isSearching
                        ? "No jobs match your filters"
                        : "No jobs found"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {isSearching
                        ? "Try adjusting your search criteria"
                        : "Check back later for new opportunities"}
                    </p>
                    {isSearching && (
                      <button
                        onClick={handleClearFilters}
                        className="mt-4 text-blue-600 hover:text-blue-800 underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;
