import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  FaUsers,
  FaUtensils,
  FaGift,
  FaSearch,
  FaEdit,
  FaUserCircle,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* -----------------------------------------------------
   VIEW POPUP COMPONENT (MERGED)
----------------------------------------------------- */
const ViewPopup = ({ user, onClose }) => {
  if (!user) return null;
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-6xl w-full max-h-[95vh] overflow-y-auto animate-slideUp transform transition-all duration-300">
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Participant Details
            </h2>
            <p className="text-gray-600 mt-1 text-lg">
              View complete participant information
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 rounded-2xl cursor-pointer hover:bg-red-50 text-red-500 hover:text-red-600 transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col xl:flex-row gap-8 p-8">
          {/* Left Side - Profile Photo & Summary */}
          <div className="w-full xl:w-1/3 flex flex-col items-center">
            <div className="w-64 h-64 rounded-3xl overflow-hidden border-4 border-white shadow-2xl ring-4 ring-blue-100">
              <img
                src={`${user.userImage}?t=${Date.now()}`}
                className=" object-cover"
                alt="Profile"
              />
            </div>

            {/* Member ID Badge */}
            <div className="mt-8 w-full max-w-xs">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-purple-100">
                <h4 className="font-bold text-amber-800 text-lg mb-4 text-center">
                  Member Information
                </h4>
                <div className="space-y-4 text-center">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-black mb-3 font-semibold mb-1">
                      Member ID
                    </p>
                    <code className="text-lg font-mono font-bold text-purple-900 bg-white px-3 py-2 rounded-lg border border-purple-200">
                      {user.userId}
                    </code>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-black font-semibold mb-1">
                      Company ID
                    </p>
                    <p className="text-base font-semibold text-purple-900">
                      {user.companyId}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="mt-6 w-full max-w-xs">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border border-green-100">
                <h4 className="font-bold text-black text-lg mb-4 text-center">
                  Attendance Summary
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-black">Self:</span>
                    <span className="font-semibold text-black">
                      {user.self || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Adults:</span>
                    <span className="font-semibold text-black">
                      {user.adultcount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Children:</span>
                    <span className="font-semibold text-black">
                      {user.childrencount || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-black">Total:</span>
                    <span className="font-semibold text-black">
                      {(user.adultcount || 0) +
                        (user.childrencount || 0) +
                        (user.self || 0)}
                    </span>
                  </div>
                  <div className="border-t border-green-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-black">Vegetarian:</span>
                      <span className="font-semibold text-black">
                        {user.vegcount || 0}
                      </span>
                    </div>
                    <br />
                    <div className="flex justify-between">
                      <span className="text-black">Non-Veg:</span>
                      <span className="font-semibold text-black">
                        {user.nonvegcount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex-1">
            {/* Personal Information */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">👤</span>
                Personal Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  ["Full Name", user.name, "📝"],
                  ["Gender", user.gender, "⚥"],
                  ["Email", user.email, "📧"],
                  ["WhatsApp", user.whatsapp, "💬"],
                  ["Travel Mode", user.travelmode, "🚌"],
                  ["Pickup Location", user.pickuplocation, "📍"],
                  [
                    "Present",
                    user.isPresent ? "Yes" : "No",
                    user.isPresent ? "🟢" : "🔴",
                  ],

                  [
                    "Gift Received",
                    user.isGiftReceived ? "Yes" : "No",
                    user.isGiftReceived ? "🟢" : "🔴",
                  ],
                  [
                    "Lucky Draw Winner",
                    user.isPresent && user.isWinned ? "Yes" : "No",
                    user.isPresent && user.isWinned ? "🟢" : "🔴",
                  ],
                  [
                    "Registration Date",
                    formatDate(user.registrationDate),
                    "📅",
                  ],
                  [
                    "Last Updated",
                    user.updatedDate === user.registrationDate
                      ? "N/A"
                      : formatDate(user.updatedDate),
                    "⏱️",
                  ],
                ].map(([label, value, icon], i) => (
                  <div
                    key={i}
                    className="p-5 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-lg mr-2">{icon}</span>
                      <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
                        {label}
                      </p>
                    </div>
                    <p className="text-base font-medium text-gray-800">
                      {value || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="text-2xl mr-3">📊</span>
                Additional Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[
                  ["Vegetarian Count", user.vegcount, "🥗"],
                  ["Non-Veg Count", user.nonvegcount, "🍗"],
                  ["Self", user.self, "👥"],
                  ["Adult Count", user.adultcount],
                  ["Children Count", user.childrencount],
                ].map(([label, value, icon], i) => (
                  <div
                    key={i}
                    className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center mb-2">
                      <span className="text-md mr-2">{icon}</span>
                      <p className="text-sm uppercase tracking-wide text-gray-500 font-semibold">
                        {label}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      {value || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-8 py-3.5 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaEye className="w-4 h-4" />
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          0% { transform: translateY(30px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/* -----------------------------------------------------
   EDIT POPUP COMPONENT (MERGED)
----------------------------------------------------- */
const EditPopup = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState({
    Name: "",
    Member_ID: "",
    Age: "",
    Gender: "",
    Phone_Number: "",
    WhatsApp_Number: "",
    Email: "",
    Children_Count: "",
    Adult_Count: "",
    Non_Veg_Count: "",
    Veg_Count: "",
    Company_ID: "",
    Food: "",
    IsGiftReceived: false,
    Self: "",
    Travel_Mode: "",
    Pickup_Location: "",
    Coming: "No",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    setForm({
      Name: user.name || "",
      Member_ID: user.userId || "",
      Age: user.age || "",
      Gender: user.gender || "",
      WhatsApp_Number: user.whatsapp || "",
      Email: user.email || "",
      Children_Count: user.childrencount || "",
      Adult_Count: user.adultcount || "",
      Company_ID: user.companyId || "",
      Veg_Count: user.vegcount || "",
      Non_Veg_Count: user.nonvegcount || "",
      IsGiftReceived: user.isGiftReceived || false,
      Self: user.self || "",
      Travel_Mode: user.travelmode || "",
      Pickup_Location: user.pickuplocation || "",
      Coming: user.comingStatus || "No",
    });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const totalPeople =
      (Number(form.Self) || 0) +
      (Number(form.Adult_Count) || 0) +
      (Number(form.Children_Count) || 0);

    const totalFood =
      (Number(form.Veg_Count) || 0) + (Number(form.Non_Veg_Count) || 0);

    if (totalPeople !== totalFood) {
      setSaving(false);
      setError(
        `People count (${totalPeople}) must equal Food count (${totalFood}).`,
      );
      return;
    }

    if (form.Travel_Mode === "Company Bus" && !form.Pickup_Location.trim()) {
      setSaving(false);
      setError("Pickup Location is required when Travel Mode is Company Bus.");
      return;
    }
    // ⭐ Prevent gift received if user is not verified OR not present
    if (!user.IsVerified_Member || !user.isPresent) {
      if (form.IsGiftReceived === true) {
        setSaving(false);
        setError("User must be VERIFIED & PRESENT before receiving gift.");
        return;
      }
    }

    try {
      let uploadedPhoto = null;

      if (photoFile) {
        const fd = new FormData();
        fd.append("files", photoFile);

        const uploadRes = await axios.post(
          "https://api.regeve.in/api/upload",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } },
        );

        if (Array.isArray(uploadRes.data) && uploadRes.data.length > 0) {
          uploadedPhoto = uploadRes.data[0];
        }
      }

      const payload = {
        Name: form.Name,
        Member_ID: form.Member_ID,
        Age: Number(form.Age) || 0,
        Gender: form.Gender,
        WhatsApp_Number: form.WhatsApp_Number
          ? Number(form.WhatsApp_Number)
          : null,
        Email: form.Email,
        Children_Count: Number(form.Children_Count) || 0,
        Adult_Count: Number(form.Adult_Count) || 0,
        Veg_Count: Number(form.Veg_Count) || 0,
        Non_Veg_Count: Number(form.Non_Veg_Count) || 0,
        Company_ID: form.Company_ID,
        Food: form.Food,
        IsWinned: form.IsWinned,
        IsGiftReceived: form.IsGiftReceived === true ? true : false,
        Self: Number(form.Self) || 0,
        Travel_Mode: form.Travel_Mode,
        Pickup_Location: form.Pickup_Location,
        coming_to_family_day: form.Coming,
      };

      if (uploadedPhoto) payload.Photo = uploadedPhoto.id;

      await axios.put(
        `https://api.regeve.in/api/event-management-form/${user.documentId}`,
        {
          data: payload,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        },
      );

      setSaving(false);
      onSaved({
        updated: {
          ...user,

          // BASIC FIELDS
          name: form.Name,
          age: Number(form.Age) || 0,
          gender: form.Gender,
          email: form.Email,
          whatsapp: form.WhatsApp_Number,
          companyId: form.Company_ID,

          // TRAVEL
          pickuplocation: form.Pickup_Location,
          travelmode: form.Travel_Mode,

          // FOOD & COUNTS (convert to numbers!)
          self: Number(form.Self) || 0,
          adultcount: Number(form.Adult_Count) || 0,
          childrencount: Number(form.Children_Count) || 0,
          vegcount: Number(form.Veg_Count) || 0,
          nonvegcount: Number(form.Non_Veg_Count) || 0,

          // BOOLEAN FIELDS
          isGiftReceived: form.IsGiftReceived,
          isPresent: user.isPresent,
          IsVerified_Member: user.IsVerified_Member,

          // IMAGE
          userImage: photoFile
            ? URL.createObjectURL(photoFile)
            : user.userImage,

          // TIMESTAMPS — keep old ones so dashboard doesn’t break
          registrationDate: user.registrationDate,
          updatedDate: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Update error:", err);
      setSaving(false);
      setError(
        "Failed to update participant. Please check all required fields and try again.",
      );
    }
  };

  if (!user) return null;

  /* ----------------------------------------- */
  /* ----------- UI RETURN BELOW ------------- */
  /* ----------------------------------------- */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      {/* BG overlay */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 max-w-6xl w-full max-h-[95vh] overflow-y-auto animate-slideUp">
        {/* HEADER */}
        <div className="sticky top-0 flex justify-between items-center px-8 py-6 bg-gradient-to-r from-green-100 to-green-50 border-b border-gray-200 rounded-t-3xl">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Edit Participant
            </h2>
            <p className="text-gray-600 mt-1 text-lg">
              Update participant information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-full hover:bg-red-100 text-red-600 transition-all duration-200"
          >
            <FaTimes size={26} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col xl:flex-row gap-10 p-8">
          {/* LEFT SIDE */}
          <div className="w-full xl:w-1/3 flex flex-col items-center">
            {/* Profile Photo */}
            <div className="w-60 h-60 rounded-3xl overflow-hidden shadow-xl ring-4 ring-green-200 border border-gray-100">
              <img
                src={
                  photoFile
                    ? URL.createObjectURL(photoFile)
                    : `${user.userImage}?t=${Date.now()}`
                }
                alt="Profile"
                className="object-cover"
              />
            </div>

            {/* Photo Upload */}
            <div className="mt-8 w-full max-w-xs">
              <label className="block text-lg font-semibold text-gray-700 mb-3 text-center">
                Update Profile Photo
              </label>

              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />

                <div className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold rounded-2xl shadow-lg">
                  Choose New Photo
                </div>
              </label>

              {photoFile && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
                  <p className="text-green-700 text-center font-medium">
                    Selected: <b>{photoFile.name}</b>
                  </p>
                </div>
              )}
            </div>

            {/* Gift Switch */}
            <div className="mt-6 flex items-center justify-between w-full max-w-xs bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                🎁 Gift Received
              </span>

              <label
                className={`flex items-center ${
                  !user.isPresent || !user.IsVerified_Member
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.IsGiftReceived}
                  disabled={!user.isPresent || !user.IsVerified_Member} // ⭐ RESTRICTION
                  onChange={(e) =>
                    setForm((p) => ({ ...p, IsGiftReceived: e.target.checked }))
                  }
                  className="hidden"
                />

                <div
                  className={`w-14 h-7 rounded-full flex items-center p-1 transition ${
                    form.IsGiftReceived ? "bg-green-500" : "bg-gray-300"
                  } ${
                    !user.isPresent || !user.IsVerified_Member
                      ? "opacity-60"
                      : ""
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
                      form.IsGiftReceived ? "translate-x-7" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>

            {(!user.isPresent || !user.IsVerified_Member) && (
              <p className="text-xs text-red-600 mt-2 text-center">
                User must be PRESENT & VERIFIED to receive gift.
              </p>
            )}
            {/* Join (Coming to Family Day) Toggle */}
            <div className="mt-6 flex items-center justify-between w-full max-w-xs bg-white border border-gray-200 p-4 rounded-2xl shadow-sm">
              <span className="text-gray-700 font-semibold flex items-center">
                ✔️ Present At Event Day
              </span>

              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.Coming === "Yes"}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      Coming: e.target.checked ? "Yes" : "No",
                    }))
                  }
                  className="hidden"
                />

                <div
                  className={`w-14 h-7 rounded-full flex items-center p-1 transition ${
                    form.Coming === "Yes" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
                      form.Coming === "Yes" ? "translate-x-7" : "translate-x-0"
                    }`}
                  ></div>
                </div>
              </label>
            </div>
          </div>

          {/* RIGHT SIDE FORM */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                ["Full Name", "Name", "text", "👤", true],
                ["Member ID", "Member_ID", "text", "🆔", true],
                ["WhatsApp Number", "WhatsApp_Number", "tel", "💬"],
                ["Email Address", "Email", "email", "📧"],
                ["Company ID", "Company_ID", "text", "🏢", true],
                ["Gender", "Gender", "select", "⚥"],
                ["Travel Mode", "Travel_Mode", "select", "🚌"],

                ...(form.Travel_Mode === "Company Bus"
                  ? [["Pickup Location", "Pickup_Location", "text", "📍"]]
                  : []),

                ["Employee Count", "Self", "text", "👥", true],
                ["Adult Count", "Adult_Count", "number"],
                ["Children Count", "Children_Count", "number"],
                ["Veg Count", "Veg_Count", "number", "🥗"],
                ["Non-Veg Count", "Non_Veg_Count", "number", "🍗"],
              ].map(([label, field, type, icon, readOnly]) => (
                <div key={field}>
                  <label className="flex items-center text-sm font-semibold mb-2 text-gray-700">
                    <span className="mr-2 text-lg">{icon}</span>
                    {label}
                  </label>

                  {field === "Gender" ? (
                    <SelectBox
                      name="Gender"
                      value={form.Gender}
                      onChange={handleChange}
                      options={["Male", "Female", "Others"]}
                    />
                  ) : field === "Travel_Mode" ? (
                    <SelectBox
                      name="Travel_Mode"
                      value={form.Travel_Mode}
                      onChange={handleChange}
                      options={["Self", "Company Bus"]}
                    />
                  ) : (
                    <input
                      type={type}
                      name={field}
                      disabled={readOnly}
                      value={form[field]}
                      onChange={readOnly ? undefined : handleChange}
                      className={`w-full px-4 py-3.5 rounded-2xl border-2 shadow-sm transition ${
                        readOnly
                          ? "bg-gray-100 border-gray-300 cursor-not-allowed"
                          : "border-gray-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-500"
                      }`}
                      placeholder={`Enter ${label}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="mt-10 flex justify-end gap-4 border-t pt-6">
              <button
                onClick={onClose}
                disabled={saving}
                className="px-8 py-3.5 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-2xl shadow-md transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FaEdit />
                )}
                {saving ? "Updating..." : "Update Participant"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
        .animate-slideUp { animation: slideUp 0.35s ease-out; }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

/* SMALL COMPONENTS */
const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-purple-700">{label}:</span>
    <span className="font-semibold text-purple-900">{value || 0}</span>
  </div>
);

const SelectBox = ({ name, value, onChange, options }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    className="w-full border-2 border-gray-200 px-4 py-3.5 rounded-2xl shadow-sm bg-white focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition"
  >
    <option value="">Select {name.replace("_", " ")}</option>
    {options.map((v) => (
      <option key={v} value={v}>
        {v}
      </option>
    ))}
  </select>
);

// Dashboard.jsx

const Dashboard = () => {
  // ----------------------------- STATES -----------------------------
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalRegisteredUsers: 0,
    totalAdminverfied: 0,
    totalAttendees: 0,
    totalAdults: 0,
    totalChildren: 0,
    totalSelf: 0,
    totalVeg: 0,
    totalNonVeg: 0,
    totalGifts: 0,
    verifiedNotPresentVeg: 0,
    verifiedNotPresentNonVeg: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const { adminId, documentId } = useParams();

  const [showCopyToast, setShowCopyToast] = useState(false);

  const usersPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("jwt");
        localStorage.removeItem("userProfile");
        navigate("/");
      }
    } catch (err) {
      localStorage.clear();
      navigate("/");
    }
  }, [navigate]);

  const copyParticipantLink = () => {
    const url = `${window.location.origin}/${adminId}/event-form/${documentId}`;
    navigator.clipboard.writeText(url);

    // Trigger animation
    setShowCopyToast(true);

    // Auto-hide after 3 seconds
    setTimeout(() => setShowCopyToast(false), 3000);
  };

  const copyLuckyDrawLink = () => {
    const url = `${window.location.origin}/${adminId}/event-luckydraw/${documentId}`;
    navigator.clipboard.writeText(url);

    setShowCopyToast(true);

    setTimeout(() => setShowCopyToast(false), 3000);
  };

  // ----------------------------- FETCH API -----------------------------
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `https://api.regeve.in/api/event-management-name/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = response.data?.data?.event_management_forms || [];

      const formatted = data.map((item) => ({
        id: item.id,
        name: item.Name,
        documentId: item.documentId,
        userId: item.Member_ID,
        userImage: item.Photo?.url
          ? `https://api.regeve.in${item.Photo.url}`
          : "https://via.placeholder.com/150?text=No+Image",
        age: item.Age,
        gender: item.Gender,
        phone: item.Phone_Number,
        whatsapp: item.WhatsApp_Number,
        email: item.Email,
        companyId: item.Company_ID,
        pickuplocation: item.Pickup_Location,
        travelmode: item.Travel_Mode,
        self: item.Self,
        adultcount: Number(item.Adult_Count) || 0,
        childrencount: Number(item.Children_Count) || 0,
        vegcount: Number(item.Veg_Count) || 0,
        nonvegcount: Number(item.Non_Veg_Count) || 0,
        isPresent: item.IsPresent === true,
        isWinned: item.IsWinned === true,
        IsVerified_Member: item.Is_Verified_Member === true,
        comingStatus: item.coming_to_family_day || null,
        isGiftReceived:
          item.IsGiftReceived === true ||
          item.IsGiftReceived === 1 ||
          item.IsGiftReceived === "true",
        registrationDate: item.createdAt,
        updatedDate: item.updatedAt,
        checkInTime: item.CheckIn_Time || null, // safe (if doesn't exist)

        raw: item,
      }));

      setUsers(formatted);

      // -----------------------------
      // TOTAL REGISTERED USERS
      // -----------------------------
      const totalRegisteredUsers = formatted.length;

      // ONLY VERIFIED USERS ARE COUNTED AS REGISTERED
      const totalAdminverfied = formatted.filter(
        (u) => u.IsVerified_Member === true,
      ).length;

      // -----------------------------
      // PRESENT USERS ONLY
      // -----------------------------
      const presentUsers = formatted.filter((u) => u.isPresent);

      // VERIFIED BUT NOT PRESENT (THIS WAS MISSING)
      const verifiedNotPresent = formatted.filter(
        (u) => u.IsVerified_Member === true && u.isPresent === false,
      );

      // FOOD COUNTS FOR VERIFIED NOT PRESENT
      const verifiedNotPresentVeg = verifiedNotPresent.reduce(
        (sum, u) => sum + u.vegcount,
        0,
      );

      const verifiedNotPresentNonVeg = verifiedNotPresent.reduce(
        (sum, u) => sum + u.nonvegcount,
        0,
      );

      const totalSelf = presentUsers.reduce((sum, u) => sum + (u.self || 0), 0);

      // -----------------------------
      // GIFTS
      // -----------------------------
      const totalGifts = presentUsers.filter(
        (u) => u.isGiftReceived === true,
      ).length;

      // -----------------------------
      // TOTAL ATTENDEES (PRESENT USERS)
      // -----------------------------
      const totalAttendees = presentUsers.length;

      // -----------------------------
      // HEAD COUNTS
      // -----------------------------
      const totalAdults = presentUsers.reduce(
        (sum, u) => sum + u.adultcount,
        0,
      );
      const totalChildren = presentUsers.reduce(
        (sum, u) => sum + u.childrencount,
        0,
      );
      const totalVeg = presentUsers.reduce((sum, u) => sum + u.vegcount, 0);
      const totalNonVeg = presentUsers.reduce(
        (sum, u) => sum + u.nonvegcount,
        0,
      );

      setDashboardData({
        totalRegisteredUsers,
        totalAdminverfied,
        totalAttendees,
        totalAdults,
        totalChildren,
        totalSelf,
        totalVeg,
        totalNonVeg,
        totalGifts,
        verifiedNotPresentVeg,
        verifiedNotPresentNonVeg,
      });
    } catch (err) {
      console.log("API Error:", err);
    }
  };

  const handleVerificationToggle = async (documentId, newStatus) => {
    try {
      // update UI instantly
      setUsers((prev) =>
        prev.map((u) =>
          u.documentId === documentId
            ? { ...u, IsVerified_Member: newStatus }
            : u,
        ),
      );

      // send correct body structure expected by backend
      await axios.put(
        `https://api.regeve.in/api/event-management-form/${documentId}`,
        {
          data: {
            Is_Verified_Member: newStatus,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Updated verified:", documentId);
    } catch (error) {
      console.error("Verification failed:", error);

      // rollback
      setUsers((prev) =>
        prev.map((u) =>
          u.documentId === documentId
            ? { ...u, IsVerified_Member: !newStatus }
            : u,
        ),
      );
    }
  };

  const handleJoinToggle = async (memberId, newStatus) => {
    try {
      // Update UI instantly
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === memberId ? { ...u, comingStatus: newStatus } : u,
        ),
      );

      // Update Strapi
      await axios.put(
        `https://api.regeve.in/api/event-management-form/${memberId}`,
        {
          data: {
            coming_to_family_day: newStatus,
          },
        },
      );

      console.log("Join status updated for:", memberId);
    } catch (err) {
      console.error("Join toggle failed:", err);

      // Rollback UI if failed
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === memberId
            ? { ...u, comingStatus: newStatus === "Yes" ? "No" : "Yes" }
            : u,
        ),
      );
    }
  };

  const refreshStatsOnly = async () => {
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `https://api.regeve.in/api/event-management-name/${documentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data?.data?.event_management_forms || [];
      const formatted = data.map((item) => ({
        adultcount: Number(item.Adult_Count) || 0,
        childrencount: Number(item.Children_Count) || 0,
        vegcount: Number(item.Veg_Count) || 0,
        nonvegcount: Number(item.Non_Veg_Count) || 0,
        isPresent: item.IsPresent === true,
        isGiftReceived:
          item.IsGiftReceived === true ||
          item.IsGiftReceived === 1 ||
          item.IsGiftReceived === "true",
        IsVerified_Member: item.Is_Verified_Member === true,
        self: Number(item.Self) || 1,
      }));

      const totalAdminverfied = formatted.filter(
        (u) => u.IsVerified_Member === true,
      ).length;

      const presentUsers = formatted.filter((u) => u.isPresent);
      const totalSelf = presentUsers.reduce((sum, u) => sum + (u.self || 0), 0);

      const verifiedNotPresent = formatted.filter(
        (u) => u.IsVerified_Member === true,
      );

      const verifiedNotPresentVeg = verifiedNotPresent.reduce(
        (sum, u) => sum + u.vegcount,
        0,
      );

      const verifiedNotPresentNonVeg = verifiedNotPresent.reduce(
        (sum, u) => sum + u.nonvegcount,
        0,
      );

      const totalGifts = presentUsers.filter(
        (u) => u.isGiftReceived === true,
      ).length;

      const totalAttendees = presentUsers.length;

      const totalAdults = presentUsers.reduce(
        (sum, u) => sum + u.adultcount,
        0,
      );

      const totalChildren = presentUsers.reduce(
        (sum, u) => sum + u.childrencount,
        0,
      );

      const totalVeg = presentUsers.reduce((sum, u) => sum + u.vegcount, 0);
      const totalNonVeg = presentUsers.reduce(
        (sum, u) => sum + u.nonvegcount,
        0,
      );

      setDashboardData((prev) => ({
        ...prev,
        totalSelf,
        totalAdminverfied,
        totalAttendees,
        totalAdults,
        totalChildren,
        totalVeg,
        totalNonVeg,
        totalGifts,
        verifiedNotPresentVeg,
        verifiedNotPresentNonVeg,
      }));
    } catch (err) {
      console.log("Stats Refresh Error:", err);
    }
  };

  useEffect(() => {
    fetchData(); // initial load

    const interval = setInterval(() => {
      refreshStatsOnly();
    }, 1000); // every 1 minute

    return () => clearInterval(interval);
  }, []);

  // ----------------------------- FILTERS + PAGINATION -----------------------------
  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.companyId?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // ----------------------------- ACTION HANDLERS -----------------------------
  const handleView = (user) => {
    // Receive the formatted user object (with .raw)
    setViewUser(user);
  };

  const handleEdit = (user) => {
    setEditUser(user);
    fetchData();
  };

  // Called by EditPopup on successful save
  const handleAfterEdit = ({ updated }) => {
    setEditUser(null);

    setUsers((prev) =>
      prev.map((u) => (u.documentId === updated.documentId ? updated : u)),
    );
    setTimeout(() => {
      fetchData(); // <-- THIS FIXES THE DASHBOARD STATS
    }, 300);
  };

  const handleCloseView = () => {
    setViewUser(null);
  };

  const handleCloseEdit = () => {
    setEditUser(null);
  };

  // ----------------------------- EXPORT HANDLERS (FRONTEND) -----------------------------
  const exportToExcel = (data, filename, sheetName = "Sheet1") => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  const handleExportVerified = () => {
    const verifiedUsers = users.filter((u) => u.IsVerified_Member);
    const exportData = verifiedUsers.map((u) => ({
      "Name": u.name,
      "Member ID": u.userId,
      "Company ID": u.companyId,
      "Gender": u.gender,
      "Email": u.email,
      "WhatsApp": u.whatsapp,
      "Travel Mode": u.travelmode,
      "Pickup Location": u.pickuplocation,
      "Self": u.self,
      "Adults": u.adultcount,
      "Children": u.childrencount,
      "Veg": u.vegcount,
      "Non-Veg": u.nonvegcount,
      "Verified": u.IsVerified_Member ? "Yes" : "No",
      "Present": u.isPresent ? "Yes" : "No",
      "Gift Received": u.isGiftReceived ? "Yes" : "No",
      "Coming Status": u.comingStatus || "N/A",
      "Registration Date": new Date(u.registrationDate).toLocaleString(),
    }));
    exportToExcel(exportData, "verified-users.xlsx", "Verified Users");
  };

  const handleExportPresent = () => {
    const presentUsers = users.filter((u) => u.isPresent);
    const exportData = presentUsers.map((u) => ({
      "Name": u.name,
      "Member ID": u.userId,
      "Company ID": u.companyId,
      "Gender": u.gender,
      "Email": u.email,
      "WhatsApp": u.whatsapp,
      "Travel Mode": u.travelmode,
      "Pickup Location": u.pickuplocation,
      "Self": u.self,
      "Adults": u.adultcount,
      "Children": u.childrencount,
      "Veg": u.vegcount,
      "Non-Veg": u.nonvegcount,
      "Verified": u.IsVerified_Member ? "Yes" : "No",
      "Present": u.isPresent ? "Yes" : "No",
      "Gift Received": u.isGiftReceived ? "Yes" : "No",
      "Coming Status": u.comingStatus || "N/A",
      "Registration Date": new Date(u.registrationDate).toLocaleString(),
      "Winned Lucky Draw": u.isWinned ? "Yes" : "No",
    }));
    exportToExcel(exportData, "present-users.xlsx", "Present Users");
  };

  const handleExportNotJoining = () => {
    const notJoiningUsers = users.filter((u) => u.comingStatus === "No");
    const exportData = notJoiningUsers.map((u) => ({
      "Name": u.name,
      "Member ID": u.userId,
      "Company ID": u.companyId,
      "Gender": u.gender,
      "Email": u.email,
      "WhatsApp": u.whatsapp,
      "Travel Mode": u.travelmode,
      "Pickup Location": u.pickuplocation,
      "Self": u.self,
      "Adults": u.adultcount,
      "Children": u.childrencount,
      "Veg": u.vegcount,
      "Non-Veg": u.nonvegcount,
      "Verified": u.IsVerified_Member ? "Yes" : "No",
      "Present": u.isPresent ? "Yes" : "No",
      "Gift Received": u.isGiftReceived ? "Yes" : "No",
      "Coming Status": u.comingStatus || "N/A",
      "Registration Date": new Date(u.registrationDate).toLocaleString(),
    }));
    exportToExcel(exportData, "notjoining-users.xlsx", "Not Joining");
  };

  // ----------------------------- UI BELOW -----------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* View & Edit Popups */}
      {viewUser && (
        <ViewPopup user={viewUser} onClose={() => setViewUser(null)} />
      )}
      {editUser && (
        <EditPopup
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={handleAfterEdit}
        />
      )}

      {/* ---------------- HEADER SECTION ---------------- */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Header Text */}
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Event Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Real-time overview of event metrics
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-10">
            {/* Participant Form Button */}
            <button
              onClick={copyParticipantLink}
              className="bg-white cursor-pointer text-blue-600 hover:bg-blue-50 px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 border border-blue-200 font-medium text-sm"
            >
              Participant Form Copy Link
            </button>

            {/* Lucky Draw Button */}
            <button
              onClick={copyLuckyDrawLink}
              className="bg-white cursor-pointer text-cyan-600 hover:bg-cyan-50 px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 border border-cyan-200 font-medium text-sm"
            >
              Lucky Draw
            </button>

            {/* Go Home Button */}
            <button
              onClick={() => navigate(`/${adminId}/event-home`)}
              className="bg-gradient-to-br from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white px-5 py-2.5 rounded-lg shadow-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 font-medium text-sm border border-blue-500"
            >
              ← Go Back
            </button>
          </div>

          {/* --- COPY TOAST NOTIFICATION --- */}
          <div
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform 
    ${showCopyToast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
          >
            <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700">
              <div className="bg-green-500 p-1 rounded-full">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="3"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span className="font-medium">Link copied to clipboard!</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- STATS CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 mb-8 overflow-visible">
        {/* 1. TOTAL REGISTERED USERS */}
        <div className="bg-white cursor-pointer rounded-2xl p-6 shadow-md border border-gray-200 border-t-4 border-t-blue-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-2xl" />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {dashboardData.totalAdminverfied}
              </h3>
              <p className="text-gray-700 font-bold text-base mt-2">
                Admin Verified Users
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleExportVerified}
              className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all text-sm font-bold uppercase tracking-wider"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export List
            </button>
          </div>
        </div>

        {/* 2. VERIFIED NOT PRESENT - FOOD COUNT */}
        <div className="bg-white cursor-pointer rounded-2xl p-6 shadow-md border border-gray-200 border-t-4 border-t-orange-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-orange-100 text-orange-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FaUtensils className="text-2xl" />
              </div>
              <span className="flex items-center text-xs font-bold text-orange-700 bg-orange-100 px-3 py-1.5 rounded-full border border-orange-200 shadow-sm">
                <span className="w-2 h-2 bg-orange-600 rounded-full mr-2 animate-pulse"></span>
                Not Present
              </span>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {dashboardData.verifiedNotPresentVeg +
                  dashboardData.verifiedNotPresentNonVeg}
              </h3>
              <p className="text-gray-700 font-bold text-base mt-2">
                Food Count Est.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-green-50 rounded-xl p-3 border border-green-200 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl mb-1 drop-shadow-sm">🥗</span>
              <p className="text-xl font-black text-green-800">
                {dashboardData.verifiedNotPresentVeg}
              </p>
              <p className="text-xs text-green-700 font-extrabold uppercase mt-1">
                Veg
              </p>
            </div>
            <div className="bg-red-50 rounded-xl p-3 border border-red-200 flex flex-col items-center justify-center shadow-sm">
              <span className="text-2xl mb-1 drop-shadow-sm">🍗</span>
              <p className="text-xl font-black text-red-800">
                {dashboardData.verifiedNotPresentNonVeg}
              </p>
              <p className="text-xs text-red-700 font-extrabold uppercase mt-1">
                Non-Veg
              </p>
            </div>
          </div>
        </div>

        {/* 3. TOTAL ATTENDEES WITH CIRCLE PROGRESS */}
        <div className="bg-white cursor-pointer rounded-2xl p-6 shadow-md border border-gray-200 border-t-4 border-t-indigo-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <FaUsers className="text-2xl" />
            </div>

            <div className="relative flex items-center justify-center w-16 h-16 shrink-0 bg-gray-50 rounded-full shadow-inner">
              <svg
                className="w-14 h-14 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="4"
                />
                <path
                  d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${
                    dashboardData.totalAdminverfied === 0
                      ? 0
                      : (dashboardData.totalAttendees /
                          dashboardData.totalAdminverfied) *
                        100
                  }, 100`}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-xs font-black text-indigo-800">
                {dashboardData.totalAdminverfied === 0
                  ? 0
                  : (
                      (dashboardData.totalAttendees /
                        dashboardData.totalAdminverfied) *
                      100
                    ).toFixed(0)}
                %
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {dashboardData.totalAttendees}
            </h3>
            <p className="text-gray-700 font-bold text-base mt-2">
              Total Attendees
            </p>
            <p className="text-sm text-gray-500 font-semibold mt-1">
              Capacity: {dashboardData.totalAttendees} /{" "}
              {dashboardData.totalAdminverfied}
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleExportPresent}
              className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 hover:shadow-lg transition-all text-sm font-bold uppercase tracking-wider"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export Present
            </button>
          </div>
        </div>

        {/* 4. FOOD DISTRIBUTION */}
        <div className="bg-white cursor-pointer rounded-2xl p-6 shadow-md border border-gray-200 border-t-4 border-t-emerald-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FaUtensils className="text-2xl" />
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {dashboardData.totalAdults +
                  dashboardData.totalChildren +
                  dashboardData.totalSelf}
              </h3>
              <p className="text-gray-700 font-bold text-base mt-2">
                Food Distributed
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex-1 flex flex-col items-center justify-center border-r border-gray-300 pr-4">
              <span className="text-2xl mb-1 drop-shadow-sm">🥗</span>
              <p className="text-2xl font-black text-gray-900 leading-tight">
                {dashboardData.totalVeg}
              </p>
              <p className="text-xs text-green-700 font-extrabold uppercase mt-1">
                Veg
              </p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center pl-2">
              <span className="text-2xl mb-1 drop-shadow-sm">🍗</span>
              <p className="text-2xl font-black text-gray-900 leading-tight">
                {dashboardData.totalNonVeg}
              </p>
              <p className="text-xs text-red-700 font-extrabold uppercase mt-1">
                Non-Veg
              </p>
            </div>
          </div>
        </div>

        {/* 5. GIFTS */}
        <div className="bg-white cursor-pointer rounded-2xl p-6 shadow-md border border-gray-200 border-t-4 border-t-purple-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <FaGift className="text-2xl" />
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-purple-800 bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 shadow-sm">
                  {dashboardData.totalAttendees === 0
                    ? "0%"
                    : (
                        (dashboardData.totalGifts /
                          dashboardData.totalAttendees) *
                        100
                      ).toFixed(1) + "%"}
                </span>
                <p className="text-[10px] text-gray-500 font-bold uppercase mt-2 tracking-wider">
                  Completion
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                {dashboardData.totalGifts}
              </h3>
              <p className="text-gray-700 font-bold text-base mt-2">
                Gifts Distributed
              </p>
            </div>
          </div>

          <div className="space-y-5 mt-6">
            {/* Delivered */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-800 font-bold flex items-center">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-2 shadow-sm"></span>
                  Delivered
                </span>
                <span className="text-gray-900 font-black text-base">
                  {dashboardData.totalGifts}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 shadow-sm"
                  style={{
                    width: `${
                      dashboardData.totalAttendees === 0
                        ? 0
                        : (dashboardData.totalGifts /
                            dashboardData.totalAttendees) *
                          100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Pending */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-800 font-bold flex items-center">
                  <span className="w-2.5 h-2.5 bg-orange-400 rounded-full mr-2 shadow-sm"></span>
                  Pending
                </span>
                <span className="text-gray-900 font-black text-base">
                  {dashboardData.totalAttendees - dashboardData.totalGifts}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 shadow-inner">
                <div
                  className="bg-orange-400 h-2.5 rounded-full transition-all duration-1000 shadow-sm"
                  style={{
                    width: `${
                      dashboardData.totalAttendees === 0
                        ? 0
                        : ((dashboardData.totalAttendees -
                            dashboardData.totalGifts) /
                            dashboardData.totalAttendees) *
                          100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ---------------- USERS TABLE ---------------- */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div className="mb-6 lg:mb-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Participant Management ({dashboardData.totalRegisteredUsers})
              </h2>
              <p className="text-gray-500 mt-2 text-lg">
                Manage and track all event participants in real-time
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-lg" />
              </div>
              <input
                type="text"
                placeholder="Search by name or member ID..."
                className="pl-12 pr-6 py-3.5 w-96 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition-all duration-200 text-lg"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200">
                    <th className="px-8 py-6 text-left">
                      <span className="text-base font-semibold text-gray-700 uppercase tracking-wider">
                        S.No
                      </span>
                    </th>
                    <th className="px-8 py-6 text-left">
                      <span className="text-base font-semibold text-gray-700 uppercase tracking-wider">
                        User Details
                      </span>
                    </th>
                    <th className="px-8 py-6 text-left">
                      <span className="text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Member ID
                      </span>
                    </th>
                    <th className="px-8 py-6 text-center">
                      <span className="text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Verified
                      </span>
                    </th>
                    <th className="px-8 py-6 text-center">
                      <div className="flex flex-col items-center">
                        {/* Column Title */}
                        <span className="text-base font-semibold text-gray-700 uppercase tracking-wider">
                          Join
                        </span>
                        <button
                          onClick={handleExportNotJoining}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition text-xs font-semibold cursor-pointer"
                        >
                          📄 Export
                        </button>
                      </div>
                    </th>

                    <th className="px-8 py-6 text-center">
                      <span className="text-base font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user, index) => (
                      <tr
                        key={user.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 group"
                      >
                        {/* Serial Number */}
                        <td className="px-8 py-6">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-white">
                                {indexOfFirst + index + 1}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* User Details */}
                        <td className="px-8 py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
                              <img
                                src={`${user.userImage}?t=${Date.now()}`}
                                alt={user.name}
                                className="w-full h-full rounded-lg"
                              />
                            </div>

                            <div>
                              <p className="text-lg font-semibold text-gray-900 mb-1">
                                {user.name}
                              </p>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Registered
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Member ID */}
                        <td className="px-8 py-6">
                          <code className="text-base font-mono font-bold bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 text-gray-800">
                            {user.userId}
                          </code>
                        </td>

                        {/* Verified Checkbox */}
                        <td className="px-8 py-6">
                          <div className="flex justify-center">
                            <label className="inline-flex items-center cursor-pointer">
                              {/* CHECKBOX (Uses Member_ID here!) */}
                              <input
                                type="checkbox"
                                checked={user.IsVerified_Member || false}
                                onChange={(e) =>
                                  handleVerificationToggle(
                                    user.documentId,
                                    e.target.checked,
                                  )
                                }
                                className="hidden"
                              />

                              {/* Toggle UI */}
                              <div
                                className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-all duration-300 ${
                                  user.IsVerified_Member
                                    ? "bg-green-500"
                                    : "bg-gray-300"
                                }`}
                              >
                                <div
                                  className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                                    user.IsVerified_Member
                                      ? "translate-x-7"
                                      : "translate-x-0"
                                  }`}
                                />
                              </div>

                              <span
                                className={`ml-3 text-sm font-medium ${
                                  user.IsVerified_Member
                                    ? "text-green-600"
                                    : "text-gray-500"
                                }`}
                              >
                                {user.IsVerified_Member
                                  ? "Verified"
                                  : "Unverified"}
                              </span>
                            </label>
                          </div>
                        </td>
                        {/* Coming to Family Day */}
                        <td className="px-6 py-6 text-center">
                          {user.comingStatus === "Yes" ? (
                            <span className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-xl text-sm">
                              Yes
                            </span>
                          ) : user.comingStatus === "No" ? (
                            <span className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-xl text-sm">
                              No
                            </span>
                          ) : (
                            <span className="px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm">
                              -
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-8 py-6">
                          <div className="flex justify-center space-x-3">
                            {/* VIEW */}
                            <button
                              onClick={() => handleView(user)}
                              className="inline-flex items-center cursor-pointer px-4 py-3 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                              title="View"
                            >
                              <FaEye className="w-5 h-5 mr-2 text-gray-500" />
                              View
                            </button>

                            {/* EDIT */}
                            <button
                              onClick={() => handleEdit(user)}
                              className="inline-flex cursor-pointer items-center px-6 py-3 border-2 border-transparent rounded-xl text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              <FaEdit className="w-5 h-5 mr-3" />
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
                          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                            <FaUserCircle className="text-gray-400 text-5xl" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            No Participants Found
                          </h3>
                          <p className="text-gray-500 text-lg mb-6">
                            No users matched your search criteria.
                          </p>
                          <button
                            onClick={() => setSearchTerm("")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors duration-200"
                          >
                            Clear Search
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination - Modern Style */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
          <div className="text-gray-600 text-lg">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {indexOfFirst + 1}-{Math.min(indexOfLast, filteredUsers.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {filteredUsers.length}
            </span>{" "}
            participants
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page =
                  currentPage <= 3
                    ? i + 1
                    : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 rounded-xl text-base font-semibold transition-all duration-200 ${
                      currentPage === page
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 border-2 border-gray-300 rounded-xl text-base font-semibold text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              Next
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;