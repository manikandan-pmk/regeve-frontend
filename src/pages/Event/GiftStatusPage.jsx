import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GiftStatusPage = () => {
  const { documentId } = useParams();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all event-forms
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.regeve.in/api/event-management-name/public/${documentId}`
      );

      const json = response.data;
      const formattedUsers = json.data.event_management_forms.map((item) => ({
        id: item.id,
        documentId: item.documentId,
        ...item,
      }));

      setUsers(formattedUsers);
      setError(null);
    } catch (err) {
      console.error("Error fetching users", err);
      setError("Unable to load participants. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update Gift Status
  const updateGiftStatus = async (user, status) => {
    if (!user.Is_Verified_Member || !user.IsPresent) {
      alert("⚠️ Cannot update: This member is either not verified or not present.");
      return;
    }

    // Optimistic UI update
    const originalUsers = [...users];
    setUsers(
      users.map((u) =>
        u.documentId === user.documentId ? { ...u, IsGiftReceived: status } : u
      )
    );

    try {
      const response = await axios.put(
        `https://api.regeve.in/api/giftstatus/${user.documentId}`,
        {
          data: { IsGiftReceived: status },
        }
      );

      if (!response.data.data) {
        throw new Error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating gift status", err);
      alert("Failed to update. Reverting changes.");
      setUsers(originalUsers);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [documentId]);

  // Search filter
  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    return (
      u.Member_ID?.toLowerCase().includes(s) ||
      u.Name?.toLowerCase().includes(s) ||
      u.Company_ID?.toLowerCase?.().includes(s) ||
      String(u.Phone_Number)?.includes(s)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 sm:px-12 lg:px-16 font-sans">
      <div className="max-w-[90rem] mx-auto space-y-10">
        
        {/* Page Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Gift Distribution Tracker
            </h1>
            <p className="mt-4 text-lg text-slate-500 max-w-3xl">
              Manage and verify gift fulfillment for all event attendees with ease and precision.
            </p>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden flex flex-col">
          
          {/* Top Bar: Search and Stats */}
          <div className="p-8 border-b border-slate-200 flex flex-col lg:flex-row justify-between items-center gap-6 bg-white">
            <div className="relative w-full lg:max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5">
                <svg className="h-6 w-6 text-slate-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by name, ID, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-2xl border-0 py-4 pl-14 pr-6 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-lg transition-shadow"
              />
            </div>
            <div className="text-base font-medium text-slate-600 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-200">
              Showing <span className="font-bold text-indigo-600 text-lg">{filteredUsers.length}</span> participants
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-6 bg-red-50 border-b border-red-100 text-red-700 text-base font-semibold">
              {error}
            </div>
          )}

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="py-6 pl-8 pr-4 text-left text-sm font-bold text-slate-500 uppercase tracking-widest">Participant</th>
                  <th scope="col" className="px-6 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                  <th scope="col" className="px-6 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th scope="col" className="px-6 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-widest">Gift Status</th>
                  <th scope="col" className="py-6 pl-4 pr-8 text-right text-sm font-bold text-slate-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {isLoading ? (
                  /* Loading Skeletons */
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="py-8 pl-8 pr-4">
                        <div className="flex items-center gap-6">
                          <div className="h-16 w-16 rounded-full bg-slate-200"></div>
                          <div className="space-y-3">
                            <div className="h-5 w-40 rounded bg-slate-200"></div>
                            <div className="h-4 w-24 rounded bg-slate-100"></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-8"><div className="h-5 w-32 rounded bg-slate-200"></div></td>
                      <td className="px-6 py-8"><div className="h-8 w-24 rounded-lg bg-slate-200"></div></td>
                      <td className="px-6 py-8"><div className="h-8 w-32 rounded-full bg-slate-200"></div></td>
                      <td className="py-8 pl-4 pr-8 text-right"><div className="h-12 w-48 ml-auto rounded-2xl bg-slate-200"></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  /* Empty State */
                  <tr>
                    <td colSpan="5" className="py-24 text-center text-lg text-slate-500">
                      No participants found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  /* Data Rows */
                  filteredUsers.map((user) => {
                    const imageUrl = user.Photo?.url
                      ? `https://api.regeve.in${user.Photo.url}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.Name || "User")}&background=random`;
                    
                    const canReceiveGift = user.Is_Verified_Member && user.IsPresent;

                    return (
                      <tr key={user.documentId || user.id} className="hover:bg-slate-50/80 transition-colors duration-200">
                        
                        {/* 1. Participant Column */}
                        <td className="whitespace-nowrap py-8 pl-8 pr-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0">
                              <img
                                className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                                src={imageUrl}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.Name || "User")}&background=random`;
                                }}
                                alt=""
                              />
                            </div>
                            <div className="ml-6">
                              <div className="text-xl font-bold text-slate-900">{user.Name}</div>
                              <div className="text-base text-slate-500 mt-1">ID: {user.Member_ID}</div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Contact Column */}
                        <td className="whitespace-nowrap px-6 py-8">
                          <div className="text-lg font-medium text-slate-800">+91 {user.WhatsApp_Number || "N/A"}</div>
                        </td>

                        {/* 3. Status Badges Column */}
                        <td className="whitespace-nowrap px-6 py-8">
                          <div className="flex flex-col gap-2.5 items-start">
                            <span className={`inline-flex items-center rounded-xl px-3.5 py-1.5 text-sm font-bold ring-1 ring-inset ${
                              user.Is_Verified_Member ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-red-50 text-red-700 ring-red-600/20'
                            }`}>
                              {user.Is_Verified_Member ? 'Verified' : 'Unverified'}
                            </span>
                            <span className={`inline-flex items-center rounded-xl px-3.5 py-1.5 text-sm font-bold ring-1 ring-inset ${
                              user.IsPresent ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-red-100 text-red-600 ring-red-500/20'
                            }`}>
                              {user.IsPresent ? 'Present' : 'Absent'}
                            </span>
                          </div>
                        </td>

                        {/* 4. Gift Status Column */}
                        <td className="whitespace-nowrap px-6 py-8">
                           <span className={`inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-base font-bold border-2 ${
                              user.IsGiftReceived 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              <span className={`h-2.5 w-2.5 rounded-full ${user.IsGiftReceived ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                              {user.IsGiftReceived ? 'Received' : 'Pending'}
                            </span>
                        </td>

                        {/* 5. Actions Column */}
                        <td className="relative whitespace-nowrap py-8 pl-4 pr-8 text-right font-medium">
                          <div className="inline-flex rounded-2xl shadow-sm overflow-hidden border border-slate-200" role="group">
                            <button
                              type="button"
                              onClick={() => updateGiftStatus(user, true)}
                              disabled={!canReceiveGift || user.IsGiftReceived}
                              className={`relative inline-flex items-center px-6 py-3.5 text-base font-bold focus:z-10 transition-all ${
                                !canReceiveGift
                                  ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                  : user.IsGiftReceived
                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                    : 'bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              Given
                            </button>
                            <div className="w-px bg-slate-200"></div>
                            <button
                              type="button"
                              onClick={() => updateGiftStatus(user, false)}
                              disabled={!canReceiveGift || !user.IsGiftReceived}
                              className={`relative inline-flex items-center px-6 py-3.5 text-base font-bold focus:z-10 transition-all ${
                                !canReceiveGift
                                  ? 'bg-slate-50 text-slate-400 cursor-not-allowed'
                                  : !user.IsGiftReceived
                                    ? 'bg-amber-500 text-white hover:bg-amber-600'
                                    : 'bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              Pending
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftStatusPage;