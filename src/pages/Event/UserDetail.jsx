import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import {
  FaShareAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaUtensils,
  FaUsers,
  FaChild,
  FaBuilding,
  FaWhatsapp,
  FaEdit,
  FaSave,
  FaTimes,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaExclamationTriangle,
  FaCamera,
  FaBus,
  FaCheckCircle,
} from "react-icons/fa";

// --- Count Input Card Component ---
const CountInputCard = ({
  icon: Icon,
  label,
  value,
  isEditing,
  onFieldChange,
  iconColor,
  iconBgColor,
  min,
  max,
  error = false,
  className = "",
}) => (
  <div
    className={`p-5 rounded-2xl transition-all duration-300 bg-white border ${
      error
        ? "border-red-300 shadow-[0_0_10px_rgba(239,68,68,0.1)]"
        : "border-gray-100 shadow-sm hover:shadow-md"
    } flex flex-col items-center text-center ${className}`}
  >
    <div
      className={`w-12 h-12 flex items-center justify-center rounded-xl ${iconBgColor} flex-shrink-0 mb-3`}
    >
      <Icon className={`text-2xl ${iconColor}`} />
    </div>
    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
      {label}
    </div>
    {isEditing ? (
      <div className="w-full">
        <input
          type="number"
          value={value || 0}
          onChange={(e) => onFieldChange(e.target.value)}
          className={`w-full text-2xl font-bold px-3 py-2 border-2 rounded-xl text-center transition-all bg-gray-50 focus:bg-white outline-none ${
            error
              ? "border-red-400 text-red-700 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              : "border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-gray-800"
          }`}
          min={min}
          max={max}
        />
      </div>
    ) : (
      <div
        className={`text-3xl font-black ${
          error ? "text-red-600" : "text-gray-800"
        }`}
      >
        {value || 0}
      </div>
    )}
  </div>
);

// --- Enhanced Contact Detail Item ---
const ContactDetailItem = ({
  icon: Icon,
  label,
  value,
  onClick,
  buttonText,
  iconColor = "text-indigo-600",
  iconBgColor = "bg-indigo-50",
  isEditing = false,
  fieldName = "",
  onFieldChange = () => {},
  type = "text",
  placeholder = "",
  validation = null,
  actionDisabled = false,
}) => {
  const [validationError, setValidationError] = useState("");

  const handleChange = (newValue) => {
    if (validation) {
      const result = validation(newValue);
      setValidationError(result.isValid ? "" : result.message);
    }
    onFieldChange(fieldName, newValue);
  };

  return (
    <div className="flex items-start py-4 border-b border-gray-50 last:border-0">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 ${iconBgColor}`}
      >
        <Icon className={`text-lg ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
          {label}
        </div>
        {isEditing ? (
          <div className="mt-1">
            <input
              type={type}
              value={value || ""}
              onChange={(e) => handleChange(e.target.value)}
              className={`w-full px-4 py-2.5 border-2 rounded-xl text-gray-700 font-medium bg-gray-50 focus:bg-white outline-none transition-all duration-200 ${
                validationError
                  ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                  : "border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              }`}
              placeholder={placeholder}
            />
            {validationError && (
              <p className="text-xs font-medium text-red-500 mt-1.5 pl-1">
                {validationError}
              </p>
            )}
          </div>
        ) : (
          <div className="font-semibold text-gray-800 text-lg break-words">
            {value || <span className="text-gray-300 font-normal">Not provided</span>}
          </div>
        )}
      </div>
      {!isEditing && onClick && buttonText && value && !actionDisabled && (
        <button
          onClick={onClick}
          className="ml-4 px-4 py-2 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 rounded-xl font-semibold text-sm transition-all flex-shrink-0"
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

// --- Enhanced Editable Field Component ---
const EditableField = ({
  label,
  value,
  fieldName,
  isEditing,
  onFieldChange,
  type = "text",
  placeholder = "",
  min,
  max,
  validation = null,
  options = null,
}) => {
  const [validationError, setValidationError] = useState("");

  const handleChange = (newValue) => {
    if (validation) {
      const result = validation(newValue);
      setValidationError(result.isValid ? "" : result.message);
    }
    onFieldChange(fieldName, newValue);
  };

  if (options && isEditing) {
    return (
      <div className="py-3">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
          {label}
        </label>
        <select
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full px-4 py-2.5 border-2 border-transparent bg-gray-50 focus:bg-white outline-none rounded-xl text-gray-700 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all cursor-pointer"
        >
          <option value="" disabled>Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {validationError && (
          <p className="text-xs text-red-500 font-medium mt-1">{validationError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="py-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-2">
        {label}
      </label>
      {isEditing ? (
        <div>
          <input
            type={type}
            value={value || ""}
            onChange={(e) => handleChange(e.target.value)}
            className={`w-full px-4 py-2.5 border-2 bg-gray-50 focus:bg-white outline-none rounded-xl text-gray-700 font-medium transition-all ${
              validationError
                ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                : "border-transparent focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            }`}
            placeholder={placeholder}
            min={min}
            max={max}
          />
          {validationError && (
            <p className="text-xs text-red-500 font-medium mt-1">{validationError}</p>
          )}
        </div>
      ) : (
        <span className="font-semibold text-gray-800 text-lg block">
          {value || <span className="text-gray-300 font-normal">Not provided</span>}
        </span>
      )}
    </div>
  );
};

const UserDetail = () => {
  const { adminId, documentId, member_id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMember, setEditedMember] = useState(null);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  //photo
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [photoError, setPhotoError] = useState("");

  //edit option
  const isEditAllowed = localStorage.getItem("edit") === "true";

  // Scan Event
  useEffect(() => {
    if (!member_id) return;
    axios
      .post("https://api.regeve.in/api/event", { member_id })
      .then(() => console.log("Scan event sent to backend"))
      .catch((err) => console.error("Scan event error:", err));
  }, [member_id]);

  // Data Fetching
  useEffect(() => {
    const loadMember = async () => {
      try {
        const response = await axios.get(
          `https://api.regeve.in/api/event/${adminId}/member-details/${documentId}/${member_id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }
        );
        const memberData = response.data?.data;
        setMember(memberData);
        setEditedMember(memberData);
      } catch (err) {
        console.error("Error fetching member data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMember();
  }, [member_id]);



  // Helper Functions
  const getFieldValue = (fieldName) => {
    return isEditing ? editedMember?.[fieldName] : member?.[fieldName];
  };

  const getTotalGuests = () => {
    const adults = parseInt(getFieldValue("Adult_Count") || 0);
    const children = parseInt(getFieldValue("Children_Count") || 0);
    const self = parseInt(getFieldValue("Self") || 1);
    return adults + children + self;
  };

  const getTotalMeals = () => {
    const veg = parseInt(getFieldValue("Veg_Count") || 0);
    const nonVeg = parseInt(getFieldValue("Non_Veg_Count") || 0);
    return veg + nonVeg;
  };

  const hasMealCountErrors = () => {
    const totalGuests = getTotalGuests();
    const totalMeals = getTotalMeals();
    return totalMeals > totalGuests;
  };

  const getMealValidationStatus = () => {
    const totalGuests = getTotalGuests();
    const totalMeals = getTotalMeals();
    if (totalMeals > totalGuests) return "error";
    if (totalMeals === totalGuests) return "success";
    return "warning";
  };

  // Validation Functions
  const validatePhoneNumber = (value) => {
    if (!value) return { isValid: true };
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return {
      isValid: phoneRegex.test(value.replace(/[\s\-\(\)]/g, "")),
      message: "Please enter a valid phone number",
    };
  };

  const validateEmail = (value) => {
    if (!value) return { isValid: true };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return {
      isValid: emailRegex.test(value),
      message: "Please enter a valid email address",
    };
  };

  const validateAge = (value) => {
    if (!value) return { isValid: true };
    const age = parseInt(value);
    return {
      isValid: age >= 0 && age <= 120,
      message: "Age must be between 0 and 120",
    };
  };

  const validateCompanyId = (value) => {
    if (!value) return { isValid: true };
    return {
      isValid: value.length >= 2 && value.length <= 20,
      message: "Company ID must be between 2-20 characters",
    };
  };

  // Handler Functions
  const handleShare = () => {
    if (!member) return;
    const profileURL = window.location.href;
    const shareMessage = `View Member Profile for ${member.Name} (ID: ${member_id}).\n\nProfile Link:\n${profileURL}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      shareMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleWhatsApp = (whatsappNumber) => {
    if (whatsappNumber) {
      const formattedNumber = whatsappNumber.replace(/[^0-9]/g, "");
      window.open(`https://wa.me/${formattedNumber}`, "_blank");
    }
  };

  const handleEmail = (email) => {
    if (email) {
      window.open(`mailto:${email}`, "_blank");
    }
  };

  // Edit Functions
  const handleEditToggle = () => {
    if (isEditing) {
      setEditedMember(member);
      setValidationErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handlePhotoClick = () => {
    if (isEditing) {
      setShowPhotoModal(true);
      setPhotoError("");
      setSelectedFile(null);
      setPhotoPreview("");
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file (JPEG, PNG)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("File must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    setPhotoError("");

    const reader = new FileReader();
    reader.onload = (e) => setPhotoPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      setPhotoError("Please select a file first");
      return;
    }
    setUploadingPhoto(true);
    setPhotoError("");

    try {
      const fileExtension = selectedFile.name.split(".").pop();
      const customFileName = `${member_id}_${member.Name}.${fileExtension}`;
      const customFile = new File([selectedFile], customFileName, {
        type: selectedFile.type,
      });

      const formData = new FormData();
      formData.append("files", customFile);

      const uploadResponse = await axios.post(
        "https://api.regeve.in/api/upload/",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (uploadResponse.data && uploadResponse.data[0]) {
        const uploadedFile = uploadResponse.data[0];
        await axios.put(
          `https://api.regeve.in/api/event/${member_id}`,
          { data: { Photo: uploadedFile.id } },
          { headers: { "Content-Type": "application/json" } }
        );

        const refreshResponse = await axios.get(
          `https://api.regeve.in/api/event/${member_id}`
        );

        const updatedMemberData = refreshResponse.data?.data;
        setMember(updatedMemberData);
        setEditedMember(updatedMemberData);
        setImageError(false);
        setShowPhotoModal(false);
        setSelectedFile(null);
        setPhotoPreview("");
        alert("Photo updated successfully!");
      }
    } catch (error) {
      console.error(error);
      setPhotoError("Failed to upload. Try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleCloseModal = () => {
    setShowPhotoModal(false);
    setSelectedFile(null);
    setPhotoPreview("");
    setPhotoError("");
  };

  const handleFieldChange = (fieldName, value) => {
    if (fieldName === "IsPresent") {
      if (!editedMember?.Is_Verified_Member && value === true) {
        alert("Only verified members can be marked as Present.");
        return;
      }
    }
    let finalValue = value;
    if (
      ["Age", "Adult_Count", "Children_Count", "Veg_Count", "Non_Veg_Count"].includes(
        fieldName
      )
    ) {
      finalValue = value === "" ? "" : parseInt(value, 10) || 0;
    }

    setEditedMember((prev) => ({
      ...prev,
      [fieldName]: finalValue,
    }));
  };

  const validateAllFields = () => {
    const errors = {};
    if (editedMember.Phone_Number) {
      const phoneValidation = validatePhoneNumber(editedMember.Phone_Number);
      if (!phoneValidation.isValid) errors.Phone_Number = phoneValidation.message;
    }
    if (editedMember.Email) {
      const emailValidation = validateEmail(editedMember.Email);
      if (!emailValidation.isValid) errors.Email = emailValidation.message;
    }
    if (editedMember.Age) {
      const ageValidation = validateAge(editedMember.Age);
      if (!ageValidation.isValid) errors.Age = ageValidation.message;
    }
    if (editedMember.Company_ID) {
      const companyValidation = validateCompanyId(editedMember.Company_ID);
      if (!companyValidation.isValid) errors.Company_ID = companyValidation.message;
    }
    if (hasMealCountErrors()) {
      errors.MealCount = "Total meals exceed total guests";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!editedMember) return;
    if (editedMember.IsPresent === true && editedMember.Is_Verified_Member !== true) {
      alert("❌ User must be verified by admin before marking Present.");
      return;
    }
    if (!validateAllFields()) {
      alert("Please fix validation errors before saving.");
      return;
    }
    setSaving(true);

    try {
      const cleanData = {
        Name: editedMember.Name?.trim(),
        Age: editedMember.Age,
        Gender: editedMember.Gender,
        Phone_Number: editedMember.Phone_Number?.trim(),
        WhatsApp_Number: editedMember.WhatsApp_Number?.trim(),
        Email: editedMember.Email?.trim(),
        Self: editedMember.Self || 1,
        Adult_Count: editedMember.Adult_Count,
        Children_Count: editedMember.Children_Count,
        Veg_Count: editedMember.Veg_Count,
        Non_Veg_Count: editedMember.Non_Veg_Count,
        Company_ID: editedMember.Company_ID?.trim(),
        IsPresent: editedMember.IsPresent,
        Travel_Mode: editedMember.Travel_Mode,
        Pickup_Location: editedMember.Pickup_Location,
      };

      Object.keys(cleanData).forEach((key) => {
        if (cleanData[key] === undefined || cleanData[key] === "") {
          delete cleanData[key];
        }
      });

      await axios.put(
         `https://api.regeve.in/api/event/${adminId}/member-details/${documentId}/${member_id}/present`,
        { data: cleanData },
        { headers: { "Content-Type": "application/json" } }
      );

      setMember(editedMember);
      setIsEditing(false);
      setValidationErrors({});
      // Optional: replace alert with a toast notification if you add a library later
    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error);
      alert("Failed to update member details. Check console.");
    } finally {
      setSaving(false);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-6"></div>
          <p className="text-indigo-900 font-semibold text-lg tracking-wide">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  // NOT FOUND STATE
  if (!member) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full border border-gray-100">
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUser className="text-4xl text-red-400" />
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">
            Member Not Found
          </h3>
          <p className="text-gray-500 mb-8 font-medium">
            The requested member profile could not be loaded or does not exist.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const mealStatus = getMealValidationStatus();
  const totalGuests = getTotalGuests();
  const totalMeals = getTotalMeals();

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* =========================================
            HEADER SECTION
        ========================================= */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative background blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 -mr-20 -mt-20 pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center w-full md:w-auto">
              {/* Profile Image */}
              <div className="relative group flex-shrink-0">
                <div
                  className={`relative overflow-hidden rounded-2xl w-28 h-28 sm:w-32 sm:h-32 shadow-lg border-4 border-white ring-1 ring-slate-100 ${
                    isEditing ? "cursor-pointer" : ""
                  }`}
                  onClick={isEditing ? handlePhotoClick : undefined}
                >
                  {member.Photo?.url && !imageError ? (
                    <img
                      src={`https://api.regeve.in${member.Photo.url}?t=${Date.now()}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center">
                      <FaUser className="text-4xl text-indigo-300" />
                    </div>
                  )}
                  
                  {/* Edit Photo Overlay */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-[2px]">
                      <FaCamera className="text-white text-2xl mb-1" />
                      <span className="text-white text-xs font-semibold">Change</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center gap-1.5">
                    <FaCheckCircle className="text-emerald-600" /> Registered
                  </span>
                  {member.IsPresent && !isEditing && (
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-xs font-bold uppercase tracking-wide">
                      Present
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={editedMember?.Name || ""}
                    onChange={(e) => handleFieldChange("Name", e.target.value)}
                    className="w-full px-4 py-2 mb-3 border-2 border-transparent bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 rounded-xl text-3xl font-black text-gray-900 outline-none transition-all"
                    placeholder="Member Name"
                  />
                ) : (
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 break-words leading-tight">
                    {member.Name}
                  </h1>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 font-semibold">
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><FaBuilding className="text-gray-400 text-xs" /></div>
                    {member.Company_ID || "No Company ID"}
                  </span>
                  <span className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center"><FaInfoCircle className="text-gray-400 text-xs" /></div>
                    ID: {member.member_id || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions & Status Toggle */}
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 w-full md:w-auto self-stretch md:self-auto justify-end">
              
              {/* Status Toggle (Only visible in Edit Mode) */}
              {isEditing && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between sm:justify-start gap-4">
                  <div>
                    <div className="text-sm font-bold text-gray-900">Attendance</div>
                    <div className="text-xs text-gray-500 font-medium">
                      {!editedMember?.Is_Verified_Member ? "Verification required" : "Mark as present"}
                    </div>
                  </div>
                  <label className={`relative inline-flex items-center cursor-pointer ${!editedMember?.Is_Verified_Member ? "opacity-50" : ""}`}>
                    <input
                      type="checkbox"
                      checked={editedMember?.IsPresent || false}
                      className="sr-only peer"
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        if (newValue && !editedMember?.Is_Verified_Member) {
                          alert("❌ User must be verified by admin before marking Present.");
                          e.target.checked = false;
                          setEditedMember((prev) => ({ ...prev, IsPresent: false }));
                          return;
                        }
                        handleFieldChange("IsPresent", newValue);
                      }}
                    />
                    <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                  </label>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {!isEditing && (
                  <button
                    onClick={handleShare}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                  >
                    <FaShareAlt className="text-gray-400" />
                    <span>Share</span>
                  </button>
                )}

                {isEditing ? (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <FaTimes className="text-gray-400" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 disabled:opacity-70"
                    >
                      <FaSave />
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                  </>
                ) : (
                  isEditAllowed && (
                    <button
                      onClick={handleEditToggle}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-md shadow-gray-200"
                    >
                      <FaEdit />
                      <span>Edit Profile</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =========================================
            MAIN CONTENT GRID
        ========================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: GUESTS & MEALS */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                    <FaUsers className="text-teal-600 text-lg" />
                  </div>
                  Guest & Meal Counts
                </h2>
              </div>

              {isEditing && hasMealCountErrors() && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 animate-pulse">
                  <FaExclamationTriangle className="text-red-500 mt-0.5 text-lg" />
                  <div>
                    <h4 className="text-sm font-bold text-red-800">Count Mismatch</h4>
                    <p className="text-sm text-red-600 font-medium mt-0.5">
                      Total meals cannot exceed the total party size.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <CountInputCard
                  icon={FaUser}
                  iconColor="text-teal-600"
                  iconBgColor="bg-teal-50"
                  label="Self"
                  value={getFieldValue("Self")}
                  isEditing={false}
                />
                <CountInputCard
                  icon={FaUsers}
                  iconColor="text-teal-600"
                  iconBgColor="bg-teal-50"
                  label="Adults"
                  value={getFieldValue("Adult_Count")}
                  isEditing={isEditing}
                  onFieldChange={(val) => handleFieldChange("Adult_Count", val)}
                  min="0"
                  max="50"
                />
                <CountInputCard
                  icon={FaChild}
                  iconColor="text-teal-600"
                  iconBgColor="bg-teal-50"
                  label="Children"
                  value={getFieldValue("Children_Count")}
                  isEditing={isEditing}
                  onFieldChange={(val) => handleFieldChange("Children_Count", val)}
                  min="0"
                  max="50"
                />
                <div className="hidden md:block"></div> {/* Spacer for grid alignment if needed, or let meals take up next row */}

                {/* Meals Section - Subheader */}
                <div className="col-span-2 mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4">Meal Allocation</h3>
                </div>

                <CountInputCard
                  icon={FaUtensils}
                  iconColor="text-emerald-600"
                  iconBgColor="bg-emerald-50"
                  label="Veg Meals"
                  value={getFieldValue("Veg_Count")}
                  isEditing={isEditing}
                  onFieldChange={(val) => handleFieldChange("Veg_Count", val)}
                  min="0"
                  max={totalGuests}
                  error={getFieldValue("Veg_Count") > totalGuests}
                />
                <CountInputCard
                  icon={FaUtensils}
                  iconColor="text-orange-600"
                  iconBgColor="bg-orange-50"
                  label="Non-Veg"
                  value={getFieldValue("Non_Veg_Count")}
                  isEditing={isEditing}
                  onFieldChange={(val) => handleFieldChange("Non_Veg_Count", val)}
                  min="0"
                  max={totalGuests}
                  error={getFieldValue("Non_Veg_Count") > totalGuests}
                />

                {/* Summary Block */}
                <div className="col-span-2 mt-2 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-around">
                    <div className="text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Party Size</div>
                      <div className="text-2xl font-black text-gray-900">{totalGuests}</div>
                    </div>
                    <div className="w-px h-10 bg-slate-200"></div>
                    <div className="text-center">
                      <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Meals</div>
                      <div
                        className={`text-2xl font-black ${
                          mealStatus === "error" ? "text-red-600" : mealStatus === "success" ? "text-emerald-600" : "text-amber-500"
                        }`}
                      >
                        {totalMeals}
                      </div>
                    </div>
                  </div>
                  {mealStatus !== "success" && (
                    <div className={`mt-3 text-center text-xs font-bold px-3 py-2 rounded-lg ${
                        mealStatus === "error" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {mealStatus === "error" ? "Meals exceed party size!" : "Meals don't match party size"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT & TRAVEL */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Contact Info Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FaPhoneAlt className="text-blue-600 text-sm" />
                </div>
                Contact Details
              </h2>
              
              <div className="space-y-2">
                <ContactDetailItem
                  icon={FaWhatsapp}
                  label="WhatsApp Number"
                  value={getFieldValue("WhatsApp_Number")}
                  buttonText="Message"
                  onClick={() => handleWhatsApp(getFieldValue("WhatsApp_Number"))}
                  iconColor="text-green-600"
                  iconBgColor="bg-green-50"
                  isEditing={isEditing}
                  fieldName="WhatsApp_Number"
                  onFieldChange={handleFieldChange}
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  validation={validatePhoneNumber}
                  actionDisabled={!getFieldValue("WhatsApp_Number")}
                />
                <ContactDetailItem
                  icon={FaEnvelope}
                  label="Email Address"
                  value={getFieldValue("Email")}
                  buttonText="Email"
                  onClick={() => handleEmail(getFieldValue("Email"))}
                  iconColor="text-indigo-600"
                  iconBgColor="bg-indigo-50"
                  isEditing={isEditing}
                  fieldName="Email"
                  onFieldChange={handleFieldChange}
                  type="email"
                  placeholder="name@company.com"
                  validation={validateEmail}
                  actionDisabled={!getFieldValue("Email")}
                />
              </div>
            </div>

            {/* Travel Info Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  <FaBus className="text-purple-600 text-lg" />
                </div>
                Travel Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EditableField
                  label="Mode of Travel"
                  value={getFieldValue("Travel_Mode")}
                  fieldName="Travel_Mode"
                  isEditing={isEditing}
                  onFieldChange={handleFieldChange}
                  options={[
                    { label: "Self Transport", value: "Self" },
                    { label: "Company Bus", value: "Company Bus" },
                  ]}
                />

                {getFieldValue("Travel_Mode") === "Company Bus" && (
                  <EditableField
                    label="Pickup Location"
                    value={getFieldValue("Pickup_Location")}
                    fieldName="Pickup_Location"
                    isEditing={isEditing}
                    onFieldChange={handleFieldChange}
                    placeholder="E.g., Central Station"
                  />
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* =========================================
          PHOTO UPLOAD MODAL
      ========================================= */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 transform transition-transform scale-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-gray-900">
                Update Photo
              </h3>
              <button
                onClick={handleCloseModal}
                className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-500 transition-colors"
              >
                <FaTimes className="text-lg" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-40 h-40 object-cover rounded-3xl shadow-lg border-4 border-white ring-1 ring-slate-200"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-3xl bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-300">
                    <FaCamera className="text-4xl text-slate-300" />
                  </div>
                )}
              </div>

              <div>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label 
                  htmlFor="photo-upload" 
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-indigo-100 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  <FaCamera />
                  Choose New Image
                </label>
              </div>

              {photoError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center">
                  {photoError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadPhoto}
                  disabled={!selectedFile || uploadingPhoto}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-200"
                >
                  {uploadingPhoto ? "Saving..." : "Upload"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetail;