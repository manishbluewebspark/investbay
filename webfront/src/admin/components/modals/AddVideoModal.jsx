// import { X, Upload } from "lucide-react";
// import { useState, useRef } from "react";

// const AddVideoModal = ({ isOpen, onClose, courseId, userId }) => {
//   if (!isOpen) return null;

//   const [videoTitle, setVideoTitle] = useState("");
//   const [videoDuration, setVideoDuration] = useState("");
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const fileInputRef = useRef(null);

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file && file.type.startsWith('video/')) {
//       setSelectedFile(file);
//     }
//   };

//   const handleClickUpload = () => {
//     fileInputRef.current?.click();
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (file && file.type.startsWith('video/')) {
//       setSelectedFile(file);
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   const handleSubmit = async () => {
//     if (!videoTitle || !videoDuration || !selectedFile || !courseId || !userId) {
//       alert("Please fill all fields and select a video");
//       return;
//     }

//     setUploading(true);
//     const formData = new FormData();
//     formData.append('videoFile', selectedFile);
//     formData.append('courseId', courseId);
//     formData.append('userId', userId);
//     formData.append('videoTitle', videoTitle);
//     formData.append('videoDuration', videoDuration);

//     try {
//       const response = await fetch(`${apiUrl}/videos/add-videos`, {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {
//         alert("Video added successfully!");
//         onClose();
//         // Reset form
//         setVideoTitle("");
//         setVideoDuration("");
//         setSelectedFile(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//       } else {
//         alert("Failed to add video");
//       }
//     } catch (error) {
//       alert("Error uploading video");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">
//         {/* Header */}
//         <div className="flex items-center justify-between border-b px-6 py-4 border-gray-300">
//           <h2 className="text-lg font-semibold text-gray-800">Add Video</h2>
//           <button
//             onClick={onClose}
//             className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
//             disabled={uploading}
//           >
//             <X size={18} />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="px-6 py-5 space-y-5">
//           {/* Inputs */}
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="text-sm text-gray-600">Video Title</label>
//               <input
//                 type="text"
//                 placeholder="Options Intraday Pro"
//                 className="mt-1 w-full rounded-lg border px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={videoTitle}
//                 onChange={(e) => setVideoTitle(e.target.value)}
//                 disabled={uploading}
//               />
//             </div>

//             <div>
//               <label className="text-sm text-gray-600">Video Duration</label>
//               <input
//                 type="text"
//                 placeholder="12 min"
//                 className="mt-1 w-full rounded-lg border px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={videoDuration}
//                 onChange={(e) => setVideoDuration(e.target.value)}
//                 disabled={uploading}
//               />
//             </div>
//           </div>

//           {/* Hidden File Input */}
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept="video/*"
//             onChange={handleFileSelect}
//             className="hidden"
//           />

//           {/* Upload Box */}
//           <div 
//             className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
//               selectedFile 
//                 ? "border-green-400 bg-green-50" 
//                 : "border-gray-300 hover:border-gray-400"
//             }`}
//             onDrop={handleDrop}
//             onDragOver={handleDragOver}
//             onClick={handleClickUpload}
//           >
//             <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
//               <Upload size={20} className="text-gray-600" />
//             </div>

//             {selectedFile ? (
//               <>
//                 <p className="text-sm font-medium text-green-700 mb-1">{selectedFile.name}</p>
//                 <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
//               </>
//             ) : (
//               <p className="text-sm text-gray-600">
//                 <span className="text-blue-600 cursor-pointer font-medium hover:underline">
//                   Click here
//                 </span>{" "}
//                 or drop video here
//               </p>
//             )}
//           </div>

        
//         </div>

//         {/* Footer */}
//         <div className="flex items-center justify-end gap-3 border-t border-gray-300 px-6 py-4">
//           <button
//             onClick={onClose}
//             className="rounded-lg border border-gray-300 px-12 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
//             disabled={uploading}
//           >
//             Cancel
//           </button>
//           <button 
//             onClick={handleSubmit}
//             disabled={!videoTitle || !videoDuration || !selectedFile || uploading}
//             className="rounded-lg bg-black px-12 py-2 text-sm text-white hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
//           >
//             {uploading ? "Uploading..." : "Next"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddVideoModal;


import { X, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

const AddVideoModal = ({ isOpen, onClose, courseId, userId }) => {
  if (!isOpen) return null;

  const [videoTitle, setVideoTitle] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [durationCalculating, setDurationCalculating] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL;
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Function to calculate video duration
  const calculateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('video/')) {
        reject(new Error('Not a video file'));
        return;
      }

      // Create video element
      const video = document.createElement('video');
      
      // Create object URL
      const videoURL = URL.createObjectURL(file);
      video.src = videoURL;
      
      // Load metadata
      video.onloadedmetadata = () => {
        // Revoke object URL to free memory
        URL.revokeObjectURL(videoURL);
        
        const durationInSeconds = video.duration;
        resolve(durationInSeconds);
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(videoURL);
        reject(new Error('Could not load video metadata'));
      };
      
      // Preload metadata only (not the whole video)
      video.preload = 'metadata';
    });
  };

  // Format duration from seconds to "HH:MM:SS" or "MM:SS"
  const formatDuration = (seconds) => {
    if (!seconds && seconds !== 0) return "0 min";
    
    const totalSeconds = Math.round(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else if (minutes > 0) {
      return `${minutes} min ${secs > 0 ? `${secs} sec` : ''}`;
    } else {
      return `${secs} sec`;
    }
  };

  // Format duration for display
  const formatDurationForDisplay = (seconds) => {
    const totalSeconds = Math.round(seconds);
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    
    if (minutes === 0) {
      return `${secs} sec`;
    } else if (secs === 0) {
      return `${minutes} min`;
    } else {
      return `${minutes} min ${secs} sec`;
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      
      // Auto-calculate duration
      setDurationCalculating(true);
      try {
        const durationInSeconds = await calculateVideoDuration(file);
        setVideoDuration(formatDurationForDisplay(durationInSeconds));
        
        // You can also save the raw seconds for database
        // const durationSeconds = Math.round(durationInSeconds);
      } catch (error) {
        console.error("Could not calculate video duration:", error);
        // Let user enter manually
        setVideoDuration("");
      } finally {
        setDurationCalculating(false);
      }
    }
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      
      // Auto-calculate duration
      setDurationCalculating(true);
      try {
        const durationInSeconds = await calculateVideoDuration(file);
        setVideoDuration(formatDurationForDisplay(durationInSeconds));
      } catch (error) {
        console.error("Could not calculate video duration:", error);
        setVideoDuration("");
      } finally {
        setDurationCalculating(false);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    if (!videoTitle || !videoDuration || !selectedFile || !courseId || !userId) {
      alert("Please fill all fields and select a video");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('videoFile', selectedFile);
    formData.append('courseId', courseId);
    formData.append('userId', userId);
    formData.append('videoTitle', videoTitle);
    
    // Extract minutes and seconds from formatted duration
    let durationInSeconds = 0;
    if (videoDuration.includes('min')) {
      const parts = videoDuration.split('min');
      const minutes = parseInt(parts[0]) || 0;
      let seconds = 0;
      
      if (parts[1] && parts[1].includes('sec')) {
        const secPart = parts[1].split('sec')[0];
        seconds = parseInt(secPart) || 0;
      }
      
      durationInSeconds = (minutes * 60) + seconds;
    } else if (videoDuration.includes('sec')) {
      const secPart = videoDuration.split('sec')[0];
      durationInSeconds = parseInt(secPart) || 0;
    } else {
      // Try to parse as plain number (assuming minutes)
      const minutes = parseInt(videoDuration) || 0;
      durationInSeconds = minutes * 60;
    }
    
    formData.append('videoDuration', durationInSeconds.toString());

    try {
      const response = await fetch(`${apiUrl}/videos/add-videos`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success(result.message || "Video added successfully!");
        onClose();
        // Reset form
        setVideoTitle("");
        setVideoDuration("");
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        // Optionally refresh the page or update video list
        window.location.reload();
      } else {
        toast.error(result.message || "Failed to add video");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Error uploading video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4 border-gray-300">
          <h2 className="text-lg font-semibold text-gray-800">Add Video</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            disabled={uploading}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Video Title</label>
              <input
                type="text"
                placeholder="Options Intraday Pro"
                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                disabled={uploading}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Video Duration</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={durationCalculating ? "Calculating..." : "Auto-detected or enter manually"}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={videoDuration}
                  onChange={(e) => setVideoDuration(e.target.value)}
                  disabled={uploading || durationCalculating}
                />
                {durationCalculating && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              {selectedFile && !durationCalculating && !videoDuration && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Could not auto-detect duration. Please enter manually (e.g., "12 min")
                </p>
              )}
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload Box */}
          <div 
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-200 ${
              selectedFile 
                ? "border-gray-300 bg-gray-50" 
                : "border-gray-300 hover:border-gray-400"
            } ${durationCalculating ? "cursor-wait" : "cursor-pointer"}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={!durationCalculating ? handleClickUpload : undefined}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              {durationCalculating ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              ) : (
                <Upload size={20} className="text-gray-600" />
              )}
            </div>

            {selectedFile ? (
              <>
                <p className="text-sm font-medium  mb-1">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  {videoDuration && !durationCalculating && ` • ${videoDuration}`}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                <span className="text-blue-600 cursor-pointer font-medium hover:underline">
                  Click here
                </span>{" "}
                or drop video here
              </p>
            )}
            
            {durationCalculating && (
              <p className="text-xs text-blue-600 mt-2">
                Detecting video duration...
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-300 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-12 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={!videoTitle || !videoDuration || !selectedFile || uploading || durationCalculating}
            className="rounded-lg bg-black px-12 py-2 text-sm text-white hover:bg-gray-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {uploading ? "Uploading..." : "Add Video"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVideoModal;