import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const runSearch = () => {
    const trimmed = query.trim();
    navigate(trimmed ? `/jobs?q=${encodeURIComponent(trimmed)}` : "/jobs");
  };

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">
            Find Your Next Career Opportunity
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore job listings tailored to your skills and goals.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search jobs by title or location"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runSearch()}
                className="pl-9 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 h-10 rounded-md"
              />
            </div>
            <Button
              size="lg"
              className="bg-green-900 hover:bg-green-700 text-white font-medium h-10"
              onClick={runSearch}
            >
              Search
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-semibold text-gray-900">50K+</p>
              <p className="text-sm text-gray-500">Jobs Available</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">10K+</p>
              <p className="text-sm text-gray-500">Companies</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">1M+</p>
              <p className="text-sm text-gray-500">Users</p>
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">100+</p>
              <p className="text-sm text-gray-500">Industries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
