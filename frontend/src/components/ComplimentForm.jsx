import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

const ComplimentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wereda: '',
    topic: '',
    message: '',
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldMap = {
      'comp-name': 'name',
      'comp-phone': 'phone',
      'comp-wereda': 'wereda',
      'comp-topic': 'topic',
      'comp-message': 'message'
    };
    if (fieldMap[id]) {
      setFormData((prev) => ({ ...prev, [fieldMap[id]]: value }));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return null;

    try {
      // 1. Compression
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // 2. Upload
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `compliments/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        setIsUploading(true);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload error:", error);
          setIsUploading(false);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setIsUploading(false);
          resolve(downloadURL);
        }
      );
      });
    } catch (error) {
      console.error("Compression error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Upload File first
      const fileUrl = await uploadFile();

      const dataToSubmit = {
        ...formData,
        fileUrl: fileUrl || null,
        timestamp: new Date().toISOString()
      };
      
      await addDoc(collection(db, "compliments"), dataToSubmit);
      
      alert('Thank you for your compliment! We appreciate your feedback. (አድናቆትዎ በትክክል ተልኳል)');
      
      // Reset form
      setFormData({ name: '', phone: '', wereda: '', topic: '', message: '' });
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error saving compliment: ", error);
      alert("Error submitting compliment. Please check your connection.");
      setIsUploading(false);
    }
  };

  return (
    <section id="compliment" className="bg-white p-8 md:p-12 rounded-2xl shadow-md max-w-[800px] mx-auto border border-gray-100 transition-all hover:shadow-lg">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-greenTint rounded-full flex items-center justify-center text-4xl shadow-inner border border-white/50 animate-float">🌟</div>
      </div>
      
      <p className="text-center text-textLight mb-10 text-lg font-light leading-relaxed">
        Did one of our officers do a great job? Have you noticed improvements in your area? Let us know below!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="comp-name" className="block font-semibold mb-2 text-textDark text-sm">👤 Full Name (Optional)</label>
            <input 
              type="text" id="comp-name" placeholder="Enter your name" 
              value={formData.name} onChange={handleChange}
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-sans" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="comp-phone" className="block font-semibold mb-2 text-textDark text-sm">📱 Your Phone (ስልክ ቁጥር) </label>
            <input 
              type="tel" id="comp-phone" placeholder="+251..." 
              required value={formData.phone} onChange={handleChange}
              className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all outline-none font-sans" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="comp-wereda" className="block font-semibold mb-2 text-textDark text-sm">Select Woreda (ወረዳ)</label>
            <select id="comp-wereda" required value={formData.wereda} onChange={handleChange} className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-white outline-none font-sans">
              <option value="">Choose Woreda-- </option>
              <option value="1">ወረዳ 01</option>
              <option value="2">ወረዳ 02</option>
              <option value="4">ወረዳ 04</option>
              <option value="5">ወረዳ 05</option>
              <option value="6">ወረዳ 06</option>
              <option value="7">ወረዳ 07</option>
              <option value="8">ወረዳ 08</option>
              <option value="9">ወረዳ 09</option>
              <option value="all">Sub-City General (በአጠቃላይ)</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="comp-topic" className="block font-semibold mb-2 text-textDark text-sm">Compliment Topic (ርዕስ)</label>
            <select id="comp-topic" required value={formData.topic} onChange={handleChange} className="w-full p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all bg-white outline-none font-sans">
              <option value="">-- Select Topic -- </option>
              <option value="officer">Excellent Service by an Officer</option>
              <option value="cleanliness">Improved Area Cleanliness</option>
              <option value="response">Fast Response Time</option>
              <option value="other">Other (ሌላ)</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comp-message" className="block font-semibold mb-2 text-textDark text-sm">Message (መልእክት)</label>
          <textarea 
            id="comp-message" placeholder="Share your positive feedback..." 
            required value={formData.message} onChange={handleChange}
            className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all min-h-[150px] resize-y outline-none font-sans"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="comp-file" className="block font-semibold mb-2 text-textDark text-sm">🖇️ Attach Evidence (ፎቶ ወይም ሰነድ - Optional)</label>
          <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-colors group">
            <input
              type="file"
              id="comp-file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="text-center">
              <div className="text-4xl mb-2 text-gray-400 group-hover:text-primary transition-colors">📸</div>
              <p className="text-textLight font-medium">
                {file ? file.name : "Click or drag to upload photo (Optional)"}
              </p>
            </div>
          </div>
          {isUploading && (
            <div className="mt-4">
              <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-primary mt-2 flex justify-between">
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </p>
            </div>
          )}
        </div>

        <div className="text-center pt-4">
          <button 
            type="submit" 
            disabled={isUploading}
            className={`btn min-w-[280px] py-4 shadow-lg hover:shadow-xl ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isUploading ? 'Sending...' : 'Send Compliment (አድናቆት ላክ)'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ComplimentForm;
