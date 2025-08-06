import HeroSection from "@/components/common/HeroSection";
import { React, useEffect } from "react";
import JobCard from "@/components/jobs/JobCard";
import useFetch from "@/hooks/useFetch";
import { getAllJobs } from "@/services/jobsService";
import useToastNotification from "@/components/common/Toast";
const Home = () => {
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
    <>
      <HeroSection />

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Latest Jobs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      </div>
    </>
  );
};

export default Home;
