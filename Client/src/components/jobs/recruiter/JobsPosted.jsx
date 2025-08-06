"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import useToastNotification from "@/components/common/Toast";
import { getJobsByCompany } from "@/services/jobsService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, BookText } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { set } from "date-fns";

export default function JobsPosted() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(false);
  const {
    data: response,
    loading,
    error,
  } = useFetch(getJobsByCompany, [refreshKey]);
  const { showSuccess, showError } = useToastNotification();

  const jobs = response?.data || [];
  const handleDelete = async (jobId) => {
    try {
      const response = await axiosInstance.delete(
        `/api/v1/jobs/delete/${jobId}`
      );
      showSuccess("Job Deleted", response.data.message);
      setRefreshKey((prev) => !prev);
    } catch (error) {
      showError("Error", error.response.data.message);
    }
  };

  const formatSalary = (salary) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(salary);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getJobTypeColor = (jobType) => {
    switch (jobType?.toLowerCase()) {
      case "full-time":
        return "bg-green-100 text-green-800";
      case "part-time":
        return "bg-blue-100 text-blue-800";
      case "contract":
        return "bg-purple-100 text-purple-800";
      case "internship":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No jobs posted
        </h3>
        <p className="text-gray-600">
          You haven't posted any job listings yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          My Job Postings
        </h1>
        <p className="text-gray-600">Manage your posted job listings</p>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Job Title</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Positions</TableHead>
              <TableHead className="font-semibold">Location</TableHead>
              <TableHead className="font-semibold">Applications</TableHead>
              <TableHead className="font-semibold">Posted</TableHead>
              <TableHead className="font-semibold w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getJobTypeColor(job.jobType)}
                  >
                    {job.jobType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {job.position && (
                    <Badge variant="outline">{job.position}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-gray-600">{job.location}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/manage-applicants/${job._id}`)}
                    className="text-green-700 hover:text-green-900 hover:bg-green-300"
                  >
                    <BookText className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell className="text-gray-600">
                  {formatDate(job.createdAt)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(job._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
