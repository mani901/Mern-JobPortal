"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function JobFilterSidebar({ onFilterChange, filters = {} }) {
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || "");
  const [location, setLocation] = useState(filters.location || "");
  const [jobTypes, setJobTypes] = useState(filters.jobTypes || []);
  const [experienceLevels, setExperienceLevels] = useState(filters.experienceLevels || []);
  const [datePosted, setDatePosted] = useState(filters.datePosted || "");
  const [minSalary, setMinSalary] = useState(filters.minSalary || "");
  const [maxSalary, setMaxSalary] = useState(filters.maxSalary || "");

  const handleJobTypeChange = (type) => {
    if (jobTypes.includes(type)) {
      setJobTypes(jobTypes.filter((t) => t !== type));
    } else {
      setJobTypes([...jobTypes, type]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocation("");
    setJobTypes([]);
    setExperienceLevels([]);
    setDatePosted("");
    setMinSalary("");
    setMaxSalary("");
    onFilterChange({});
  };

  const applyFilters = () => {
    const filterData = {
      searchQuery,
      location,
      jobTypes,
      experienceLevels,
      datePosted,
      minSalary: minSalary ? Number(minSalary) : undefined,
      maxSalary: maxSalary ? Number(maxSalary) : undefined,
    };
    onFilterChange(filterData);
  };

  const hasActiveFilters = searchQuery || location || jobTypes.length > 0 || 
    experienceLevels.length > 0 || datePosted || minSalary || maxSalary;

  return (
    <aside className="bg-white shadow-md p-4 rounded-lg w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search by Job Title
        </label>
        <Input
          id="search"
          placeholder="Job title or keywords"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              applyFilters();
            }
          }}
          className="w-full"
        />
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Location
        </label>
        <Input
          id="location"
          placeholder="City, state, or remote"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              applyFilters();
            }
          }}
          className="w-full"
        />
      </div>

      {/* Job Type Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Job Type</h3>
        <div className="space-y-2">
          {["Full Time", "Part Time", "Internship", "Contract", "Freelance"].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={`job-type-${type}`}
                checked={jobTypes.includes(type)}
                onCheckedChange={() => handleJobTypeChange(type)}
              />
              <label htmlFor={`job-type-${type}`} className="text-sm">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Range Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Salary Range</h3>
        <div className="space-y-2">
          <Input
            placeholder="Min salary"
            type="number"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            className="w-full"
          />
          <Input
            placeholder="Max salary"
            type="number"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Date Posted Filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Date Posted</h3>
        <Select onValueChange={setDatePosted} value={datePosted}>
          <SelectTrigger>
            <SelectValue placeholder="Any time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="any">Any time</SelectItem>
              <SelectItem value="last-hour">Last hour</SelectItem>
              <SelectItem value="last-24-hours">Last 24 hours</SelectItem>
              <SelectItem value="last-week">Last week</SelectItem>
              <SelectItem value="last-month">Last month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Apply Filters Button */}
      <Button onClick={applyFilters} className="w-full">
        Apply Filters
      </Button>
    </aside>
  );
}
