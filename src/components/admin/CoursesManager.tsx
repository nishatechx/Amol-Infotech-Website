import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Upload,
  X,
  BookOpen,
} from "lucide-react";
import { CourseItem } from "../../server/defaultData";
import { uploadImageFile } from "../../services/cmsService";

interface CoursesManagerProps {
  courses: CourseItem[];
  onChangeCourses: (courses: CourseItem[]) => void;
}

export const CoursesManager: React.FC<CoursesManagerProps> = ({
  courses,
  onChangeCourses,
}) => {
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [isNew, setIsNew] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Toggle Visibility
  const toggleVisibility = (id: string) => {
    const updated = courses.map((c) =>
      c.id === id ? { ...c, visible: !c.visible } : c
    );
    onChangeCourses(updated);
  };

  // Reorder
  const moveCourse = (id: string, direction: "up" | "down") => {
    const idx = courses.findIndex((c) => c.id === id);
    if (idx < 0) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === courses.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const cloned = [...courses];
    const temp = cloned[idx];
    cloned[idx] = cloned[targetIdx];
    cloned[targetIdx] = temp;

    const reordered = cloned.map((c, i) => ({ ...c, order: i + 1 }));
    onChangeCourses(reordered);
  };

  // Handle Delete
  const confirmDelete = (id: string) => {
    const updated = courses.filter((c) => c.id !== id);
    onChangeCourses(updated);
    setDeleteConfirmId(null);
  };

  // Handle Image Upload for Course
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingCourse) return;

    setIsUploading(true);
    const res = await uploadImageFile(file);
    setIsUploading(false);

    if (res.success && res.url) {
      setEditingCourse({
        ...editingCourse,
        logoUrl: res.url,
      });
    } else {
      alert(res.error || "Failed to upload image");
    }
  };

  // Save Add/Edit
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    if (isNew) {
      onChangeCourses([...courses, editingCourse]);
    } else {
      const updated = courses.map((c) =>
        c.id === editingCourse.id ? editingCourse : c
      );
      onChangeCourses(updated);
    }

    setEditingCourse(null);
    setIsNew(false);
  };

  const handleAddNew = () => {
    setIsNew(true);
    setEditingCourse({
      id: `course-${Date.now()}`,
      name: "",
      subtitle: "",
      duration: "2 Months",
      category: "certificate",
      badge: "Govt. Recognized",
      logoUrl: "",
      visible: true,
      order: courses.length + 1,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Courses Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage courses shown in the "Explore Our Courses" section.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNew}
          className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#0062d2] hover:bg-[#0052b3] rounded-lg transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add New Course
        </button>
      </div>

      {/* Courses List */}
      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100">
        {courses.map((course, index) => (
          <div
            key={course.id}
            className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
              course.visible ? "hover:bg-slate-50/60" : "bg-slate-50 opacity-60"
            }`}
          >
            {/* Left: Thumbnail & info */}
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white p-1 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {course.logoUrl ? (
                  <img
                    src={course.logoUrl}
                    alt={course.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <BookOpen className="w-5 h-5 text-slate-400" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-xs font-bold text-slate-900">{course.name}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                    {course.category}
                  </span>
                  {course.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {course.badge}
                    </span>
                  )}
                  {!course.visible && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700 uppercase">
                      Hidden
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1 max-w-lg">
                  {course.subtitle}
                </p>
                <span className="text-[11px] text-slate-400 font-medium">
                  Duration: {course.duration}
                </span>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              {/* Order Controls */}
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => moveCourse(course.id, "up")}
                  disabled={index === 0}
                  className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                  title="Move Up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveCourse(course.id, "down")}
                  disabled={index === courses.length - 1}
                  className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                  title="Move Down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-slate-400 font-mono ml-1">#{course.order}</span>
              </div>

              {/* Action buttons */}
              <button
                type="button"
                onClick={() => toggleVisibility(course.id)}
                className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                title={course.visible ? "Hide from public website" : "Show on public website"}
              >
                {course.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-500" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsNew(false);
                  setEditingCourse(course);
                }}
                className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                title="Edit Course"
              >
                <Edit2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmId(course.id)}
                className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 cursor-pointer"
                title="Delete Course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                {isNew ? "Add New Course" : "Edit Course Details"}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Course Name</label>
                  <input
                    type="text"
                    value={editingCourse.name}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, name: e.target.value })
                    }
                    placeholder="e.g. MS-CIT"
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={editingCourse.duration}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, duration: e.target.value })
                    }
                    placeholder="e.g. 3 Months"
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  value={editingCourse.subtitle}
                  onChange={(e) =>
                    setEditingCourse({ ...editingCourse, subtitle: e.target.value })
                  }
                  rows={2}
                  placeholder="Official course scope and syllabus summary"
                  required
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={editingCourse.category}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        category: e.target.value as "certificate" | "professional",
                      })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="certificate">Certificate</option>
                    <option value="professional">Professional & Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={editingCourse.badge}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, badge: e.target.value })
                    }
                    placeholder="e.g. MKCL Authorized"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Course Logo / Image Upload */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Course Icon / Image URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editingCourse.logoUrl}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, logoUrl: e.target.value })
                    }
                    placeholder="https://... or upload below"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer flex items-center">
                    <Upload className="w-3.5 h-3.5 mr-1" />
                    <span>{isUploading ? "..." : "Upload"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCourse.visible}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, visible: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-700 font-medium">Visible on public website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0062d2] text-white rounded-lg font-semibold hover:bg-[#0052b3] cursor-pointer"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Delete this course?</h3>
            <p className="text-xs text-slate-600 mb-5">
              This action will remove the course from your draft catalogue.
            </p>
            <div className="flex justify-end space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CoursesManager;
