import React, { useState } from "react";
import { Phone, Mail, MapPin, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useCms } from "../hooks/useCms";
import { DEFAULT_CONTACT } from "../server/defaultData";

interface ContactProps {
  initialCourse?: string;
  selectedCourse?: string;
}

export const Contact: React.FC<ContactProps> = ({ initialCourse = "", selectedCourse = "" }) => {
  const { content } = useCms();
  const contactInfo = content?.contact || DEFAULT_CONTACT;
  const effectiveCourse = selectedCourse || initialCourse || "";

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    course: effectiveCourse,
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // Update selected course if changed from parent
  React.useEffect(() => {
    if (effectiveCourse) {
      setFormData((prev) => ({ ...prev, course: effectiveCourse }));
    }
  }, [effectiveCourse]);

  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errors.name = "Please enter your full name (at least 2 characters).";
    }

    const cleanMobile = formData.mobile.replace(/\D/g, "");
    if (!formData.mobile.trim() || cleanMobile.length < 10) {
      errors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          email: formData.email.trim(),
          course: formData.course || "General Inquiry",
          message: formData.message.trim(),
          honeypot: honeypot,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        // Clear the form after successful submission
        setFormData({
          name: "",
          mobile: "",
          email: "",
          course: effectiveCourse || "",
          message: "",
        });
        setHoneypot("");
        setFieldErrors({});
      } else {
        setErrorMessage(
          data.error || "Sorry, we couldn't submit your enquiry right now. Please try again."
        );
      }
    } catch (err) {
      setErrorMessage("Sorry, we couldn't submit your enquiry right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="scroll-reveal py-20 bg-gradient-to-br from-[#041224] via-[#071f3e] to-[#030e1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Contact Information (4 cols) */}
          <div className="lg:col-span-4 pr-0 lg:pr-4 flex flex-col justify-between">
            <div>
              <div className="inline-block text-xs font-bold tracking-widest text-[#38bdf8] uppercase mb-1.5 bg-gradient-to-r from-blue-900/60 to-indigo-900/40 px-3 py-1 rounded-full border border-blue-400/30 shadow-2xs">
                GET IN TOUCH
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Get in <span className="bg-gradient-to-r from-[#38bdf8] via-[#60a5fa] to-[#93c5fd] bg-clip-text text-transparent">Touch</span>
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-300 font-normal mb-8">
                Visit our campus or get in touch for admissions and inquiry.
              </p>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-center space-x-4 group">
                  <div className="w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:border-blue-400/50">
                    <Phone className="w-5 h-5 text-blue-400 transition-transform duration-200 group-hover:rotate-12" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      Call / WhatsApp
                    </div>
                    <a
                      href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                      className="text-base font-bold text-white hover:text-blue-300 transition-colors duration-200"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center space-x-4 group">
                  <div className="w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-white flex-shrink-0 transition-transform duration-200 group-hover:scale-105 group-hover:border-red-400/50">
                    <Mail className="w-5 h-5 text-red-400 transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      Email Address
                    </div>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-base font-medium text-slate-200 hover:text-white transition-colors duration-200"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4 group">
                  <div className="w-11 h-11 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-white flex-shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-105 group-hover:border-emerald-400/50">
                    <MapPin className="w-5 h-5 text-emerald-400 transition-transform duration-200 group-hover:scale-110" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                      Campus Location
                    </div>
                    <p className="text-[14px] font-medium text-slate-200 leading-relaxed whitespace-pre-line">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <a
                href="https://www.google.com/maps/place/Amol+Infotech+%26+Maharana+Typing+Institute+Risod/@19.9756173,76.7897233,17z/"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors duration-200"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Column 2: Inquiry Form White Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-7 text-slate-900 border border-slate-100 h-full flex flex-col justify-between">
              
              {/* Success UX State */}
              {submitted ? (
                <div className="py-8 text-center space-y-4 my-auto animate-scale-in">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2 border border-emerald-200">
                      ✓ Enquiry Submitted
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      Thank you for contacting
                    </h3>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">
                      Amol Infotech & Maharana Typing Institute
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto leading-relaxed">
                    Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setErrorMessage(null);
                      }}
                      className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer shadow-md shadow-blue-500/25 transform hover:-translate-y-0.5 active:scale-[0.98]"
                    >
                      Submit Another Enquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
                  <div className="border-b border-slate-100 pb-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">Enquiry Form</h3>
                    <p className="text-xs text-slate-500">
                      Fill details below to get instant course counselling.
                    </p>
                  </div>

                  {/* Honeypot anti-spam bot field (hidden from genuine users) */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="website_url_check"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Error Alert Message */}
                  {errorMessage && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-scale-in">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Row 1: Student Name and Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                        }}
                        className={`w-full px-3 py-2 rounded-md border text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200 bg-white ${
                          fieldErrors.name ? "border-red-400 bg-red-50/30" : "border-slate-300"
                        }`}
                      />
                      {fieldErrors.name && (
                        <p className="text-[11px] text-red-500 mt-1">{fieldErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit Mobile"
                        required
                        value={formData.mobile}
                        onChange={(e) => {
                          setFormData({ ...formData, mobile: e.target.value });
                          if (fieldErrors.mobile) setFieldErrors({ ...fieldErrors, mobile: "" });
                        }}
                        className={`w-full px-3 py-2 rounded-md border text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200 bg-white ${
                          fieldErrors.mobile ? "border-red-400 bg-red-50/30" : "border-slate-300"
                        }`}
                      />
                      {fieldErrors.mobile && (
                        <p className="text-[11px] text-red-500 mt-1">{fieldErrors.mobile}</p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email Address */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                      }}
                      className={`w-full px-3 py-2 rounded-md border text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200 bg-white ${
                        fieldErrors.email ? "border-red-400 bg-red-50/30" : "border-slate-300"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-red-500 mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  {/* Row 3: Select Course Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Course Interested In
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200 bg-white"
                    >
                      <option value="">Select Course</option>
                      <option value="MS-CIT">MS-CIT</option>
                      <option value="Computer Typing (CCTP)">Computer Typing (CCTP)</option>
                      <option value="Tally Prime">Tally Prime</option>
                      <option value="Advanced Excel">Advanced Excel</option>
                      <option value="Graphic Designing">Graphic Designing</option>
                      <option value="Video Editing">Video Editing</option>
                      <option value="Data Analytics & Visualisation">Data Analytics & Visualisation</option>
                      <option value="Office Assistance">Office Assistance</option>
                      <option value="Soft Skills">Soft Skills</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Cyber Security">Cyber Security</option>
                    </select>
                  </div>

                  {/* Row 4: Message Textarea */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Message / Enquiry
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Write your query or question here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200 bg-white resize-none"
                    />
                  </div>

                  {/* Submit Enquiry Button with hover lift, arrow slide & click press */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex items-center justify-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#e52e2e] via-[#d92525] to-[#b91c1c] hover:from-[#d92525] hover:to-[#991b1b] disabled:bg-slate-400 disabled:cursor-not-allowed text-white text-sm font-bold tracking-wide transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-red-600/35 cursor-pointer transform hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Submitting your enquiry…
                      </>
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 3: Live Embedded Google Map Card (4 cols) */}
          <div className="lg:col-span-4">
            <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 h-[340px] sm:h-[380px] lg:h-full min-h-[340px]">
              
              {/* Google Map Header Badge */}
              <div className="absolute top-3 left-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg shadow-md border border-slate-200 z-10 flex items-center justify-between text-slate-800 pointer-events-auto">
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-slate-900 leading-tight truncate">
                    Amol Infotech & Maharana Typing Institute Risod
                  </div>
                  <div className="text-[10.5px] text-slate-500 truncate">
                    Civil Line Rd, Risod, 444506
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/place/Amol+Infotech+%26+Maharana+Typing+Institute+Risod/@19.9756173,76.7897233,17z/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 whitespace-nowrap bg-blue-50 px-2.5 py-1 rounded"
                >
                  Directions
                </a>
              </div>

              {/* Live Embedded Google Maps Iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.78321008008!2d76.78972327376363!3d19.975617323118453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd08ce2a7136c5d%3A0xab9d72db89f814e3!2sAmol%20Infotech%20%26%20Maharana%20Typing%20Institute%20Risod!5e0!3m2!1sen!2sin!4v1790933978021!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                title="Amol Infotech & Maharana Typing Institute Risod Location Map"
                className="w-full h-full"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
