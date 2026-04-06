import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default function EventForm() {
  const defaultForm = {
    Name: "",
    Gender: "",
    Company_ID: "",
    WhatsApp_Number: "",
    Email: "",
    Adult_Count: "0",
    Children_Count: "0",
    Veg_Count: "",
    Non_Veg_Count: "",
    Travel_Mode: "",
    Pickup_Location: "",
    Self: "1",
    coming_to_family_day: "",
  };

  const navigate = useNavigate();

  const [form, setForm] = useState(defaultForm);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [eventName, setEventName] = useState("");

  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [memberData, setMemberData] = useState(null);
  const { adminId, documentId } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // WhatsApp number – only digits, max 10
    if (name === "WhatsApp_Number") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, WhatsApp_Number: numericValue });
      return;
    }

    // Company ID – only digits, max 8, and reset dependent fields
    if (name === "Company_ID") {
      const numericValue = value.replace(/\D/g, "").slice(0, 8);
      setForm({
        ...form,
        [name]: numericValue,
        Name: "",
        WhatsApp_Number: "",
        Email: "",
      });
      return;
    }

    // All other fields
    setForm({ ...form, [name]: value });
  };

  const handlePhoto = (e) => {
    setPhoto(e.target.files[0]);
  };

  const uploadPhoto = async (file) => {
    const fd = new FormData();
    fd.append("files", file);

    const res = await axios.post("https://api.regeve.in/api/upload", fd);
    return res.data[0].id;
  };

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `https://api.regeve.in/api/event-management-name/public/${documentId}`,
        );

        if (res.data && res.data.length > 0) {
          setEventName(res.data[0].Name); // change field if needed
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };

    fetchEvent();
  }, [documentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate food counts only if coming
      if (form.coming_to_family_day === "Yes") {
        const totalPersons =
          Number(form.Self) +
          Number(form.Adult_Count) +
          Number(form.Children_Count);

        const totalFoodCount =
          Number(form.Veg_Count) + Number(form.Non_Veg_Count);

        if (totalPersons !== totalFoodCount) {
          alert(
            `Total Persons (${totalPersons}) must match Veg + Non-Veg Count (${totalFoodCount})`,
          );
          setIsLoading(false);
          return;
        }
      }

      let photoId = null;

      // Upload photo if present
      if (photo) {
        photoId = await uploadPhoto(photo);
      }

      // Prepare data for submission
      const submissionData = {
        ...form,
        Photo: photoId,
        Company_ID: adminId,
        Event_ID: documentId,
      };

      // POST to the correct endpoint
      const response = await axios.post(
        "https://api.regeve.in/api/event-management-form",
        {
          data: submissionData,
        },
      );

      console.log("SUCCESS:", response.data);

      // The backend returns the created entry in response.data.data
      const createdEntry = response.data.data;

      // Set member data from the response (includes Member_ID, Name, Email, etc.)
      setMemberData(createdEntry);
      setShowPopup(true);

      // Reset form
      // setForm(defaultForm);
      // setPhoto(null);
    } catch (error) {
      console.error("ERROR:", error.response?.data || error);

      const backendMessage =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        "Failed to submit form";

      alert(backendMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
            {eventName || "Event Registration"}
          </h1>
          <p className="text-gray-600 text-sm sm:text-lg">Registration Form</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:px-8">
            {/* Company ID - Moved to top */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full mr-3 sm:mr-4"></div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Company Identification
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Company ID *
                  </label>
                  <input
                    name="Company_ID"
                    value={form.Company_ID}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter 8-digit Company ID"
                    required
                    pattern="[0-9]{8}"
                    maxLength={8}
                    minLength={8}
                    title="Please enter exactly 8 digits"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be exactly 8 digits
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="mb-8 sm:mb-10">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-1.5 h-6 sm:h-8 bg-blue-600 rounded-full mr-3 sm:mr-4"></div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Full Name *
                    </label>
                    <input
                      name="Name"
                      value={form.Name}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      placeholder="Enter your full name"
                      required
                      minLength={3}
                    />
                  </div>

                  {/* Coming for Family Day */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Please Confirm Your Participation
                    </label>
                    <select
                      name="coming_to_family_day"
                      value={form.coming_to_family_day}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      required
                    >
                      <option value="">Select Option</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* ⭐ SHOW EVERYTHING BELOW ONLY WHEN YES ⭐ */}
            {form.coming_to_family_day === "Yes" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Gender *
                    </label>
                    <div className="relative">
                      <select
                        name="Gender"
                        onChange={handleChange}
                        value={form.Gender}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white cursor-pointer"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                      </select>
                    </div>
                  </div>

                  {/* Travel Mode */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Travel Mode *
                    </label>
                    <div className="relative">
                      <select
                        name="Travel_Mode"
                        onChange={handleChange}
                        value={form.Travel_Mode}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none bg-white cursor-pointer"
                        required
                      >
                        <option value="">Select Travel Mode</option>
                        <option value="Self">Self</option>
                        <option value="Company Bus">Company Bus</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pickup Location */}
                {form.Travel_Mode === "Company Bus" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mt-3 sm:mb-2">
                      Pickup Location *
                    </label>
                    <div className="relative w-full mb-4 sm:mb-0">
                      <input
                        name="Pickup_Location"
                        value={form.Pickup_Location}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Pickup Location"
                        type="text"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="mb-1 mt-10 sm:mb-10">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-1.5 h-6 sm:h-8 bg-green-600 rounded-full mr-3 sm:mr-4"></div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Contact Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    {/* WhatsApp Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        WhatsApp Number *
                      </label>
                      <input
                        name="WhatsApp_Number"
                        value={form.WhatsApp_Number}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Enter WhatsApp number"
                        type="tel"
                        required
                        pattern="[0-9]{10}"
                        maxLength={10}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Email Address *
                      </label>
                      <input
                        name="Email"
                        value={form.Email}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Enter email address"
                        type="email"
                        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Family Members & Food Preference */}
                <div className="mb-8 sm:mb-10">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-1.5 h-6 sm:h-8 bg-purple-600 rounded-full mr-3 sm:mr-4"></div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Family Members & Food Preference
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Self Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Employee Count *
                      </label>
                      <input
                        name="Self"
                        value={form.Self}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Self Count"
                        type="number"
                        required
                        min={1}
                        max={1}
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Always 1 (yourself)
                      </p>
                    </div>

                    {/* Adult Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Additional Adults
                      </label>
                      <input
                        name="Adult_Count"
                        value={form.Adult_Count}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Additional Adults"
                        type="number"
                        required
                        min={0}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Other adults besides yourself
                      </p>
                    </div>

                    {/* Children */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Children
                      </label>
                      <input
                        name="Children_Count"
                        value={form.Children_Count}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Children Count"
                        type="number"
                        required
                        min={0}
                      />
                    </div>

                    {/* Veg Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Veg Count *
                      </label>
                      <input
                        name="Veg_Count"
                        value={form.Veg_Count}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Veg Count"
                        type="number"
                        required
                        min={0}
                      />
                    </div>

                    {/* Non-Veg Count */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                        Non-Veg Count *
                      </label>
                      <input
                        name="Non_Veg_Count"
                        value={form.Non_Veg_Count}
                        onChange={handleChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Non-Veg Count"
                        type="number"
                        required
                        min={0}
                      />
                    </div>
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="mb-8 sm:mb-10">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="w-1.5 h-6 sm:h-8 bg-orange-500 rounded-full mr-3 sm:mr-4"></div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Photo Upload
                    </h2>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:px-8 text-center hover:border-blue-400 transition-colors duration-200">
                    <div className="max-w-md mx-auto">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <svg
                          className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">
                        Upload your clear Portrait photo
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">
                        Supports JPG, PNG, JPEG (Max 5MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={handlePhoto}
                        className="block w-full cursor-pointer text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-4 sm:pt-6">
              <button
                type="submit"
                className="w-full cursor-pointer sm:w-auto px-6 sm:px-12 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-cyan-700 hover:from-blue-700 hover:to-cyan-800 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 sm:focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Submit Registration
              </button>
            </div>

            {isLoading && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-4 sm:mt-6">
          <p className="text-gray-500 text-xs sm:text-sm">
            All fields marked with * are required
          </p>
        </div>
      </div>

      {/* UPDATED POPUP DESIGN */}
      {showPopup && memberData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-4xl mx-auto overflow-y-auto max-h-[95vh]">
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-700 p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      Registration Successful
                    </h1>
                    <p className="text-blue-100 mt-1 text-xs sm:text-sm">
                      Your registration has been confirmed and processed
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors duration-200"
                  aria-label="Close popup"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-4 sm:p-6">
              <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6">
                {/* Left Side - Member Details */}
                <div className="lg:col-span-8">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Member Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Full Name
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900 break-words">
                          {memberData.Name}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Member ID
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900 font-mono break-all">
                          {memberData.Member_ID}
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                          Email Address
                        </p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900 break-all">
                          {memberData.Email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Share Section */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-base text-center font-semibold text-gray-900 mb-3">
                      Share Details
                    </h3>
                    <div className="space-y-3">
                      <div className="space-y-3 flex flex-col items-center">
                        {/* WhatsApp Share */}
                        <button
                          onClick={() => {
                            const detailsLink = `${window.location.origin}/member-details/${memberData.Member_ID}`;
                            const qrCleanLink = `${window.location.origin}/qr/${memberData.Member_ID}`;
                            const message = `
🎉 *Registration Confirmed!*

*Name:* ${memberData.Name}
*Member ID:* ${memberData.Member_ID}
*Phone:* ${memberData.WhatsApp_Number}
*Email:* ${memberData.Email}

🔗 *View Full Details:*  
${detailsLink}

📲 *QR Code (Clean Link):*  
${qrCleanLink}

Please present your QR Code at the venue for entry.
                            `;
                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                              message,
                            )}`;
                            window.open(whatsappUrl, "_blank");
                          }}
                          className="bg-green-500 cursor-pointer hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          Share on WhatsApp
                        </button>

                        {/* Copy Link */}
                        <button
                          onClick={async () => {
                            const shareableLink = `${window.location.origin}/member-details/${memberData.Member_ID}`;
                            try {
                              await navigator.clipboard.writeText(
                                shareableLink,
                              );
                              alert("Shareable link copied to clipboard!");
                            } catch (err) {
                              const textArea =
                                document.createElement("textarea");
                              textArea.value = shareableLink;
                              document.body.appendChild(textArea);
                              textArea.select();
                              document.execCommand("copy");
                              document.body.removeChild(textArea);
                              alert("Shareable link copied to clipboard!");
                            }
                          }}
                          className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                        >
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                            />
                          </svg>
                          <span>Copy Share Link</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Share your registration details with friends and family
                    </p>
                  </div>
                </div>

                {/* Right Side - QR Code */}
                <div className="lg:col-span-4">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <h3 className="text-base font-semibold text-gray-900 mb-3">
                        Event Pass
                      </h3>
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          <img
                            src={`https://api.regeve.in/uploads/${memberData.companyFolder}/${memberData.Member_ID}/qrcode/${memberData.Member_ID}_QR.png`}
                            alt="QR Code"
                            className="w-32 h-32 sm:w-36 sm:h-36 border border-gray-200 rounded-lg bg-white p-2 mx-auto"
                          />
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          Present this QR code at the venue
                        </p>
                        <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>Digital Access Pass</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
