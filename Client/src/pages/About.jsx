import { Link } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Users,
  ShieldCheck,
  Bookmark,
  FileText,
} from "lucide-react";

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
    <div className="h-10 w-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 via-emerald-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
              A modern job portal for students and recruiters
            </h1>
            <p className="mt-4 text-lg text-emerald-100">
              Search roles, apply with your profile resume, manage companies and
              job postings, and track applicants — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/jobs"
                className="inline-flex items-center px-5 py-2.5 rounded-md bg-white text-green-900 font-medium hover:bg-emerald-50"
              >
                Browse Jobs
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-5 py-2.5 rounded-md bg-emerald-600 text-white font-medium hover:bg-emerald-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-8 md:-mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat icon={Briefcase} label="Open roles" value="50K+" />
          <Stat icon={Building2} label="Companies" value="10K+" />
          <Stat icon={Users} label="Candidates" value="1M+" />
          <Stat
            icon={ShieldCheck}
            label="Secured"
            value="Rate limited • Helmet • CORS"
          />
        </div>
      </section>

      {/* Highlights */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">For Students</h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-green-700" /> Save jobs to
                review later
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-green-700" /> Apply with cover
                letter + profile resume
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-4 w-4 text-green-700" /> Track your
                applications
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">For Recruiters</h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-green-700" /> Manage company
                profiles
              </li>
              <li className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-green-700" /> Create jobs and
                view applicants
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-green-700" /> Update status
                and review resumes
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Built Right</h3>
            <ul className="text-gray-600 space-y-2 text-sm">
              <li>React 19 • Vite • Tailwind • ShadCN</li>
              <li>Express • MongoDB • Cloudinary • JWT</li>
              <li>Consistent API: {`{ success, message, data }`}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="rounded-2xl bg-white border border-gray-200 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              Ready to explore?
            </h3>
            <p className="text-gray-600 mt-1">
              Find opportunities or start hiring in minutes.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/jobs"
              className="px-4 py-2 rounded-md bg-green-800 hover:bg-green-700 text-white font-medium"
            >
              Find Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
