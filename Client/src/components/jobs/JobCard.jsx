// JobCard.jsx
import React from "react";
import { Briefcase, Clock, DollarSign, MapPin } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import ApplyJobPage from "@/components/applications/Application";

const JobCard = ({
  jobId,
  title,
  company,
  category,
  type,
  salary,
  location,
  timeAgo,
  job,
}) => {
  const navigate = useNavigate();

  const jobData = job || {
    title,
    company: { name: company },
    category,
    type,
    salary,
    location,
    timeAgo,
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:border-green-100 mb-2">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
          <div className="bg-gradient-to-r from-green-600 to-teal-500 w-8 h-8 rounded flex items-center justify-center">
            <Briefcase className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                {title}
              </h3>
              <p className="text-sm font-medium text-gray-700">{company}</p>
            </div>
            <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded-full">
              {formatDate(timeAgo)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span>{category}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{type}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>{salary}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{location}</span>
            </div>
          </div>

          <div className="mt-5 flex justify-between items-center">
            <button
              className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors flex items-center gap-1 group-hover:underline"
              onClick={() => navigate(`/jobs/${jobId}`)}
            >
              View Details
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="flex gap-2">
              <ApplyJobPage job={jobData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
