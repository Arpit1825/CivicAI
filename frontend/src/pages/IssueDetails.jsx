import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import StatusBadge from '../components/StatusBadge';
import { 
  ThumbsUp, 
  MapPin, 
  Calendar, 
  User, 
  ArrowLeft, 
  Sparkles, 
  Lock,
  MessageSquare,
  Send,
  AlertTriangle
} from 'lucide-react';

export default function IssueDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, currentUser, toggleSupport, updateIssueStatus } = useApp();

  const issue = issues.find(i => i.id === id);
  const [commentText, setCommentText] = useState('');
  const [address, setAddress] = useState("Loading location...");

  const [navigationActive, setNavigationActive] = useState(false);
  const [routeCoords, setRouteCoords] = useState(null);
  const [navigationSteps, setNavigationSteps] = useState([]);
  const [navMeta, setNavMeta] = useState({ distance: 0, duration: 0 });
  const [navLoading, setNavLoading] = useState(false);
  const [navError, setNavError] = useState("");

  const handleGetDirections = () => {
    setNavLoading(true);
    setNavError("");
    
    if (!navigator.geolocation) {
      setNavError("Geolocation is not supported by your browser.");
      setNavLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchRoute(latitude, longitude);
      },
      (error) => {
        console.error(error);
        setNavLoading(false);
        setNavError("Could not retrieve your location. Please check browser permissions.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const fetchRoute = async (startLat, startLng) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${issue.lng},${issue.lat}?overview=full&geometries=geojson&steps=true`
      );
      const data = await response.json();

      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Convert [lng, lat] from OSRM to [lat, lng] for Leaflet
        const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
        
        const steps = route.legs[0].steps.map(step => ({
          instruction: step.maneuver.instruction,
          distance: step.distance,
          duration: step.duration
        }));
        
        setNavigationSteps(steps);
        setNavMeta({
          distance: (route.distance / 1000).toFixed(1), // in km
          duration: Math.round(route.duration / 60) // in minutes
        });
        setNavigationActive(true);
      } else {
        setNavError("No driving route found to this location.");
      }
    } catch (err) {
      console.error(err);
      setNavError("Failed to calculate route guide from server.");
    } finally {
      setNavLoading(false);
    }
  };

  const handleResetRoute = () => {
    setNavigationActive(false);
    setRouteCoords(null);
    setNavigationSteps([]);
    setNavMeta({ distance: 0, duration: 0 });
    setNavError("");
  };

  useEffect(() => {
    if (!issue || !issue.lat || !issue.lng) return;

    let isMounted = true;
    
    // Fetch reverse geocoding from OpenStreetMap Nominatim API
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${issue.lat}&lon=${issue.lng}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          const displayName = data.display_name || data.name || `${issue.lat.toFixed(4)}, ${issue.lng.toFixed(4)}`;
          // Format address nicely (take the first 3 parts of the display name)
          const formattedAddress = displayName.split(',').slice(0, 3).join(',').trim();
          setAddress(formattedAddress || `Civic Zone (${issue.lat.toFixed(4)}, ${issue.lng.toFixed(4)})`);
        }
      })
      .catch(err => {
        console.error("Reverse geocoding failed:", err);
        if (isMounted) {
          setAddress(`Civic Zone (${issue.lat.toFixed(4)}, ${issue.lng.toFixed(4)})`);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [issue]);
  const [comments, setComments] = useState([
    { id: 1, author: 'Ronny Singh', text: 'This is getting worse every morning. Hope the crews get to Elm St fast.', date: '2026-06-21', role: 'citizen' },
    { id: 2, author: 'Officer Ram', text: 'Road inspector has officially verified the report size. Queue priority updated.', date: '2026-06-22', role: 'admin' }
  ]);

  if (!issue) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-slate-200/80 max-w-md mx-auto shadow-xs">
        <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">Issue not found</h3>
        <p className="text-xs text-slate-400 mt-1">The issue might have been resolved or deleted.</p>
        <button onClick={() => navigate('/')} className="mt-4 bg-blue-600 text-white font-semibold text-xs py-2 px-4 rounded-xl">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isSupported = currentUser ? issue.supportedBy.includes(currentUser.id) : false;
  const isAdmin = currentUser?.role === 'admin';

  const handleSupportClick = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    toggleSupport(issue.id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: currentUser?.name || 'Anonymous',
      text: commentText,
      date: new Date().toISOString().split('T')[0],
      role: currentUser?.role || 'citizen'
    };

    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div>
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to list
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image, Details, comments */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Details Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
            {/* Main Visual Image */}
            <div className="relative h-64 sm:h-80 bg-slate-100 overflow-hidden">
              <img src={issue.image} alt={issue.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block text-[10px] font-bold text-blue-300 uppercase tracking-widest bg-blue-900/40 border border-blue-400/20 px-2.5 py-0.5 rounded-full mb-2.5 backdrop-blur-xs">
                  {issue.category.replace('-', ' ')}
                </span>
                <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight">{issue.title}</h2>
              </div>
            </div>

            {/* Content info grid */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Metadata rows */}
              <div className="flex flex-wrap items-center gap-y-4 gap-x-6 pb-5 border-b border-slate-100 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-50 border border-slate-100 rounded-md py-1.5 px-3">
                  <User className="h-4 w-4 text-slate-400" /> Reporter: {issue.reporterName}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" /> Reported: {issue.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" /> {address}
                </span>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Citizen Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {issue.description}
                </p>
              </div>

              {/* Citizen Interaction controls */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50/50 -mx-6 -mb-6 p-6">
                <div className="text-slate-500 text-xs">
                  <span className="font-bold text-slate-800 text-sm">{issue.supportCount}</span> citizens supported this issue, upvoted <span className="font-bold text-slate-800">{issue.reportsCount}</span> times.
                </div>

                {!isAdmin && (
                  <button
                    onClick={handleSupportClick}
                    className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl font-bold text-sm transition-all duration-200 shadow-md ${
                      isSupported
                        ? 'bg-blue-600 text-white shadow-blue-500/10'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <ThumbsUp className={`h-4.5 w-4.5 ${isSupported ? 'fill-current text-white animate-pulse' : 'text-slate-500'}`} />
                    <span>{isSupported ? 'Supported' : 'Support Issue'}</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Location Map Pinpoint Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Geographic Location</h3>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${issue.lat},${issue.lng}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold text-slate-600 hover:text-blue-600 flex items-center gap-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-2 py-1 rounded-lg transition-all cursor-pointer select-none"
              >
                External GPS Map
              </a>
            </div>

            <div className="h-[300px] relative rounded-xl overflow-hidden border border-slate-100 mb-3">
              <InteractiveMap 
                center={[issue.lat, issue.lng]}
                zoom={15}
                issues={[issue]}
                readOnly={true}
                selectedPosition={{ lat: issue.lat, lng: issue.lng }}
                routeCoordinates={routeCoords}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium mb-3">
              <span>📍 Lat: {issue.lat.toFixed(6)}, Lng: {issue.lng.toFixed(6)}</span>
              <span>OSM Navigator</span>
            </div>

            {/* Navigation controls */}
            <div className="space-y-3">
              {!navigationActive ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handleGetDirections}
                    disabled={navLoading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    {navLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Calculating Route...</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Start built-in Journey (Directions Guide)</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 space-y-3 animate-fadeIn text-left">
                  <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/50">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Est. Driving Guide</span>
                      <span className="text-sm font-black text-slate-800">
                        🚗 {navMeta.distance} km &bull; {navMeta.duration} mins
                      </span>
                    </div>
                    <button
                      onClick={handleResetRoute}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Exit Navigation
                    </button>
                  </div>

                  {/* Scrollable Navigation Steps */}
                  <div className="max-h-[180px] overflow-y-auto space-y-2.5 pr-1">
                    {navigationSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-2.5 text-xs text-left">
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="h-5 w-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </div>
                          {idx < navigationSteps.length - 1 && (
                            <div className="w-0.5 bg-slate-200 flex-1 my-1"></div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-700">{step.instruction}</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {step.distance > 1000 
                              ? `${(step.distance / 1000).toFixed(1)} km` 
                              : `${Math.round(step.distance)} meters`
                            } &bull; {Math.round(step.duration)} seconds
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {navError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 text-left font-medium">
                  ⚠️ {navError}
                </div>
              )}
            </div>
          </div>

          {/* Comments/Discussions Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-blue-600" /> Public Discussion ({comments.length})
            </h3>
            
            {/* Comment inputs */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share coordinates update or comment..."
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 flex items-center justify-center transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {/* Comment logs list */}
            <div className="divide-y divide-slate-100 space-y-3 pt-3">
              {comments.map((comment) => (
                <div key={comment.id} className="pt-3 text-xs flex gap-3 text-left">
                  <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center flex-shrink-0">
                    {comment.author[0]}
                  </div>
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">{comment.author}</span>
                      <span className="text-[9px] text-slate-400">{comment.date}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        comment.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {comment.role}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI details card, Status Timeline */}
        <div className="space-y-6">
          
          {/* AI Info Preview Card */}
          <div className="bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 rounded-2xl p-5 shadow-xs relative overflow-hidden">
            <div className="absolute -right-8 -top-8 bg-blue-600/5 w-24 h-24 rounded-full pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                <Sparkles className="h-3 w-3" />
                <span>AI Analyzed</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                <Lock className="h-3 w-3" /> Verified Data
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Priority Index</span>
                  <span className="text-2xl font-black text-slate-800">{issue.priorityScore}%</span>
                </div>
                <div className="h-10 w-10 rounded-full border-4 border-blue-600 flex items-center justify-center text-[10px] font-bold text-blue-700 bg-blue-50">
                  {issue.priorityScore}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Category</span>
                  <span className="text-xs font-bold text-slate-800 capitalize">{issue.category.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Severity</span>
                  <StatusBadge type="severity" value={issue.severity} />
                </div>
              </div>

              <div className="p-3 bg-blue-600/5 border border-blue-500/10 rounded-xl text-[11px] text-blue-900 leading-relaxed">
                <span className="font-bold block mb-0.5">AI Scan Notes</span>
                {issue.aiSummary}
              </div>
            </div>
          </div>

          {/* Status Timeline Progress Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-3 border-b border-slate-100">Status History</h3>
            
            <div className="relative pl-6 space-y-5 border-l-2 border-slate-100">
              {issue.timeline.map((event, idx) => {
                const isLatest = idx === issue.timeline.length - 1;
                
                return (
                  <div key={idx} className="relative text-left">
                    {/* Ring dot indicator */}
                    <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                      isLatest ? 'bg-blue-600 ring-4 ring-blue-500/15' : 'bg-slate-300'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-xs font-bold ${isLatest ? 'text-slate-800 font-extrabold' : 'text-slate-500'}`}>
                          {event.status}
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">({event.date})</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{event.description}</p>
                      <span className="text-[9px] text-slate-400 block font-semibold">Updated by {event.updater}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
