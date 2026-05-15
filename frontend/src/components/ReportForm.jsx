import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const ReportForm = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);

  const [formData, setFormData] = useState({
    Name: '',
    violationWereda: '',
    violationType: '',
    violationRule: '',
    penaltyAmount: '',
    dailyStatus: '',
    violationDescription: '',
  });

  const [isCustomAmount, setIsCustomAmount] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Try to extract wereda number from email (e.g., wereda01@... -> 1)
        const emailLower = currentUser.email.toLowerCase();
        const weredaMatch = emailLower.match(/wereda(\d+)/);
        if (weredaMatch && weredaMatch[1]) {
          const weredaNum = parseInt(weredaMatch[1], 10).toString();
          setFormData(prev => ({ ...prev, violationWereda: weredaNum }));
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login Error:", error.code, error.message);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert("Incorrect email or password. Please try again.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setFormData({
      Name: '',
      violationWereda: '',
      violationType: '',
      violationRule: '',
      penaltyAmount: '',
      dailyStatus: '',
      violationDescription: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newReportData = {
        ...formData,
        timestamp: new Date().toISOString(),
        submittedBy: user.email,
      };

      await addDoc(collection(db, "reports"), newReportData);

      alert('Report Submitted Successfully! (ሪፖርቱ በትክክል ተልኳል)');
      
      // Reset form but KEEP the wereda if it's locked by email
      const emailLower = user.email.toLowerCase();
      const weredaMatch = emailLower.match(/wereda(\d+)/);
      const lockedWereda = weredaMatch && weredaMatch[1] ? parseInt(weredaMatch[1], 10).toString() : '';

      setFormData({
        Name: '',
        violationWereda: lockedWereda,
        violationType: '',
        violationRule: '',
        penaltyAmount: '',
        dailyStatus: '',
        violationDescription: '',
      });
      setIsCustomAmount(false);
    } catch (error) {
      console.error("Error submitting report: ", error);
      alert("Error submitting report. Please check configuration.");
    }
  };

  if (authLoading) {
    return <div className="text-center py-24 text-textLight">Loading secure form...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">Officer Login</h2>
          <p className="text-textLight">Access restricted to Wereda Officers</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" placeholder="Wereda Email (e.g. wereda01@arada.com)" required value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans"
          />
          <input 
            type="password" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-sans"
          />
          <button type="submit" className="btn py-4 text-lg mt-2">Login to Report</button>
        </form>
      </div>
    );
  }

  // Check if Wereda is locked from email
  const isWeredaLocked = user.email.toLowerCase().includes('wereda');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">👤</div>
          <div>
            <p className="text-xs text-textLight font-bold uppercase tracking-wider">Logged in as</p>
            <p className="text-sm font-bold text-textDark">{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
          LOGOUT
        </button>
      </div>

      <section id="report" className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-gray-100 mb-12 transition-all hover:shadow-lg">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="form-group">
            <label htmlFor="reporterName" className="block font-semibold mb-2 text-textDark">👤 Name(ስም)</label>
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
              disabled={isWeredaLocked}
              className={`w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all bg-white font-sans ${isWeredaLocked ? 'bg-gray-50 text-gray-500 cursor-not-allowed opacity-80' : ''}`}
            >
              <option value="">ወረዳ--</option>
              {[1, 2, 4, 5, 6, 7, 8, 9].map((w) => (
                <option key={w} value={w}>ወረዳ 0{w}</option>
              ))}
            </select>
            {isWeredaLocked && <p className="text-[10px] text-primary mt-1 font-bold italic">Locked to your assigned Wereda</p>}
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
              <option value="zoning-land">በህገ ወጥ መሬት ወረራ </option>
              <option value="illegal-construction">በህገ ወጥ ግንባታ </option>
              <option value="zoning-expansion">በህገ ወጥ መሬት ማስፋፋት </option>
              <option value="street-vending">በህገ ወጥ ጎዳና ንግድ </option>
              <option value="sanitation-waste">በህገ ወጥ ደረቅና ፋሳሽ ቆሻሻ </option>
              <option value="animal-slaughter">በህገ ወጥ የእንስሳት እርድ </option>
              <option value="business-usage">በህገ ወጥ ንግድ አጠቃቀም </option>
              <option value="public-disturbance">በህገ ወጥ አዋኪ ድርጊት </option>
              <option value="advertisement">በህገ ወጥ ማስታወቂያ </option>
              <option value="regulation-180">በደንብ 180</option>
              <option value="none">-</option>
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
              <option value="180/2017-ግለሰብ">ግለሰብ በደ/ቁጥር 180/2017</option>
              <option value="180/2017-org">ድርጅት በደ/ቁጥር 180/2017</option>
              <option value="none">-</option>
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
              className="btn min-w-[250px] py-4 text-lg"
            >
              Submit Report 
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ReportForm;
