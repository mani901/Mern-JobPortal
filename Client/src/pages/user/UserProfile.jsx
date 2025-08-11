import React, { useState } from "react";
import { useAuth } from "../../context/authContext.jsx";
import usePost from "@/hooks/usePost";
import { updateProfile } from "@/services/userService";
import useToastNotification from "@/components/common/Toast";
import {
  Camera,
  Edit3,
  Save,
  Plus,
  X,
  User,
  Mail,
  Phone,
  FileText,
  Upload,
} from "lucide-react";

const UserProfile = () => {
  const { user, checkAuthStatus } = useAuth();
  const { showSuccess, showError } = useToastNotification();
  const { execute: update_profile, loading } = usePost(updateProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [selectedProfilePhoto, setSelectedProfilePhoto] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);

  const [profile, setProfile] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    skills: user?.profile?.skills || [],
    bio: user?.profile?.bio || "",
    profilePhoto:
      user?.profile?.profilePhoto?.url || "https://via.placeholder.com/150",
    resume: user?.profile?.resume?.url || "",
    resumeOriginalName: user?.profile?.resumeOriginalName || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, profilePhoto: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedResume(file);
      setProfile((prev) => ({
        ...prev,
        resumeOriginalName: file.name,
      }));
    }
  };

  const addSkill = (e) => {
    if (e) e.preventDefault();
    const skill = newSkill.trim();
    if (skill && !profile.skills.includes(skill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const saveProfile = async () => {
    setIsEditing(false);
    try {
      const requestData = new FormData();
      requestData.append("fullname", profile.fullname);
      requestData.append("email", profile.email);
      requestData.append("phoneNumber", profile.phoneNumber);
      requestData.append("bio", profile.bio);

      profile.skills.forEach((skill) => {
        requestData.append("skills", skill);
      });

      if (selectedProfilePhoto) {
        requestData.append("profilePhoto", selectedProfilePhoto);
      }

      if (selectedResume) {
        requestData.append("resume", selectedResume);
      }

      const response = await update_profile(requestData);
      checkAuthStatus();
      showSuccess(
        "Profile Updated Successfully!",
        response?.message || "Profile update completed."
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Update failed. Please try again.";
      showError("Update Failed", errorMessage);
    }
  };

  const svgBg = `absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Profile Settings
            </h1>
            <p className="text-slate-600 mt-1">
              Manage your personal information
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-900 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <Edit3 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-green-900 via-green-800 to-slate-900 px-8 py-12 relative overflow-hidden">
            <div className={svgBg}></div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative">
              {/* Profile Photo */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl">
                  <img
                    src={profile.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label
                    htmlFor="photo-upload"
                    className="absolute -bottom-2 -right-2 bg-white hover:bg-slate-50 text-slate-700 p-3 rounded-full cursor-pointer shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <Camera size={18} />
                  </label>
                )}
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        name="fullname"
                        value={profile.fullname}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <input
                          type="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                          placeholder="Email"
                        />
                      </div>
                      <div className="relative">
                        <Phone
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                          size={18}
                        />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={profile.phoneNumber}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                          placeholder="Phone"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-white">
                      {profile.fullname}
                    </h2>
                    <div className="flex flex-col md:flex-row gap-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>{profile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{profile.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8 space-y-8">
            {/* About Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="text-slate-600" size={20} />
                <h3 className="text-xl font-semibold text-slate-900">About</h3>
              </div>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="4"
                  className="w-full p-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 placeholder-slate-400"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="bg-slate-50 rounded-lg p-6">
                  <p className="text-slate-700 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="group inline-flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-sm font-medium border border-slate-200"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex items-center gap-3 mt-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    placeholder="Add a new skill"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg bg-white text-slate-700"
                  />
                  <button
                    onClick={addSkill}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-800 text-white rounded-lg"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>
              )}
            </div>

            {/* Resume Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-slate-900">Resume</h3>
              {profile.resumeOriginalName ? (
                <p className="text-slate-700">
                  Uploaded: <strong>{profile.resumeOriginalName}</strong>
                </p>
              ) : (
                <p className="text-slate-500">No resume uploaded.</p>
              )}

              {isEditing && (
                <div className="flex items-center gap-4">
                  <label
                    htmlFor="resume-upload"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-200 text-slate-700"
                  >
                    <Upload size={16} />
                    Upload Resume
                  </label>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="hidden"
                  />
                  {selectedResume && (
                    <span className="text-sm text-slate-600">
                      {selectedResume.name}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Save/Cancel */}
          {isEditing && (
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-slate-600 hover:text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg shadow-sm hover:bg-emerald-700 font-medium"
                  disabled={loading}
                >
                  <Save size={16} />
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
