import React, { useState } from "react";
import { Edit2, Eye, EyeOff, ArrowUp, ArrowDown, Check, X } from "lucide-react";
import { FacilityItem } from "../../server/defaultData";

interface FacilitiesManagerProps {
  facilities: FacilityItem[];
  onChangeFacilities: (facilities: FacilityItem[]) => void;
}

export const FacilitiesManager: React.FC<FacilitiesManagerProps> = ({
  facilities,
  onChangeFacilities,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });

  const toggleVisibility = (id: string) => {
    const updated = facilities.map((f) =>
      f.id === id ? { ...f, visible: !f.visible } : f
    );
    onChangeFacilities(updated);
  };

  const moveFacility = (id: string, direction: "up" | "down") => {
    const idx = facilities.findIndex((f) => f.id === id);
    if (idx < 0) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === facilities.length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const cloned = [...facilities];
    const temp = cloned[idx];
    cloned[idx] = cloned[targetIdx];
    cloned[targetIdx] = temp;

    const reordered = cloned.map((f, i) => ({ ...f, order: i + 1 }));
    onChangeFacilities(reordered);
  };

  const startEdit = (fac: FacilityItem) => {
    setEditingId(fac.id);
    setEditForm({ title: fac.title, description: fac.description });
  };

  const saveEdit = (id: string) => {
    const updated = facilities.map((f) =>
      f.id === id ? { ...f, title: editForm.title.trim(), description: editForm.description.trim() } : f
    );
    onChangeFacilities(updated);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Facilities Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the 10 facilities featured in the "Why Choose Us" section.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden divide-y divide-slate-100">
        {facilities.map((facility, index) => {
          const isEditing = editingId === facility.id;

          return (
            <div
              key={facility.id}
              className={`p-4 transition-colors ${
                facility.visible ? "hover:bg-slate-50/60" : "bg-slate-50 opacity-60"
              }`}
            >
              {isEditing ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Facility Name
                      </label>
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) =>
                          setEditForm({ ...editForm, title: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({ ...editForm, description: e.target.value })
                        }
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => saveEdit(facility.id)}
                      className="px-3 py-1.5 bg-[#0062d2] text-white font-semibold rounded-lg hover:bg-[#0052b3]"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-900">
                        {facility.title}
                      </span>
                      {!facility.visible && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-700 uppercase">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {facility.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-2">
                    {/* Order Controls */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => moveFacility(facility.id, "up")}
                        disabled={index === 0}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveFacility(facility.id, "down")}
                        disabled={index === facilities.length - 1}
                        className="p-1 rounded text-slate-400 hover:text-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono ml-1">#{facility.order}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleVisibility(facility.id)}
                      className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer"
                      title={facility.visible ? "Hide from public website" : "Show on public website"}
                    >
                      {facility.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-red-500" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => startEdit(facility)}
                      className="p-1.5 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 cursor-pointer"
                      title="Edit details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FacilitiesManager;
