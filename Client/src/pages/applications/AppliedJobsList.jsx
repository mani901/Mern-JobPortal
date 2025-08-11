import AppliedJobCard from "@/components/applications/AppliedJobCard";
import JobsPosted from "@/components/jobs/recruiter/JobsPosted";
import { getSavedJobs } from "@/services/userService";
import JobCard from "@/components/jobs/JobCard";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import useToastNotification from "@/components/common/Toast";
import { getUserApplications } from "@/services/applicationService";
const AppliedJobsList = () => {
  const { showError } = useToastNotification();
  const { data: response, loading, error } = useFetch(getUserApplications);
  const { data: savedResponse } = useFetch(getSavedJobs);

  const applications = response?.data || [];
  const savedJobs = savedResponse?.data || [];

  useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch jobs. Please try again.";
      showError("Error Loading Jobs", errorMessage);
    }
  }, [error]);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Your Job Applications</h1>
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading your applications...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500">Failed to load applications</p>
          </div>
        ) : applications && applications.length > 0 ? (
          applications.map((application) => (
            <AppliedJobCard key={application._id} application={application} />
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-600">
              You haven't applied for any jobs yet.
            </p>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Saved Jobs</h2>
        {savedJobs && savedJobs.length > 0 ? (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <JobCard
                key={job._id}
                jobId={job._id}
                title={job.title}
                company={job.companyId?.name}
                category={job.category || "Technology"}
                type={job.jobType}
                salary={job.salary ? `$${job.salary}` : "Competitive"}
                location={job.location}
                timeAgo={job.createdAt}
                job={{ ...job, isSaved: true }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no saved jobs.</p>
        )}
      </div>
    </div>
  );
};

export default AppliedJobsList;
