// components/ApplyJobModal.jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import useToastNotification from "@/components/common/Toast";
import usePost from "@/hooks/usePost";
import { applyJob } from "@/services/applicationService";
import { useNavigate } from "react-router-dom";

const ApplyJobPage = ({ job }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { showSuccess, showError } = useToastNotification();
  const { execute: submitApplication, loading } = usePost();

  const [formData, setFormData] = useState({
    coverLetter: "",
    jobId: job._id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare application data for API
      const applicationData = {
        coverLetter: formData.coverLetter,
        jobId: job._id,
      };

      const response = await submitApplication(() => applyJob(applicationData));

      showSuccess(response?.message);
      setIsOpen(false);
      //  navigate("/my-applications");
    } catch (error) {
      console.log("Error occurred:", error);
      const errorMessage = error.response?.data?.message;
      showError("Job Application Failed", errorMessage);
    }
  };

  const handleApplyClick = () => {
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-green-900 hover:bg-green-900/70"
          onClick={handleApplyClick}
        >
          Apply
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl w-full max-h-[90vh] overflow-y-auto rounded-xl px-4 sm:px-8 py-6">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Apply for <span className="text-green-700">{job.title}</span> at{" "}
            <span className="font-semibold">{job.company?.name}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              rows={6}
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Why are you a good fit for this role?"
              required
              className="resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobPage;
