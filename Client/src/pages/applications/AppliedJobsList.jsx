import AppliedJobCard from "@/components/applications/AppliedJobCard";
import JobsPosted from "@/components/jobs/recruiter/JobsPosted";
import useFetch from "@/hooks/useFetch";
import { useEffect } from "react";
import useToastNotification from "@/components/common/Toast";
import { getUserApplications } from "@/services/applicationService";
const AppliedJobsList = () => {
  const { showError } = useToastNotification();
  const { data: response, loading, error } = useFetch(getUserApplications);

  const applications = response?.data || [];

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
    </div>
  );
};

export default AppliedJobsList;
