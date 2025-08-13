import HeroSection from "@/components/common/HeroSection";
import { React, useEffect } from "react";
import { Link } from "react-router-dom";
import JobCard from "@/components/jobs/JobCard";
import useFetch from "@/hooks/useFetch";
import { getAllJobs } from "@/services/jobsService";
import useToastNotification from "@/components/common/Toast";
const Home = () => {
  const { showError } = useToastNotification();
  const { data: response, loading, error } = useFetch(getAllJobs);

  const jobs = response?.data.slice(0, 3) || [];

  useEffect(() => {
    if (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch jobs. Please try again.";
      showError("Error Loading Jobs", errorMessage);
    }
  }, [error]);

  const categories = [
    "Engineering",
    "Design",
    "Product",
    "Data",
    "Marketing",
    "Sales",
    "Operations",
    "Finance",
  ];

  const HowItem = ({ number, title, text }) => (
    <div className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm">
      <div className="h-8 w-8 rounded-full bg-green-100 text-green-800 flex items-center justify-center font-semibold mb-3">
        {number}
      </div>
      <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );

  return (
    <>
      <HeroSection />

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Browse by Category
          </h2>
          <Link
            to="/jobs"
            className="text-sm text-green-700 hover:text-green-900 underline"
          >
            View all jobs
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/jobs?q=${encodeURIComponent(c)}`}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:border-green-300 hover:bg-green-50"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Latest Jobs</h2>
          <Link
            to="/jobs"
            className="text-sm text-green-700 hover:text-green-900 underline"
          >
            Browse all
          </Link>
        </div>
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
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              For Students: find & apply fast
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <HowItem
                number={1}
                title="Search"
                text="Use filters or keywords to find roles."
              />
              <HowItem
                number={2}
                title="Save"
                text="Bookmark interesting jobs for later."
              />
              <HowItem
                number={3}
                title="Apply"
                text="Send a cover letter; we use your profile resume."
              />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              For Recruiters: hire better, faster
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <HowItem
                number={1}
                title="Create"
                text="Post detailed jobs in minutes."
              />
              <HowItem
                number={2}
                title="Manage"
                text="Review applicants with resumes & statuses."
              />
              <HowItem
                number={3}
                title="Decide"
                text="Track pipeline and update outcomes."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mt-1">
              Discover opportunities or post your first job today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/jobs"
              className="px-4 py-2 rounded-md bg-green-800 hover:bg-green-700 text-white font-medium"
            >
              Find Jobs
            </Link>
            <Link
              to="/company/create-job"
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
