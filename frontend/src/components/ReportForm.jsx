import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ReportForm = () => {
  const [formData, setFormData] = useState({
    reporterName: '',
    violationWereda: '',
    violationType: '',
    violationRule: '',
    penaltyAmount: '',
    dailyStatus: '',
    violationDescription: '',
  });

  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = () => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }

      const storageRef = ref(storage, `reports/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Upload File first if exists
      const fileUrl = await uploadFile();

      const newReportData = {
        ...formData,
        fileUrl: fileUrl || null,
        timestamp: new Date().toISOString(),
      };

      // 2. Save to Firestore
      await addDoc(collection(db, "reports"), newReportData);

      alert('Report Submitted Successfully! (ሪፖርቱ በትክክል ተልኳል)');
      
      // Reset form
      setFormData({
        reporterName: '',
        violationWereda: '',
        violationType: '',
        violationRule: '',
        penaltyAmount: '',
        dailyStatus: '',
        violationDescription: '',
      });
      setFile(null);
      setUploadProgress(0);
      setIsCustomAmount(false);
    } catch (error) {
      console.error("Error submitting report: ", error);
      alert("Error submitting report. Please check configuration.");
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <section id="report" className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-gray-100 mb-12 transition-all hover:shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="reporterName" className="block font-semibold mb-2 text-textDark">👤 Full Name (ሙሉ ስም)</label>
            <input
              type="text"
              id="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              placeholder="Enter name"
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans"
            />
          </div>

          <div className="form-group">
            <label htmlFor="violationWereda" className="block font-semibold mb-2 text-textDark">ወረዳ (Wereda)</label>
            <select
              id="violationWereda"
              value={formData.violationWereda}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-sans"
            >
              <option value="">ወረዳ--</option>
              {[1, 2, 4, 5, 6, 7, 8, 9].map((w) => (
                <option key={w} value={w}>ወረዳ 0{w}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="violationType" className="block font-semibold mb-2 text-textDark">የደንብ ጥሰት አይነት (Violation Type)</label>
            <select
              id="violationType"
              value={formData.violationType}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-sans"
            >
              <option value="">-- የደንብ ጥሰት አይነት--</option>
              <option value="zoning-land">ህገ ወጥ መሬት ወረራ ቁጥጥር</option>
              <option value="illegal-construction">ህገ ወጥ ግንባታ ቁጥጥር</option>
              <option value="zoning-expansion">ህገ ወጥ መሬት ማስፋፋት ቁጥጥር</option>
              <option value="street-vending">ህገ ወጥ ጎዳና ንግድ ቁጥጥር</option>
              <option value="sanitation-waste">ህገ ወጥ ደረቅና ፋሳሽ ቆሻሻ ቁጥጥር</option>
              <option value="animal-slaughter">ህገ ወጥ የእንስሳት እርድ ቁጥጥር</option>
              <option value="business-usage">ህገ ወጥ ንግድ አጠቃቀም ቁጥጥር</option>
              <option value="public-disturbance">ህገ ወጥ አዋኪ ድርጊት ቁጥጥር</option>
              <option value="advertisement">ህገ ወጥ ማስታወቂያ ቁጥጥር</option>
              <option value="regulation-180">በደንብ 180</option>
              <option value="none">----</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="violationRule" className="block font-semibold mb-2 text-textDark">Select (ደንብ ቁጥር)</label>
            <select
              id="violationRule"
              value={formData.violationRule}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-sans"
            >
              <option value="">Choose Rule</option>
              <option value="150/2015-individual">ግለሰብ በደ/ቁጥር 150/2015</option>
              <option value="150/2015-org">ድርጅት በደ/ቁጥር 150/2015</option>
              <option value="167/2016-individual">ግለሰብ በደ/ቁጥር 167/2016</option>
              <option value="167/2016-org">ድርጅት በደ/ቁጥር 167/2016</option>
              <option value="180/2017-individual">ግለሰብ በደ/ቁጥር 180/2017</option>
              <option value="180/2017-org">ድርጅት በደ/ቁጥር 180/2017</option>
              <option value="none">----</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="penaltyAmount" className="block font-semibold mb-2 text-textDark">Penalty Amount (በገዘብ የተቀጣ ብር መጠን)</label>
            {isCustomAmount ? (
              <div className="relative group">
                <input
                  type="number"
                  id="penaltyAmount"
                  value={formData.penaltyAmount}
                  onChange={handleChange}
                  placeholder="Enter custom amount"
                  required
                  className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-medium font-sans"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomAmount(false);
                    setFormData(prev => ({ ...prev, penaltyAmount: '' }));
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary font-semibold hover:underline bg-white px-2"
                >
                  Choose from list
                </button>
              </div>
            ) : (
              <select
                id="penaltyAmount"
                value={formData.penaltyAmount}
                onChange={(e) => {
                  if (e.target.value === 'other') {
                    setIsCustomAmount(true);
                    setFormData(prev => ({ ...prev, penaltyAmount: '' }));
                  } else {
                    handleChange(e);
                  }
                }}
                required
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-sans"
              >
                <option value="">Choose Amount</option>
                <option value="0">-</option>
                <option value="100">100 ብር</option>
                <option value="200">200 ብር</option>
                <option value="300">300 ብር</option>
                <option value="500">500 ብር</option>
                <option value="1000">1,000 ብር</option>
                <option value="2000">2,000 ብር</option>
                <option value="3000">3,000 ብር</option>
                <option value="5000">5,000 ብር</option>
                <option value="10000">10,000 ብር</option>
                <option value="50000">50,000 ብር</option>
                <option value="100000">100,000 ብር</option>
                <option value="1000000">1,000,000 ብር</option>
                <option value="other">Other (የተለየ መጠን)</option>
              </select>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dailyStatus" className="block font-semibold mb-2 text-textDark">ስለ ገቢ ሁኔታ</label>
            <select
              id="dailyStatus"
              value={formData.dailyStatus}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-sans"
            >
              <option value="">Choose Status</option>
              <option value="paid">ገቢ የተደረገ (Collected)</option>
              <option value="unpaid">ገቢ ያልተደረገ (Not Collected)</option>
              <option value="none">በዛሬው ዕለት ቅጣት የለም</option>
            </select>
          </div>

          <div className="form-group md:col-span-2">
            <label htmlFor="evidenceFile" className="block font-semibold mb-2 text-textDark">🖇️ Attach Evidence (ፎቶ ወይም ሰነድ ያያይዙ)</label>
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-primary/50 transition-colors group">
              <input
                type="file"
                id="evidenceFile"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-center">
                <div className="text-4xl mb-2 text-gray-400 group-hover:text-primary transition-colors">📁</div>
                <p className="text-textLight font-medium">
                  {file ? file.name : "Click or drag to upload file (Optional)"}
                </p>
                <p className="text-xs text-gray-400 mt-1">Images or Documents (MAX 10MB)</p>
              </div>
            </div>
            {isUploading && (
              <div className="mt-4">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-primary mt-2 flex justify-between">
                  <span>Uploading evidence...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </p>
              </div>
            )}
          </div>

          <div className="form-group md:col-span-2">
            <label htmlFor="violationDescription" className="block font-semibold mb-2 text-textDark">Additional Information</label>
            <textarea
              id="violationDescription"
              value={formData.violationDescription}
              onChange={handleChange}
              placeholder="Provide details..."
              required
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all min-h-[120px] resize-y font-sans"
            ></textarea>
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button 
              type="submit" 
              disabled={isUploading}
              className={`btn min-w-[250px] py-4 text-lg ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? 'Processing...' : 'Submit Report (ሪፖርቱን ላክ)'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ReportForm;