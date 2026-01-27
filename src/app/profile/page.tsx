"use client";

import { authClient } from "@/lib/auth-client";
import { UserIcon, MailIcon, LockIcon, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [session, setSession] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      if (!data) {
        router.push("/register");
        return;
      }
      setSession(data);
      setName(data.user.name || "");
      setEmail(data.user.email || "");
      setImage(data.user.image || "");
    };
    fetchSession();
  }, [router]);

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

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authClient.changeEmail({
        newEmail: email,
      });
      setMessage("Verification email sent to your new address!");
    } catch (error: any) {
      setMessage(error.message || "Failed to change email");
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

  if (!session) {
    return (
      <div className="flex justify-center items-center h-full text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Profile Settings</h1>

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
