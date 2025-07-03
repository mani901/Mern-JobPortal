import HeroSection from "@/components/common/HeroSection";
import Navbar from "@/components/common/Navbar";
import React from "react";
import Login from "./auth/Login";
import JobCard from "@/components/jobs/JobCard";

import Footer from "@/components/common/Footer";
import Company from "./companies/CompanyRegister";

const Home = () => {
  return (
    <>
      <HeroSection />

      <JobCard
        title="Forward Security Director"
        company="Bauck, Schuppe and Schulist Co"
        category="Hotels & Tourism"
        type="Full time"
        salary="$40000-$50000"
        location="New-York, USA"
        timeAgo="10 min ago"
      />

      <JobCard
        title="Forward Security Director"
        company="Bauck, Schuppe and Schulist Co"
        category="Hotels & Tourism"
        type="Full time"
        salary="$40000-$50000"
        location="New-York, USA"
        timeAgo="10 min ago"
      />
    </>
  );
};

export default Home;
