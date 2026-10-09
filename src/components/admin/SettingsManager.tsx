import React, { useState } from "react";
import { WebsiteSettings } from "../../server/defaultData";
import { changePassword } from "../../services/cmsService";
import { Lock, CheckCircle, AlertCircle } from "lucide-react";

interface SettingsManagerProps {
  settings: WebsiteSettings;
  onChangeSettings: (settings: WebsiteSettings) => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onChangeSettings,
}) => {
  const [form, setForm] = useState<WebsiteSettings>(settings);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Password change state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [isChangingPw, setIsChangingPw] = useState(false);

  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeSettings(form);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(null);

    if (!oldPassword) {
      setPwError("Please enter your current password.");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }

    setIsChangingPw(true);
    const res = await changePassword(oldPassword, newPassword);
    setIsChangingPw(false);

    if (res.success) {
      setPwSuccess("Password successfully changed!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPwError(res.error || "Failed to update password.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Website & Account Settings</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage basic SEO, social channels, and director security credentials.
          </p>
        </div>
      </div>

      {/* Website Basic SEO & Social Links */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
          General Website Information
        </h3>

        {settingsSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg">
            Settings updated in draft! Remember to click "Publish Changes" to push live.
          </div>
        )}

        <form onSubmit={handleSettingsSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Website SEO Title</label>
            <input
              type="text"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Search Meta Description
            </label>
            <textarea
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              rows={2}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand Name / Logo Text</label>
              <input
                type="text"
                value={form.logoText}
                onChange={(e) => setForm({ ...form, logoText: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Google Maps Listing URL</label>
              <input
                type="url"
                value={form.googleMapsListingUrl}
                onChange={(e) =>
                  setForm({ ...form, googleMapsListingUrl: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Facebook Page</label>
              <input
                type="url"
                value={form.facebookUrl}
                onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Instagram Profile</label>
              <input
                type="url"
                value={form.instagramUrl}
                onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">YouTube Channel</label>
              <input
                type="url"
                value={form.youtubeUrl}
                onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0062d2] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#0052b3] cursor-pointer shadow-xs"
            >
              Save Website Settings
            </button>
          </div>
        </form>
      </div>

      {/* Security: Change Director Password */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-6">
        <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100">
          <Lock className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900">Change Director Password</h3>
        </div>

        {pwError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{pwError}</span>
          </div>
        )}

        {pwSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{pwSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              New Password (min 8 characters)
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isChangingPw}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {isChangingPw ? "Updating Password..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default SettingsManager;
