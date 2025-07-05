import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Briefcase,
  Building2,
  Clock,
} from "lucide-react";

const AppliedJobCard = ({ application }) => {
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">
            {application.job.title}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Building2 className="mr-1 h-4 w-4" />
            {application.job.companyId.name}
          </div>
        </div>
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={application.job.companyId.logo}
            alt={application.job.companyId.name}
          />
          <AvatarFallback>
            {application.job.companyId.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{application.job.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Full-time</span>
          </div>
          <div className="flex items-center space-x-1">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {format(new Date(application.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Applied</span>
          </Badge>
          <Badge variant="outline">Pending Review</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppliedJobCard;
