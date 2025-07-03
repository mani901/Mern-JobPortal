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

export default function JobFilterSidebar({ onFilterChange }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [jobTypes, setJobTypes] = useState([]);
  const [experienceLevels, setExperienceLevels] = useState([]);
  const [datePosted, setDatePosted] = useState("");

  const handleJobTypeChange = (type) => {
    if (jobTypes.includes(type)) {
      setJobTypes(jobTypes.filter((t) => t !== type));
    } else {
      setJobTypes([...jobTypes, type]);
    }
  };

  const handleExperienceLevelChange = (level) => {
    if (experienceLevels.includes(level)) {
      setExperienceLevels(experienceLevels.filter((l) => l !== level));
    } else {
      setExperienceLevels([...experienceLevels, level]);
    }
  };

  const applyFilters = () => {
    onFilterChange({
      searchQuery,
      location,
      jobTypes,
      experienceLevels,
      datePosted,
    });
  };

  return (
    <aside className="bg-white shadow-md p-4 rounded-lg w-full max-w-sm">
      {/* Search Bar */}
      <div className="mb-4">
        <label htmlFor="search" className="block text-sm font-medium mb-2">
          Search by Job Title or Company
        </label>
        <Input
          id="search"
          placeholder="Job title or company"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Location
        </label>
        <Select onValueChange={setLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Choose city" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="New York">New York</SelectItem>
              <SelectItem value="San Francisco">San Francisco</SelectItem>
              <SelectItem value="Los Angeles">Los Angeles</SelectItem>
              <SelectItem value="Chicago">Chicago</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Job Type Filter */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Job Type</h3>
        <div className="space-y-2">
          {["Full Time", "Part Time", "Internship"].map((type) => (
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
