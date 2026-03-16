import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Plus,
  X,
  ClipboardList,
  Loader2,
  CheckCircle2,
  Calendar,
  Settings,
  MoreVertical,
  Edit,
  FileText
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EventManagementHomePage = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();

  // Modal and Creation/Editing States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [editingFormId, setEditingFormId] = useState(null); // NEW: Tracks which form is being edited
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createdForm, setCreatedForm] = useState(null);

  // Fetching States
  const [formsList, setFormsList] = useState([]);
  const [isFetchingForms, setIsFetchingForms] = useState(true);

  // Fetch existing forms on mount
  useEffect(() => {
    fetchForms();
  }, [adminId]);

  const fetchForms = async () => {
    setIsFetchingForms(true);
    try {
      const token = localStorage.getItem("jwt");
      const response = await axios.get(
        `https://api.regeve.in/api/event-management-name`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setFormsList(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch forms:", err);
    } finally {
      setIsFetchingForms(false);
    }
  };

  // Helper to open modal for editing
  const handleOpenEditModal = (id, currentName) => {
    setEditingFormId(id);
    setFormName(currentName);
    setError(null);
    setIsModalOpen(true);
  };

  // Helper to open modal for creation
  const handleOpenCreateModal = () => {
    setEditingFormId(null);
    setFormName("");
    setError(null);
    setIsModalOpen(true);
  };

  // Handles both POST (Create) and PUT (Edit)
  const handleSubmitForm = async () => {
    if (!formName.trim()) {
      setError("Form name is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("jwt");
     const payload = {
  data: {
    Name: formName,
    admin: {
      connect: [adminId]
    }
  },
};

      if (editingFormId) {
        // --- PUT REQUEST (EDIT) ---
        await axios.put(
          `https://api.regeve.in/api/event-management-name/${editingFormId}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // --- POST REQUEST (CREATE) ---
        const response = await axios.post(
          "https://api.regeve.in/api/event-management-name",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = response.data.data;
        setCreatedForm({
          id: responseData.id,
          name: responseData.Name,
        });
      }

      // Close modal and refresh list
      setIsModalOpen(false);
      setFormName("");
      setEditingFormId(null);
      fetchForms();

    } catch (err) {
      setError(
        err.response?.data?.error?.message || 
        `Failed to ${editingFormId ? 'update' : 'create'} form.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 py-8 px-4 flex flex-col items-center relative">
      <div className="w-full max-w-5xl">
        
        {/* Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-xs font-bold text-slate-500 tracking-wider mb-8 hover:text-slate-800 transition-colors uppercase"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Center
        </button>

        {/* Header & Create Button Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight mb-2">
              Manage Registration Forms
            </h1>
            <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">
              Create and manage custom event registration forms to collect attendee details.
            </p>
          </div>
          
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 bg-[#2563eb] hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-blue-500/20 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Form
          </button>
        </div>

        {/* Form Builder Canvas (Shows after creation)
        {createdForm && !editingFormId && (
          <div className="mb-10 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {createdForm.name} Created Successfully!
                  </h2>
                  <p className="text-sm text-slate-500">
                    Form ID: {createdForm.id}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setCreatedForm(null)}
                className="text-sm text-slate-500 hover:text-slate-700 underline"
              >
                Close Builder
              </button>
            </div>

            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
              <h3 className="text-lg font-semibold text-slate-700 mb-2">
                Form Builder Canvas
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                You are now configuring the form on the same page. Add your fields here.
              </p>
              <button className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50">
                + Add New Field
              </button>
            </div>
          </div>
        )} */}

        {/* Existing Forms Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Your Forms</h2>
          
          {isFetchingForms ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : formsList.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center shadow-sm">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-slate-700 font-medium">No forms found</h3>
              <p className="text-slate-500 text-sm mt-1">Create your first registration form to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {formsList.map((form) => {
                const formNameStr = form.Name || "Unnamed Form";
                const formId = form.id;
                const formdocumentId = form.documentId;
                const createdAt = form.createdAt 
                  ? new Date(form.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
                  : 'N/A';

                return (
                  <div 
                    key={formId} 
                    className="bg-white group rounded-2xl shadow-sm border border-slate-200 p-5 hover:shadow-md hover:border-blue-300 transition-all flex flex-col relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                    <div className="flex justify-between items-start mb-4 mt-1">
                      <div className="bg-blue-50/70 p-3 rounded-xl text-blue-600 border border-blue-100">
                        <FileText className="w-5 h-5" />
                      </div>
                      
                      <div className="flex gap-1">
                        {/* EDIT BUTTON UPDATED HERE */}
                        <button 
                          onClick={() => handleOpenEditModal(formdocumentId, formNameStr)}
                          className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                          title="Edit Form Name"
                        >
                          <Edit className="w-[18px] h-[18px]" />
                        </button>
                        
                        <button className="text-slate-400 hover:text-slate-700 hover:bg-slate-50 p-2 rounded-lg transition-colors">
                          <MoreVertical className="w-[18px] h-[18px]" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-800 mb-2 line-clamp-1" title={formNameStr}>
                      {formNameStr}
                    </h3>
                    
                    <div className="flex items-center flex-wrap gap-2 mb-6 text-xs font-medium text-slate-500">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                        ID: {formId}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {createdAt}
                      </span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                      <button 
                        onClick={() => navigate(`/${adminId}/dashboard/${formdocumentId}`)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-50 group-hover:bg-blue-50 group-hover:text-blue-700 text-slate-600 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Manage Form
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DYNAMIC MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[500px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 pb-5 relative">
              <button
                onClick={() => !isLoading && setIsModalOpen(false)}
                disabled={isLoading}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="bg-[#1d4ed8] text-white p-2.5 rounded-full flex-shrink-0 shadow-sm">
                  {/* Swap icon based on edit state */}
                  {editingFormId ? <Edit className="w-6 h-6" /> : <ClipboardList className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#0f172a]">
                    {editingFormId ? "Edit Registration Form" : "Create Registration Form"}
                  </h2>
                  <p className="text-[13px] text-slate-500 mt-0.5">
                    {editingFormId ? "Update your form details" : "Step 1: Enter form name"}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6">
              <hr className="border-slate-100" />
            </div>

            <div className="p-6 pt-5">
              <label className="block text-[14px] font-semibold text-slate-700 mb-2">
                Event Form Name <span className="text-slate-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter form name"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  if (error) setError(null);
                }}
                disabled={isLoading}
                autoFocus
                className={`w-full border-2 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 transition-all shadow-sm ${
                  error
                    ? "border-red-400 focus:ring-red-500/10"
                    : "border-[#3b82f6] focus:ring-blue-500/10"
                }`}
              />
              {error ? (
                <p className="text-[13px] text-red-500 mt-2 font-medium">
                  {error}
                </p>
              ) : (
                <p className="text-[13px] text-slate-500 mt-2">
                  {editingFormId 
                    ? "This will update the public name of your form." 
                    : "You'll be able to add fields and details in the next step"}
                </p>
              )}
            </div>

            <div className="px-6 py-5 border-t border-slate-100 flex justify-end items-center gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="text-[14px] font-semibold text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitForm}
                disabled={isLoading || !formName.trim()}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] disabled:bg-[#8b9df3] disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-[14px] font-semibold transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingFormId ? "Update Form" : "Next \u2192"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagementHomePage;