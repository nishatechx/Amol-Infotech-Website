import React, { useState } from "react";
import {
  Upload,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Star,
  Check,
  X,
  AlertCircle,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { PhotoItem } from "../../server/defaultData";
import { uploadImageFile } from "../../services/cmsService";
import { CloudinaryPhotoUploader } from "./CloudinaryPhotoUploader";

interface PhotosManagerProps {
  photos: PhotoItem[];
  categories: string[];
  onChangePhotos: (photos: PhotoItem[]) => void;
  onChangeCategories: (categories: string[]) => void;
}

export const PhotosManager: React.FC<PhotosManagerProps> = ({
  photos,
  categories,
  onChangePhotos,
  onChangeCategories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [editingPhoto, setEditingPhoto] = useState<PhotoItem | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showCloudinaryUploader, setShowCloudinaryUploader] = useState<boolean>(false);

  // Category management state
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [newCatName, setNewCatName] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(
    null
  );

  // File Upload Handler (supports multiple files)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    const newPhotos: PhotoItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res = await uploadImageFile(file);

      if (res.success && res.url) {
        const titleFromFilename = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());

        newPhotos.push({
          id: `photo-${Date.now()}-${i}`,
          title: titleFromFilename,
          subtitle: "Photo from institute gallery",
          image: res.url,
          category: categories[0] || "Other",
          isCover: photos.length === 0 && i === 0,
          visible: true,
          order: photos.length + i + 1,
        });
      } else {
        setUploadError(res.error || `Failed to upload ${file.name}`);
      }
    }

    if (newPhotos.length > 0) {
      onChangePhotos([...photos, ...newPhotos]);
    }

    setIsUploading(false);
    e.target.value = "";
  };

  // Toggle Visibility
  const toggleVisibility = (id: string) => {
    const updated = photos.map((p) => (p.id === id ? { ...p, visible: !p.visible } : p));
    onChangePhotos(updated);
  };

  // Set Cover Photo
  const setCoverPhoto = (id: string) => {
    const updated = photos.map((p) => ({
      ...p,
      isCover: p.id === id,
    }));
    onChangePhotos(updated);
  };

  // Move Order
  const movePhoto = (id: string, direction: "up" | "down") => {
    const idx = photos.findIndex((p) => p.id === id);
    if (idx < 0) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === photos.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const cloned = [...photos];
    const temp = cloned[idx];
    cloned[idx] = cloned[targetIdx];
    cloned[targetIdx] = temp;

    // Re-index orders
    const reordered = cloned.map((p, i) => ({ ...p, order: i + 1 }));
    onChangePhotos(reordered);
  };

  // Delete Photo
  const confirmDeletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    onChangePhotos(updated);
    setDeleteConfirmId(null);
  };

  // Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;

    const updated = photos.map((p) => (p.id === editingPhoto.id ? editingPhoto : p));
    onChangePhotos(updated);
    setEditingPhoto(null);
  };

  // Category Actions
  const handleAddCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onChangeCategories([...categories, trimmed]);
    setNewCatName("");
  };

  const handleRenameCategory = () => {
    if (!editingCategory) return;
    const { oldName, newName } = editingCategory;
    const trimmed = newName.trim();
    if (!trimmed || trimmed === oldName) {
      setEditingCategory(null);
      return;
    }

    // Rename in categories list
    const updatedCats = categories.map((c) => (c === oldName ? trimmed : c));
    onChangeCategories(updatedCats);

    // Also update photos that had old category
    const updatedPhotos = photos.map((p) =>
      p.category === oldName ? { ...p, category: trimmed } : p
    );
    onChangePhotos(updatedPhotos);

    setEditingCategory(null);
  };

  const handleDeleteCategory = (catName: string) => {
    if (categories.length <= 1) {
      alert("At least one category is required.");
      return;
    }
    const updatedCats = categories.filter((c) => c !== catName);
    onChangeCategories(updatedCats);

    // Reassign photos with this category to first available
    const fallbackCat = updatedCats[0];
    const updatedPhotos = photos.map((p) =>
      p.category === catName ? { ...p, category: fallbackCat } : p
    );
    onChangePhotos(updatedPhotos);
  };

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      
      {/* Top action bar: Upload & Category Management */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Centre Photos Gallery</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage pictures shown in the "Inside Amol Infotech" section.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Tag className="w-3.5 h-3.5 mr-1.5" />
            Manage Categories ({categories.length})
          </button>

          <button
            type="button"
            onClick={() => setShowCloudinaryUploader(!showCloudinaryUploader)}
            className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-[#0062d2] hover:bg-[#0052b3] rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            <span>{showCloudinaryUploader ? "Close Uploader" : "Upload Photos (Cloudinary Signed)"}</span>
          </button>
        </div>
      </div>

      {/* Cloudinary Photo Uploader Panel */}
      {showCloudinaryUploader && (
        <CloudinaryPhotoUploader
          categories={categories}
          defaultCategory={selectedCategory !== "all" ? selectedCategory : undefined}
          onPhotosUploaded={(newPhotos) => {
            const normalized = [...photos, ...newPhotos].map((p, idx) => ({
              ...p,
              order: idx + 1,
            }));
            onChangePhotos(normalized);
          }}
          onCancel={() => setShowCloudinaryUploader(false)}
        />
      )}

      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Filter Tabs by Category */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
            selectedCategory === "all"
              ? "bg-slate-900 text-white"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          All Photos ({photos.length})
        </button>
        {categories.map((cat) => {
          const count = photos.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Photos Grid Table */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-dashed border-slate-300">
          <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No photos in this category</h3>
          <p className="text-xs text-slate-500 mt-1">
            Upload new photos using the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`bg-white rounded-xl border transition-all overflow-hidden flex flex-col justify-between ${
                photo.visible ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-50"
              }`}
            >
              {/* Photo Image with Cover Badge */}
              <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                <img
                  src={photo.image}
                  alt={photo.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                <div className="absolute top-2 left-2 flex items-center space-x-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                    {photo.category}
                  </span>
                  {photo.isCover && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500 text-white flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" /> Cover
                    </span>
                  )}
                </div>

                {!photo.visible && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-600 text-white">
                    Hidden
                  </div>
                )}
              </div>

              {/* Photo Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{photo.title}</h4>
                  {photo.subtitle && (
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                      {photo.subtitle}
                    </p>
                  )}
                  {photo.publicId && (
                    <div className="mt-1 flex items-center space-x-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-blue-50 text-blue-700 border border-blue-200 truncate max-w-full" title={`Cloudinary: ${photo.publicId}`}>
                        Cloudinary: {photo.publicId.split("/").pop()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Controls */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {/* Reorder arrows */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => movePhoto(photo.id, "up")}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhoto(photo.id, "down")}
                      disabled={index === filteredPhotos.length - 1}
                      className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono ml-1">#{photo.order}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setCoverPhoto(photo.id)}
                      className={`p-1.5 rounded transition-colors cursor-pointer ${
                        photo.isCover
                          ? "text-amber-500"
                          : "text-slate-400 hover:text-amber-500 hover:bg-slate-100"
                      }`}
                      title="Set as Cover Photo"
                    >
                      <Star className={`w-3.5 h-3.5 ${photo.isCover ? "fill-current" : ""}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleVisibility(photo.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                      title={photo.visible ? "Hide from public website" : "Show on public website"}
                    >
                      {photo.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingPhoto(photo)}
                      className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                      title="Edit photo info"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(photo.id)}
                      className="p-1.5 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 cursor-pointer"
                      title="Delete photo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Photo Modal */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Edit Photo Details</h3>
              <button
                type="button"
                onClick={() => setEditingPhoto(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photo Title</label>
                <input
                  type="text"
                  value={editingPhoto.title}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, title: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Short Description (Optional)
                </label>
                <textarea
                  value={editingPhoto.subtitle || ""}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, subtitle: e.target.value })
                  }
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={editingPhoto.category}
                  onChange={(e) =>
                    setEditingPhoto({ ...editingPhoto, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPhoto.visible}
                    onChange={(e) =>
                      setEditingPhoto({ ...editingPhoto, visible: e.target.checked })
                    }
                    className="rounded text-blue-600"
                  />
                  <span className="text-slate-700 font-medium">Visible on public website</span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0062d2] text-white rounded-lg font-semibold hover:bg-[#0052b3] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Delete this photo?</h3>
            <p className="text-xs text-slate-600 mb-5">
              This action will remove the photo from your draft gallery. Remember to publish changes to
              update the live website.
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
                onClick={() => confirmDeletePhoto(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Manage Categories</h3>
              <button
                type="button"
                onClick={() => {
                  setShowCategoryModal(false);
                  setEditingCategory(null);
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Add new category */}
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="text"
                placeholder="New category name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                disabled={!newCatName.trim()}
                className="px-3 py-1.5 bg-[#0062d2] text-white text-xs font-semibold rounded-lg hover:bg-[#0052b3] disabled:opacity-40 cursor-pointer"
              >
                Add
              </button>
            </div>

            {/* Existing Categories List */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const count = photos.filter((p) => p.category === cat).length;
                const isEditing = editingCategory?.oldName === cat;

                return (
                  <div
                    key={cat}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                  >
                    {isEditing ? (
                      <div className="flex items-center space-x-2 flex-1 mr-2">
                        <input
                          type="text"
                          value={editingCategory.newName}
                          onChange={(e) =>
                            setEditingCategory({
                              ...editingCategory,
                              newName: e.target.value,
                            })
                          }
                          className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleRenameCategory}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="p-1 text-slate-400 hover:bg-slate-200 rounded"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <span className="font-semibold text-slate-800">{cat}</span>
                          <span className="text-[11px] text-slate-400 ml-2">({count} photos)</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingCategory({ oldName: cat, newName: cat })
                            }
                            className="p-1 text-slate-500 hover:text-blue-600 rounded"
                            title="Rename"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCategory(cat)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 text-right">
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PhotosManager;
