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

const ApplyJobPage = ({ job }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToastNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      showSuccess(
        "Application Submitted!",
        `Your application for ${job.title} has been submitted successfully.`
      );
      setCoverLetter("");
      setIsOpen(false);
    } catch (error) {
      showError(
        "Application Failed",
        "Failed to submit your application. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-900 hover:bg-green-900/70">Apply</Button>
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
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
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
