"use client";

import { authClient } from "@/lib/auth-client";
import { UserIcon, LockIcon, ImageIcon, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data, isPending } = authClient.useSession();
  useEffect(() => {
    if (isPending) return;
    if (!data) {
      router.push("/register");
      return;
    }
    setName(data.user.name || "");
    setImage(data.user.image || "");
  }, [router]);

  const pathname = usePathname();

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Loading...
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authClient.updateUser({
        name,
        image,
      });
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setMessage(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      setMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto p-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard" className="size-10">
            <button>
              <ArrowLeft className="btn-back" />
            </button>
          </Link>
          <h1 className="text-3xl font-bold ">Profile Settings</h1>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("success")
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {message}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-white/5 mb-6">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-3">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Name</label>
              <div className="flex items-center">
                <div className="input-inline-icon">
                  <UserIcon className="input-inline-svg" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-inline-field"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Profile Image URL
              </label>
              <div className="flex items-center">
                <div className="input-inline-icon">
                  <ImageIcon className="input-inline-svg" />
                </div>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="input-inline-field"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-white/5">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Current Password
              </label>
              <div className="flex items-center">
                <div className="input-inline-icon">
                  <LockIcon className="input-inline-svg" />
                </div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-inline-field"
                  placeholder="Current password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                New Password
              </label>
              <div className="flex items-center">
                <div className="input-inline-icon">
                  <LockIcon className="input-inline-svg" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-inline-field"
                  placeholder="New password (min 8 characters)"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">
                Confirm New Password
              </label>
              <div className="flex items-center">
                <div className="input-inline-icon">
                  <LockIcon className="input-inline-svg" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-inline-field"
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !currentPassword || !newPassword}
              className="btn-primary"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
