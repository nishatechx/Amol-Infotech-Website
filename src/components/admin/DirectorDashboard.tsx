import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Image,
  BookOpen,
  Building,
  Phone,
  Settings,
  LogOut,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
  Save,
  Send,
  RotateCcw,
  Menu,
  X,
  User,
} from "lucide-react";
import AmolLogo from "../AmolLogo";
import PhotosManager from "./PhotosManager";
import CoursesManager from "./CoursesManager";
import FacilitiesManager from "./FacilitiesManager";
import ContactManager from "./ContactManager";
import SettingsManager from "./SettingsManager";
import {
  CmsStoreData,
  PhotoItem,
  CourseItem,
  FacilityItem,
  ContactInfo,
  WebsiteSettings,
  fetchCmsContent,
  saveDraftChanges,
  publishAllChanges,
  discardDraft,
  directorLogout,
  checkDirectorAuth,
  DirectorUser,
} from "../../services/cmsService";

interface DirectorDashboardProps {
  onNavigate: (path: string) => void;
}

type TabType = "dashboard" | "photos" | "courses" | "facilities" | "contact" | "settings";

export const DirectorDashboard: React.FC<DirectorDashboardProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [director, setDirector] = useState<DirectorUser | null>(null);
  const [draftData, setDraftData] = useState<CmsStoreData | null>(null);
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState<boolean>(false);
  const [hasLocalUnsavedEdits, setHasLocalUnsavedEdits] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showPublishModal, setShowPublishModal] = useState<boolean>(false);

  // Authenticate session on mount
  useEffect(() => {
    checkDirectorAuth().then((auth) => {
      if (!auth.authenticated || !auth.user) {
        onNavigate("/director-login");
      } else {
        setDirector(auth.user);
        loadCmsData();
      }
    });
  }, [onNavigate]);

  const loadCmsData = async () => {
    setIsLoading(true);
    const res = await fetchCmsContent();
    setIsLoading(false);

    if (res.success && res.draft) {
      setDraftData(res.draft);
      setHasUnpublishedChanges(!!res.hasUnpublishedChanges);
      setHasLocalUnsavedEdits(false);
    } else if (res.error?.includes("Unauthorized")) {
      onNavigate("/director-login");
    }
  };

  const showStatus = (type: "success" | "error", text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // 1. SAVE DRAFT
  const handleSaveDraft = async () => {
    if (!draftData) return;
    setIsSaving(true);
    const res = await saveDraftChanges(draftData);
    setIsSaving(false);

    if (res.success) {
      setHasLocalUnsavedEdits(false);
      setHasUnpublishedChanges(true);
      showStatus("success", "Changes saved to draft. Click 'Publish Changes' when ready to go live.");
    } else {
      showStatus("error", res.error || "Failed to save draft.");
    }
  };

  // 2. PUBLISH TO LIVE
  const handlePublishLive = async () => {
    setIsPublishing(true);
    // If there were local unsaved edits, save them first
    if (draftData && hasLocalUnsavedEdits) {
      await saveDraftChanges(draftData);
    }

    const res = await publishAllChanges();
    setIsPublishing(false);
    setShowPublishModal(false);

    if (res.success) {
      setHasLocalUnsavedEdits(false);
      setHasUnpublishedChanges(false);
      showStatus("success", "All changes published live to the public website!");
    } else {
      showStatus("error", res.error || "Publish operation failed.");
    }
  };

  // 3. DISCARD DRAFT
  const handleDiscardDraft = async () => {
    if (!confirm("Discard all unpublished draft edits and revert to the published website?")) return;
    const res = await discardDraft();
    if (res.success) {
      await loadCmsData();
      showStatus("success", "Draft reverted back to the current published state.");
    } else {
      showStatus("error", res.error || "Failed to revert draft.");
    }
  };

  // 4. LOGOUT
  const handleLogout = async () => {
    await directorLogout();
    onNavigate("/director-login");
  };

  // 5. PREVIEW
  const handlePreview = () => {
    window.open("/?preview=true", "_blank");
  };

  // State mutators for each module
  const updatePhotos = (photos: PhotoItem[]) => {
    if (!draftData) return;
    setDraftData({ ...draftData, photos });
    setHasLocalUnsavedEdits(true);
  };

  const updateCategories = (categories: string[]) => {
    if (!draftData) return;
    setDraftData({ ...draftData, categories });
    setHasLocalUnsavedEdits(true);
  };

  const updateCourses = (courses: CourseItem[]) => {
    if (!draftData) return;
    setDraftData({ ...draftData, courses });
    setHasLocalUnsavedEdits(true);
  };

  const updateFacilities = (facilities: FacilityItem[]) => {
    if (!draftData) return;
    setDraftData({ ...draftData, facilities });
    setHasLocalUnsavedEdits(true);
  };

  const updateContact = (contact: ContactInfo) => {
    if (!draftData) return;
    setDraftData({ ...draftData, contact });
    setHasLocalUnsavedEdits(true);
  };

  const updateSettings = (settings: WebsiteSettings) => {
    if (!draftData) return;
    setDraftData({ ...draftData, settings });
    setHasLocalUnsavedEdits(true);
  };

  if (isLoading || !draftData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AmolLogo className="h-8 w-auto mx-auto mb-3 animate-pulse" />
          <p className="text-xs font-semibold text-slate-500">Loading Centre Director CMS...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "photos", label: "Centre Photos", icon: Image },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "facilities", label: "Facilities", icon: Building },
    { id: "contact", label: "Contact Information", icon: Phone },
    { id: "settings", label: "Website Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Mobile hamburger & Logo */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center space-x-2.5">
              <AmolLogo className="h-7 w-auto" />
              <div className="hidden sm:block border-l border-slate-200 pl-2.5">
                <span className="text-xs font-bold text-slate-900">CMS Portal</span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">Director Administration</span>
              </div>
            </div>
          </div>

          {/* Right: Actions (Save, Preview, Publish, Director badge, Logout) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Draft / Unsaved Badge */}
            {hasLocalUnsavedEdits ? (
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Unsaved local changes
              </span>
            ) : hasUnpublishedChanges ? (
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Draft saved (Unpublished)
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-2.5 h-2.5 mr-1" /> All changes live
              </span>
            )}

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Save changes to draft storage"
            >
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>{isSaving ? "Saving..." : "Save Draft"}</span>
            </button>

            {/* Preview Button */}
            <button
              type="button"
              onClick={handlePreview}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              title="Preview public website with draft changes"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              <span className="hidden sm:inline">Preview</span>
            </button>

            {/* Publish Changes Button */}
            <button
              type="button"
              onClick={() => setShowPublishModal(true)}
              className="inline-flex items-center px-3.5 py-1.5 text-xs font-bold text-white bg-[#0062d2] hover:bg-[#0052b3] rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-1" />
              <span>Publish</span>
            </button>

            {/* User Profile & Logout */}
            <div className="border-l border-slate-200 pl-2 sm:pl-3 flex items-center space-x-2">
              <div className="hidden lg:block text-right text-xs leading-tight">
                <div className="font-bold text-slate-800">{director?.name || "Director"}</div>
                <div className="text-[10px] text-slate-400">Mr. Ravindra Solanke</div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Floating Status Notification Toast */}
      {statusMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 p-3.5 rounded-xl shadow-lg border text-xs font-medium max-w-sm flex items-center space-x-2.5 transition-all ${
            statusMessage.type === "success"
              ? "bg-slate-900 text-white border-slate-800"
              : "bg-red-600 text-white border-red-700"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-white flex-shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex px-4 sm:px-6 py-6 gap-6">
        
        {/* Left Sidebar (Desktop) */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <nav className="bg-white rounded-xl border border-slate-200/90 p-2 space-y-1 sticky top-20 shadow-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 mt-2">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-white h-full shadow-2xl p-4 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="text-xs font-bold text-slate-900">Centre CMS Navigation</div>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveTab(item.id as TabType);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isActive
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 text-xs font-semibold text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Website Content Management
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Manage your institute website content. All updates are saved to draft storage and
                  can be published live to public visitors anytime.
                </p>
              </div>

              {/* Management Overview Rows/Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* 1. Centre Photos */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Image className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Centre Photos</h3>
                      <p className="text-xs text-slate-500">
                        {draftData.photos.length} photos in {draftData.categories.length} categories
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("photos")}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0062d2] bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
                  >
                    Manage Photos
                  </button>
                </div>

                {/* 2. Courses */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Courses</h3>
                      <p className="text-xs text-slate-500">
                        {draftData.courses.length} career & certificate courses
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("courses")}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0062d2] bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
                  >
                    Manage Courses
                  </button>
                </div>

                {/* 3. Facilities */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Facilities</h3>
                      <p className="text-xs text-slate-500">
                        {draftData.facilities.length} institute infrastructure highlights
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("facilities")}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0062d2] bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
                  >
                    Manage Facilities
                  </button>
                </div>

                {/* 4. Contact Information */}
                <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex items-center justify-between">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Contact Information</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {draftData.contact.phone} • {draftData.contact.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("contact")}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0062d2] bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer transition-colors"
                  >
                    Edit Details
                  </button>
                </div>

              </div>

              {/* Quick Publishing Workflow Guide Card */}
              <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Content Publishing Workflow
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                    <div className="font-bold text-slate-900 mb-1">1. Edit Content</div>
                    <p className="text-slate-500">
                      Upload photos, add courses, or modify text. All edits are saved in your draft
                      store.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                    <div className="font-bold text-slate-900 mb-1">2. Preview Safely</div>
                    <p className="text-slate-500">
                      Click the "Preview" button in the top navigation to verify changes before making
                      them public.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70">
                    <div className="font-bold text-slate-900 mb-1">3. Publish Live</div>
                    <p className="text-slate-500">
                      Click "Publish" to push draft changes to live visitors on the website
                      immediately.
                    </p>
                  </div>
                </div>

                {hasUnpublishedChanges && (
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                    <div className="text-xs text-blue-700 font-semibold flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                      You have unpublished draft edits waiting.
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleDiscardDraft}
                        className="text-xs text-slate-500 hover:text-red-600 px-2.5 py-1 rounded cursor-pointer"
                      >
                        Discard Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPublishModal(true)}
                        className="text-xs bg-[#0062d2] hover:bg-[#0052b3] text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Publish Now
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: PHOTOS */}
          {activeTab === "photos" && (
            <PhotosManager
              photos={draftData.photos}
              categories={draftData.categories}
              onChangePhotos={updatePhotos}
              onChangeCategories={updateCategories}
            />
          )}

          {/* TAB 3: COURSES */}
          {activeTab === "courses" && (
            <CoursesManager
              courses={draftData.courses}
              onChangeCourses={updateCourses}
            />
          )}

          {/* TAB 4: FACILITIES */}
          {activeTab === "facilities" && (
            <FacilitiesManager
              facilities={draftData.facilities}
              onChangeFacilities={updateFacilities}
            />
          )}

          {/* TAB 5: CONTACT */}
          {activeTab === "contact" && (
            <ContactManager
              contact={draftData.contact}
              onChangeContact={updateContact}
            />
          )}

          {/* TAB 6: SETTINGS */}
          {activeTab === "settings" && (
            <SettingsManager
              settings={draftData.settings}
              onChangeSettings={updateSettings}
            />
          )}

        </main>
      </div>

      {/* Confirmation Modal: Publish Live */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-200 text-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Publish Changes to Live Website?</h3>
            <p className="text-slate-600 mb-5 leading-relaxed">
              This will update the public website immediately with all your draft changes (photos,
              courses, facilities, and contact info).
            </p>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowPublishModal(false)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePublishLive}
                disabled={isPublishing}
                className="px-4 py-2 bg-[#0062d2] text-white font-bold rounded-lg hover:bg-[#0052b3] cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? "Publishing..." : "Yes, Publish Live"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DirectorDashboard;
