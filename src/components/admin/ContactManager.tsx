import React, { useState } from "react";
import { ContactInfo } from "../../server/defaultData";
import { Phone, Mail, MapPin, Clock, Globe } from "lucide-react";

interface ContactManagerProps {
  contact: ContactInfo;
  onChangeContact: (contact: ContactInfo) => void;
}

export const ContactManager: React.FC<ContactManagerProps> = ({
  contact,
  onChangeContact,
}) => {
  const [form, setForm] = useState<ContactInfo>(contact);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setSavedSuccess(false);

    if (!form.instituteName.trim()) {
      setValidationError("Institute name cannot be empty.");
      return;
    }
    if (!form.phone.trim()) {
      setValidationError("Phone number cannot be empty.");
      return;
    }
    if (!form.email.trim() || !form.email.includes("@")) {
      setValidationError("Please provide a valid email address.");
      return;
    }
    if (!form.address.trim()) {
      setValidationError("Address cannot be empty.");
      return;
    }

    onChangeContact(form);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Contact Information</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Update phone, email, address, and hours shown across the public website and footer.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 p-6">
        {validationError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-lg">
            {validationError}
          </div>
        )}

        {savedSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-lg">
            Contact information updated in draft! Remember to click "Publish Changes" to push live.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Institute Full Name</label>
            <input
              type="text"
              value={form.instituteName}
              onChange={(e) => setForm({ ...form, instituteName: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Phone Number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1 text-emerald-500" />
                WhatsApp Number
              </label>
              <input
                type="text"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Official Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                Opening Hours
              </label>
              <input
                type="text"
                value={form.openingHours}
                onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Full Physical Address
            </label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={2}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1 flex items-center">
              <Globe className="w-3.5 h-3.5 mr-1 text-slate-400" />
              Google Maps Location Link
            </label>
            <input
              type="url"
              value={form.mapsUrl}
              onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0062d2] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#0052b3] cursor-pointer shadow-xs"
            >
              Update Contact Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactManager;
