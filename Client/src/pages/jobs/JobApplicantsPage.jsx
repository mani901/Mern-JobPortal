"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import axiosInstance from "@/services/axiosInstance";
import useToastNotification from "@/components/common/Toast";
import { Separator } from "@/components/ui/separator";
import { Mail, Calendar, FileText, ChevronDown, ChevronUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getApplicationsByJobId } from "@/services/applicationService";

export default function JobApplicantsPage() {
  const { jobId } = useParams();
  const { showSuccess, showError } = useToastNotification();
  const [refreshKey, setRefreshKey] = useState(false);

  const fetchApplicationsByJobId = () =>
    getApplicationsByJobId(jobId, [refreshKey]);

  const {
    data: response,
    loading,
    error,
  } = useFetch(fetchApplicationsByJobId, [jobId]);

  const applications = response?.data || [];
  const [expandedIds, setExpandedIds] = useState([]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "accepted":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const response = await axiosInstance.patch(
        `/api/v1/applications/update-status/${applicationId}`,
        { newStatus }
      );
      showSuccess("Application Status Updated", response.data.message);
      setRefreshKey((prev) => !prev);
    } catch (error) {
      showError("Error", error.response.data.message);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Job Applications</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage candidate applications
        </p>
      </div>

      {loading && (
        <p className="text-muted-foreground text-center py-4">
          Loading applications...
        </p>
      )}

      {error && (
        <p className="text-red-500 text-center py-4">
          Error loading applications: {error.message}
        </p>
      )}

      {!loading && !error && applications.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No applications found</h3>
          <p className="text-muted-foreground">
            Applications will appear here when candidates apply for your jobs.
          </p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {applications.map((application) => {
          const isExpanded = expandedIds.includes(application._id);
          const coverLetterPreview =
            application.coverLetter.slice(0, 150) +
            (application.coverLetter.length > 150 ? "..." : "");

          return (
            <Card
              key={application._id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/placeholder.svg?height=48&width=48`}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(application.applicant.fullname)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg leading-none">
                        {application.applicant.fullname}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-1" />
                        {application.applicant.email}
                      </div>
                    </div>
                  </div>
                  <Select
                    defaultValue={application.status}
                    onValueChange={(value) =>
                      handleStatusChange(application._id, value)
                    }
                  >
                    <SelectTrigger
                      className={`w-32 h-8 ${getStatusColor(
                        application.status
                      )}`}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="font-medium">Cover Letter</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {isExpanded ? application.coverLetter : coverLetterPreview}
                  </p>
                  {application.coverLetter.length > 150 && (
                    <button
                      onClick={() => toggleExpand(application._id)}
                      className="text-blue-600 text-sm flex items-center space-x-1 hover:underline"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          <span>Show less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          <span>Read more</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Resume Link */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="font-medium">Resume</span>
                  </div>
                  {application.resume?.url ? (
                    <a
                      href={application.resume.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-green-700 hover:text-green-900 underline text-sm"
                      title={application.resumeOriginalName || "Resume"}
                    >
                      View Resume
                      {application.resumeOriginalName
                        ? ` (${application.resumeOriginalName})`
                        : ""}
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No resume provided.
                    </p>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Applied {formatDate(application.createdAt)}
                  </div>
                  <div className="text-xs">ID: {application._id.slice(-8)}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
