import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

// Configure Axios Defaults
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

// Category mapping helper
const categoryMap = {
  'Road': 'potholes',
  'Water': 'water leakage',
  'Sanitation': 'garbage overflow',
  'Electricity': 'broken streetlights',
  'Traffic': 'traffic hazards',
  'Other': 'traffic hazards'
};

const mapApiIssueToFrontend = (apiIssue, currentUserId) => {
  const createdDate = new Date(apiIssue.createdAt).toISOString().split('T')[0];
  const updatedDate = new Date(apiIssue.updatedAt).toISOString().split('T')[0];
  
  // Dynamic status timeline events
  const timeline = [
    { status: "Reported", date: createdDate, description: "Issue submitted and successfully scanned by CivicAI Core.", updater: "System AI" }
  ];
  if (apiIssue.status === 'Verified' || apiIssue.status === 'In Progress' || apiIssue.status === 'Resolved') {
    timeline.push({ status: "Verified", date: createdDate, description: "Civic inspection completed. Incident details verified.", updater: "Inspector Agent" });
  }
  if (apiIssue.status === 'In Progress' || apiIssue.status === 'Resolved') {
    timeline.push({ status: "In Progress", date: createdDate, description: "Maintenance crew dispatched. Repairs active.", updater: "City Dispatcher" });
  }
  if (apiIssue.status === 'Resolved') {
    timeline.push({ status: "Resolved", date: updatedDate, description: "Repairs completed and site safety confirmed.", updater: "Maintenance Crew" });
  }

  return {
    id: apiIssue._id,
    title: apiIssue.title,
    description: apiIssue.description || apiIssue.title,
    image: apiIssue.imageUrl || "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&w=800&q=80",
    category: categoryMap[apiIssue.category] || apiIssue.category?.toLowerCase() || 'traffic hazards',
    severity: apiIssue.severity || 'Medium',
    priorityScore: Math.min(100, ((apiIssue.priorityScore || 2) * 25) + ((apiIssue.reporters?.length || 0) * 5)), // Base severity priority + support count upvote bonus
    aiSummary: apiIssue.aiSummary || "AI scan completed.",
    status: apiIssue.status || 'Reported',
    lat: apiIssue.latitude,
    lng: apiIssue.longitude,
    reporterName: apiIssue.createdBy?.name || "Citizen User",
    reporterEmail: apiIssue.createdBy?.email || "citizen@example.com",
    reportsCount: apiIssue.reportsCount || 1,
    supportCount: apiIssue.reporters?.length || 0,
    supportedBy: apiIssue.reporters || [],
    date: createdDate,
    timeline: timeline
  };
};

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = async () => {
    try {
      const response = await axios.get('/issues');
      if (response.data.success) {
        const mapped = response.data.issues.map(i => mapApiIssueToFrontend(i));
        setIssues(mapped);
      }
    } catch (err) {
      console.error("Failed to fetch issues from backend API:", err.message);
    }
  };

  const checkUserSession = async () => {
    try {
      const response = await axios.get('/auth/me');
      if (response.data.success) {
        const user = response.data.user;
        setCurrentUser({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role?.toLowerCase() || 'citizen'
        });
      }
    } catch (err) {
      // Not logged in or expired token
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();
    fetchIssues();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      if (response.data.success) {
        // Fetch full profile info
        const meRes = await axios.get('/auth/me');
        if (meRes.data.success) {
          const user = {
            id: meRes.data.user._id,
            name: meRes.data.user.name,
            email: meRes.data.user.email,
            role: meRes.data.user.role?.toLowerCase() || 'citizen'
          };
          setCurrentUser(user);
          await fetchIssues();
          return user;
        }
      }
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Invalid credentials");
    }
  };

  const signup = async (name, email, password, role,adminSecretkey) => {
    try {
      const backendRole = role === 'admin' ? 'admin' : 'citizen';
      const response = await axios.post("/auth/signup", {
  name,
  email,
  password,
  role: backendRole,
  adminSecretkey,
});;
      
      if (response.data.success) {
        // Automatically login
        return await login(email, password);
      }
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      setCurrentUser(null);
    }
  };

  const addIssue = async (title, description, imageFileOrUrl, lat, lng) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('latitude', lat);
      formData.append('longitude', lng);
      
      if (imageFileOrUrl) {
        if (typeof imageFileOrUrl === 'string' && imageFileOrUrl.startsWith('http')) {
          // If it is a preset URL, fetch and convert to a File blob
          const response = await fetch(imageFileOrUrl);
          const blob = await response.blob();
          const file = new File([blob], 'preset.jpg', { type: blob.type || 'image/jpeg' });
          formData.append('image', file);
        } else {
          // It's a raw File object from the file input
          formData.append('image', imageFileOrUrl);
        }
      }
      
      const response = await axios.post('/issues', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        await fetchIssues(); // Refresh list
        return response.data.issue;
      }
    } catch (error) {
      console.error("Failed to add issue:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to submit report");
    }
  };

  const toggleSupport = async (issueId) => {
    if (!currentUser) return;
    try {
      const response = await axios.post(`/issues/${issueId}/support`);
      if (response.data.success) {
        await fetchIssues(); // Refresh issues
      }
    } catch (error) {
      console.error("Failed to toggle support:", error.response?.data || error.message);
    }
  };

  const updateIssueStatus = async (issueId, newStatus, adminNotes) => {
    try {
      const response = await axios.patch(`/issues/${issueId}/status`, {
        status: newStatus
      });
      if (response.data.success) {
        await fetchIssues(); // Refresh
      }
    } catch (error) {
      console.error("Failed to update status:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "Failed to update status");
    }
  };

  const getUserScore = () => {
    if (!currentUser) return { points: 0, level: 1, title: "Guest" };
    
    const userId = currentUser.id;
    const userReports = issues.filter(issue => issue.reporterEmail === currentUser.email).length;
    const userSupports = issues.filter(issue => issue.supportedBy.includes(userId)).length;
    
    const points = 100 + (userReports * 50) + (userSupports * 15);
    const level = Math.floor(points / 200) + 1;
    
    let title = "Civic Novice";
    if (points >= 800) title = "Civic Champion";
    else if (points >= 500) title = "Civic Guardian";
    else if (points >= 300) title = "Civic Activist";
    else if (points >= 150) title = "Civic Helper";
    
    const nextLevelPoints = level * 200;
    const prevLevelPoints = (level - 1) * 200;
    const progress = ((points - prevLevelPoints) / (nextLevelPoints - prevLevelPoints)) * 100;

    return {
      points,
      level,
      title,
      progress,
      reportsCount: userReports,
      supportsCount: userSupports,
      nextLevelPoints
    };
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      issues,
      loading,
      login,
      signup,
      logout,
      addIssue,
      toggleSupport,
      updateIssueStatus,
      getUserScore
    }}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
