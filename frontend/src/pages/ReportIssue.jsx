import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import StatusBadge from '../components/StatusBadge';
import { 
  Sparkles, 
  MapPin, 
  Upload, 
  ChevronRight, 
  ChevronLeft, 
  ShieldAlert, 
  Lock,
  Loader2,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { createIssue } from "../services/issueService";
const MOCK_IMAGE_PRESETS = [
  {
    name: 'Road Pothole',
    url: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=800&q=80',
    description: 'Deep road cavity on traffic lane'
  },
  {
    name: 'Water Main Leak',
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    description: 'Pressurized water bubbling from sidewalk'
  },
  {
    name: 'Garbage Overflow',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80',
    description: 'Public bins spilling refuse near walkway'
  },
  {
    name: 'Broken Streetlight',
    url: 'https://images.unsplash.com/photo-1509021436665-8f37da1859dd?auto=format&fit=crop&w=800&q=80',
    description: 'Unlit streetlight corner at night'
  }
];

export default function ReportIssue() {
  const navigate = useNavigate();

  // Wizard Steps
  const [step, setStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [rawFile, setRawFile] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  
  // Location State
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [address, setAddress] = useState('');

  // AI Loading & Results
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResults, setAiResults] = useState(null);

  // Error States
  const [error, setError] = useState('');

  // Geolocation detector state
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Simulation coordinates for default
  const defaultCityCenter = { lat: 40.730610, lng: -73.935242 };

 const handleDetectLocation = async () => {
  setDetectingLocation(true);
  setError("");

  if (!navigator.geolocation) {
    setError("Geolocation is not supported by your browser.");
    setDetectingLocation(false);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      setLat(latitude);
      setLng(longitude);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        console.log(data);

        setAddress(data.display_name);
      } catch (err) {
        console.error("Reverse Geocoding Error:", err);
      }

      setDetectingLocation(false);
    },
    (err) => {
      console.error(err);
      setError("Failed to capture GPS.");

      setDetectingLocation(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

  // Set mock address when location changes
useEffect(() => {
  if (!lat || !lng) return;

  const fetchAddress = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await response.json();

      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error("Reverse Geocoding Error:", err);
      setAddress("Unable to fetch address");
    }
  };

  fetchAddress();
}, [lat, lng]);

const submitForAI = async () => {
  try {
    setAiAnalyzing(true);
    setAiResults(null);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("latitude", lat);
    formData.append("longitude", lng);

    if (rawFile) {
      formData.append("image", rawFile);
    }
const priorityMap = {
  Low: 30,
  Medium: 60,
  High: 85,
  Critical: 100,
};
    const response = await createIssue(formData);

  setAiResults({
  category: response.issue.category,
  severity: response.issue.severity,
  aiSummary: response.issue.aiSummary,
  priorityScore: priorityMap[response.issue.severity] || 50,
});
  } catch (err) {
    setError(err.response?.data?.message || "Failed to analyze issue.");
  } finally {
    setAiAnalyzing(false);
  }
};

  const handleNext = () => {
    setError('');

    if (step === 1) {
      if (!title.trim()) {
        setError('Please provide a title for the issue.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!image) {
        setError('Please upload an image or choose one of our quick presets to simulate a photo report.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!lat || !lng) {
        setError('Please drop a pin on the map to specify the issue coordinates.');
        return;
      }
      
      // Enter AI Step and run the scanner simulator
      setStep(4);
submitForAI();
      
    }
  };

  const handleBack = () => {
    setError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedPreset(null);
      setRawFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset.name);
    setRawFile(null);
    setImage(preset.url);
  };

const handleMapClick = (clickLat, clickLng) => {
  setLat(clickLat);
  setLng(clickLng);
};

  const handleFinalSubmit = async () => {
      navigate('/dashboard');
  };

  const stepsList = [
    { num: 1, label: 'Issue Details' },
    { num: 2, label: 'Visual Proof' },
    { num: 3, label: 'Map Location' },
    { num: 4, label: 'AI Review' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Wizard Header Progress */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between">
          {stepsList.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center space-x-2.5">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  step === s.num
                    ? 'bg-blue-600 text-white ring-4 ring-blue-500/10'
                    : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                }`}>
                  {step > s.num ? <CheckCircle className="h-4.5 w-4.5" /> : s.num}
                </div>
                <span className={`hidden sm:inline text-xs font-bold ${
                  step === s.num ? 'text-slate-800' : 'text-slate-400 font-semibold'
                }`}>
                  {s.label}
                </span>
              </div>
              {idx < stepsList.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 transition-all duration-300 ${
                  step > s.num ? 'bg-emerald-600' : 'bg-slate-100'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Form content container */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs min-h-[400px] flex flex-col justify-between">
        
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: Details */}
        {step === 1 && (
          <div className="space-y-5 flex-1">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Identify the Problem</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Deep Pothole on Oak Ave intersection"
                  className="mt-1 block w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

            </div>
          </div>
        )}

        {/* STEP 2: Photo Verification */}
        {step === 2 && (
          <div className="space-y-5 flex-1">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Visual Proof</h3>
              <p className="text-xs text-slate-400 mt-0.5">Upload a photo of the incident or pick a dummy preset to simulate standard AI categorization.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Uploader */}
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-2xl flex flex-col items-center justify-center p-6 bg-slate-50/50 hover:bg-blue-50/10 cursor-pointer relative group transition-all min-h-[220px]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                
                {image && !selectedPreset ? (
                  <div className="w-full h-full absolute inset-0 p-2 bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                    <img src={image} alt="Uploaded preview" className="w-full h-full object-cover rounded-xl" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold rounded-xl">
                      Replace Photo
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-2 pointer-events-none">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Upload Image File</p>
                      <p className="text-xs text-slate-400">Drag & drop or browse device</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Presets Grid */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Or Select Preset for Sandbox Test</span>
                <div className="grid grid-cols-2 gap-2.5">
                  {MOCK_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-2 border rounded-xl flex flex-col items-start text-left transition-all ${
                        selectedPreset === preset.name
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/10'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-full h-16 rounded-lg bg-slate-100 overflow-hidden mb-1.5">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 block">{preset.name}</span>
                      <span className="text-[9px] text-slate-400 block line-clamp-1">{preset.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Map picker */}
        {step === 3 && (
          <div className="space-y-5 flex-1 flex flex-col min-h-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Pinpoint Location</h3>
                <p className="text-xs text-slate-400 mt-0.5">Locate the issue precisely by clicking on the map coordinates or using GPS.</p>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingLocation}
                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 disabled:bg-slate-50 disabled:text-slate-400 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 transition-colors self-start sm:self-auto"
              >
                {detectingLocation ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Accessing GPS...</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Use Current GPS</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 min-h-[300px] h-[350px] relative">
              <InteractiveMap 
                center={[defaultCityCenter.lat, defaultCityCenter.lng]}
                zoom={14}
                onMapClick={handleMapClick}
                selectedPosition={lat && lng ? { lat, lng } : null}
              />
            </div>

            {address && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center space-x-2">
                <MapPin className="h-4.5 w-4.5 text-blue-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-700 truncate">{address}</span>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: AI Analysis Simulator Card */}
        {step === 4 && (
          <div className="space-y-5 flex-1 flex flex-col justify-center items-center">
            
            {aiAnalyzing ? (
              <div className="text-center space-y-6 max-w-sm py-10">
                <div className="relative w-48 h-32 mx-auto rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <img src={image} alt="scanning source" className="w-full h-full object-cover" />
                  
                  {/* Glowing Laser Scan beam line */}
                  <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md shadow-blue-500/50 animate-scan"></div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex justify-center items-center gap-2 text-blue-600">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-bold tracking-wide uppercase">AI Engine Categorizing...</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed px-4">
                    Scanning pixel dimensions, density coefficients, and text keywords to auto-triage category and priority score.
                  </p>
                </div>
              </div>
            ) : (
              aiResults && (
                <div className="w-full space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-800">Gemini Vision Analysis Report</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
  Powered by <span className="font-semibold text-blue-600">Google Gemini Vision AI</span>, the platform automatically classNameifies civic issues, estimates severity, and generates an intelligent incident summary from the uploaded image.
</p>
                  </div>

                  {/* AI Card Preview */}
                  <div className="max-w-md mx-auto bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute -right-12 -top-12 bg-blue-600/5 w-32 h-32 rounded-full pointer-events-none"></div>
                    
                    {/* Header badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-200">
                        <Sparkles className="h-3 w-3" />
                        <span>Analyzed by Gemini Vision</span>
                      </div>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                        <Lock className="h-3.5 w-3.5" /> Checked & Locked
                      </span>
                    </div>

                    <div className="space-y-4">
                      {/* Priority Score circular ring gauge */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Priority</span>
                          <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{aiResults.priorityScore}</span>
                          <span className="text-xs text-slate-500 font-medium"> / 100 max index</span>
                        </div>
                        <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center border-4 border-blue-600">
                          <span className="text-sm font-bold text-blue-700">{aiResults.priorityScore}%</span>
                        </div>
                      </div>

                      {/* Triage Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Detected Category</span>
                          <span className="text-sm font-bold text-slate-800 capitalize">{aiResults.category.replace('-', ' ')}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Detected Severity</span>
                          <StatusBadge type="severity" value={aiResults.severity} />
                        </div>
                      </div>

                      {/* AI Summary paragraph */}
                      <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-3.5 text-xs text-blue-900 leading-relaxed">
                        <span className="font-bold block mb-1">AI Scan Summary</span>
                        {aiResults.aiSummary}
                      </div>

                      {/* Locked fields notice */}
                      <div className="flex gap-2 items-start text-[10px] text-slate-500 bg-slate-100 p-2.5 rounded-lg border border-slate-200">
                        <Lock className="h-4 w-4 text-slate-400 flex-shrink-0 mt-0.5" />
                        <span>Category and severity are automatically determined by Gemini Vision using the uploaded image and cannot be manually modified.</span>
                      </div>

                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Controls Footer */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex justify-between items-center">
          {step > 1 && step < 4 && !aiAnalyzing ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 hover:bg-slate-100 text-slate-600 text-sm font-semibold py-2 px-4 rounded-xl transition-all"
            >
              <ChevronLeft className="h-4.5 w-4.5" /> Back
            </button>
          ) : (
            <div></div> // Spacing placeholder
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-5 rounded-xl shadow-md transition-all duration-200"
            >
              Continue <ChevronRight className="h-4.5 w-4.5" />
            </button>
          ) : (
            !aiAnalyzing && (
              <button
                onClick={handleFinalSubmit}
                className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/15 transition-all duration-200 animate-pulse-slow"
              >
                Submit Civic Report <CheckCircle className="h-4.5 w-4.5" />
              </button>
            )
          )}
        </div>

      </div>
    </div>
  );
}
