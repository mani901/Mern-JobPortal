import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import useToastNotification from "@/components/common/Toast";
import usePost from "@/hooks/usePost";
import { createJob } from "@/services/jobsService";
import { useAuth } from "@/context/authContext";

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];
const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Number of open positions

export const CreateJob = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToastNotification();
  const { execute: postJob, loading: postLoading } = usePost(createJob);
  const { user, loading: authLoading } = useAuth(); // Get user data and loading state

  // Debug logging
  console.log("CreateJob - Full user object:", user);
  console.log("CreateJob - Companies array:", user?.companies);
  console.log("CreateJob - Companies length:", user?.companies?.length);
  console.log("CreateJob - Auth loading state:", authLoading);
  console.log("CreateJob - Post loading state:", postLoading);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [],
    salary: "",
    location: "",
    jobType: "",
    position: 1,
    currentRequirement: "",
    companyId: "", // Add company selection
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRequirement = () => {
    if (formData.currentRequirement.trim()) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, formData.currentRequirement],
        currentRequirement: "",
      });
    }
  };

  const handleRemoveRequirement = (index) => {
    const updatedRequirements = [...formData.requirements];
    updatedRequirements.splice(index, 1);
    setFormData({ ...formData, requirements: updatedRequirements });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if user has companies
    if (!user?.companies || user.companies.length === 0) {
      showError(
        "No Companies Found",
        "You need to register a company first before posting jobs."
      );
      navigate("/create-company");
      return;
    }

    // Check if company is selected
    if (!formData.companyId) {
      showError(
        "Company Required",
        "Please select a company for this job posting."
      );
      return;
    }

    // Debug: Check what companyId is being sent
    console.log("Selected companyId:", formData.companyId);
    console.log("Full formData:", formData);

    try {
      // Prepare job data for API - include company ID
      const jobData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        salary: Number(formData.salary),
        location: formData.location,
        jobType: formData.jobType,
        position: Number(formData.position),
        companyId: formData.companyId,
      };

      // Debug: Check final payload being sent to API
      console.log("Job data being sent to API:", jobData);

      const response = await postJob(jobData);
      showSuccess(
        "Job Posted!",
        response?.message || "Your job posting has been created successfully."
      );
      navigate("/jobs"); // Redirect after successful posting
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to post job. Please try again.";
      showError("Job Posting Failed", errorMessage);
    }
  };

  // Show loading spinner if auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Post a New Job</CardTitle>
          <CardDescription>
            Fill in the details to create a new job posting
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary (USD) *</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  placeholder="e.g. 80000"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="e.g. New York, NY"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  name="jobType"
                  value={formData.jobType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, jobType: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Number of Positions *</Label>
                <Select
                  name="position"
                  value={formData.position}
                  onValueChange={(value) =>
                    setFormData({ ...formData, position: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of positions" />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((num) => (
                      <SelectItem key={num} value={num}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                {user?.companies && user.companies.length > 0 ? (
                  <Select
                    name="companyId"
                    value={formData.companyId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, companyId: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select company" />
                    </SelectTrigger>
                    <SelectContent>
                      {user.companies.map((company, index) => {
                        // Handle both ObjectId strings and populated company objects
                        const companyId =
                          typeof company === "string" ? company : company._id;
                        const companyName =
                          typeof company === "string"
                            ? `Company ${index + 1}`
                            : company.name || `Company ${index + 1}`;

                        return (
                          <SelectItem key={companyId} value={companyId}>
                            {companyName}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center justify-center h-10 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                    <span className="text-sm text-gray-500">
                      No companies available
                    </span>
                  </div>
                )}
                {(!user?.companies || user.companies.length === 0) && (
                  <p className="text-sm text-red-500">
                    You need to register a company first.{" "}
                    <button
                      type="button"
                      onClick={() => navigate("/create-company")}
                      className="underline hover:text-red-700"
                    >
                      Create Company
                    </button>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Detailed description of the job responsibilities"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Requirements</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.currentRequirement}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentRequirement: e.target.value,
                    })
                  }
                  placeholder="Add a requirement"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddRequirement}
                >
                  Add
                </Button>
              </div>
              {formData.requirements.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.requirements.map((req, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {req}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(index)}
                        className="rounded-full p-0.5 hover:bg-gray-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-700"
              disabled={postLoading}
            >
              {postLoading ? "Posting Job..." : "Post Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJob;
