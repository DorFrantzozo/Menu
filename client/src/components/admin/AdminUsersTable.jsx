import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/baseUrl";
import { toast } from "react-toastify";
import AdminUserRow from "./AdminUserRow";

export default function AdminUsersTable() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axiosInstance.get('/admin/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
   
        
        // Check if response payload is wrapped differently
        let items = response.data;
        console.log(response.data);
        if (response.data && !Array.isArray(response.data) && Array.isArray(response.data.stats)) {
          items = response.data.stats;
        } else if (response.data === "string" || typeof response.data === "string") {
           console.error("GOT A STRING. HTML PAGE MAYBE?");
           items = []; // Prevent crash
        }
        
        // Sort users by scans by default (descending)
        const sorted = (Array.isArray(items) ? items : []).sort((a, b) => (b.totalQrScans || 0) - (a.totalQrScans || 0));
        setUsers(sorted);
        setFilteredUsers(sorted);
      } catch (err) {
        console.error("Failed to fetch admin dashboard stats:", err);
        setError("Failed to load users data");
        toast.error("Failed to load users data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Handle Search Filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = users.filter((user) => 
      (user.restaurantName || "").toLowerCase().includes(lowerQuery) ||
      (user.email || "").toLowerCase().includes(lowerQuery) ||
      (user._id || "").toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Handle Status Change from Row
  const handleStatusUpdate = (userId, newIsPaid) => {
    setUsers((prev) => 
      prev.map(u => u._id === userId ? { ...u, isPaid: newIsPaid } : u)
    );
  };

  const handleUserUpdated = (userId, updatedFields) => {
    setUsers((prev) => 
      prev.map(u => u._id === userId ? { ...u, ...updatedFields } : u)
    );
  };

  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 text-red-500 rounded-3xl border border-red-100 shadow-sm p-8 text-center font-medium">
        {error}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center text-slate-500 font-medium">
        No users found in the system.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
      
      {/* Table Header Section */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Users Dashboard</h2>
          <p className="text-sm text-slate-500 mt-1">Manage all restaurants and view their performance</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-grow md:flex-grow-0 md:min-w-[300px]">
            <input 
              type="text" 
              placeholder="Search by name, email, or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-slate-500 focus:border-slate-500 block pl-10 p-2.5 transition-colors placeholder:text-slate-400"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>

          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2 whitespace-nowrap">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total</span>
            <span className="text-lg font-black text-slate-900">{filteredUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 w-1/4">Restaurant</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">User ID</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Status</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Plan</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 w-[10%]">Digital Menu</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center w-[8%]">Scans</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 w-[10%]">Created</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 w-[10%]">Last Login</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 w-[10%]">Trial Ends</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-center w-[8%]">Menu Size</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 text-right w-[10%]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <AdminUserRow 
                key={user._id} 
                user={user} 
                onStatusUpdate={handleStatusUpdate} 
                onUserUpdated={handleUserUpdated}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
