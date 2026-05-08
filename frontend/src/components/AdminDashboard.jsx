import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import html2pdf from 'html2pdf.js';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [activeTab, setActiveTab] = useState('reports');
  const [submittedReports, setSubmittedReports] = useState([]);
  const [submittedCompliments, setSubmittedCompliments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal States
  const [editingReport, setEditingReport] = useState(null);
  const [editingCompliment, setEditingCompliment] = useState(null);

  // Loading States for Exports
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAllData();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const qReports = query(collection(db, "reports"), orderBy("timestamp", "desc"));
      const snapReports = await getDocs(qReports);
      const reportsData = [];
      snapReports.forEach((docSnap) => {
        const raw = docSnap.data();
        reportsData.push({ id: docSnap.id, ...raw, timestampDisplay: new Date(raw.timestamp).toLocaleString() });
      });
      setSubmittedReports(reportsData);

      const qCompliments = query(collection(db, "compliments"), orderBy("timestamp", "desc"));
      const snapCompliments = await getDocs(qCompliments);
      const complimentsData = [];
      snapCompliments.forEach((docSnap) => {
        const raw = docSnap.data();
        complimentsData.push({ id: docSnap.id, ...raw, timestampDisplay: new Date(raw.timestamp).toLocaleString() });
      });
      setSubmittedCompliments(complimentsData);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login Error:", error.code, error.message);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        alert("Incorrect email or password. Please try again.");
      } else if (error.code === 'auth/too-many-requests') {
        alert("Too many failed attempts. Please try again later.");
      } else if (error.code === 'auth/network-request-failed') {
        alert("Network error. Please check your internet connection.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSubmittedReports([]);
    setSubmittedCompliments([]);
  };

  // --- DELETE HANDLERS ---
  const handleDeleteReport = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this report?")) {
      try {
        await deleteDoc(doc(db, "reports", id));
        fetchAllData();
      } catch (err) {
        alert("Error deleting report. Make sure your Firebase Security Rules allow deletion!");
      }
    }
  };

  const handleDeleteCompliment = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this compliment?")) {
      try {
        await deleteDoc(doc(db, "compliments", id));
        fetchAllData();
      } catch (err) {
        alert("Error deleting compliment. Make sure your Firebase Security Rules allow deletion!");
      }
    }
  };

  // --- UPDATE HANDLERS ---
  const handleUpdateReport = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "reports", editingReport.id);
      const dataToSave = { ...editingReport };
      delete dataToSave.id;
      delete dataToSave.timestampDisplay;
      
      await updateDoc(docRef, dataToSave);
      setEditingReport(null);
      fetchAllData();
    } catch (err) {
      alert("Error updating report. Make sure your Firebase Security Rules allow updates!");
    }
  };

  const handleUpdateCompliment = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "compliments", editingCompliment.id);
      const dataToSave = { ...editingCompliment };
      delete dataToSave.id;
      delete dataToSave.timestampDisplay;
      
      await updateDoc(docRef, dataToSave);
      setEditingCompliment(null);
      fetchAllData();
    } catch (err) {
      alert("Error updating compliment. Make sure your Firebase Security Rules allow updates!");
    }
  };

  // --- CSV EXPORT HANDLER ---
  const downloadCSV = (data, filename) => {
    if (!data || data.length === 0) {
      alert("No data available to download.");
      return;
    }

    // Define headers and map data
    let headers = [];
    let rows = [];

    if (activeTab === 'reports') {
      headers = ["Date", "Reporter", "Wereda", "Type", "Rule", "Amount (ETB)", "Status", "Description"];
      rows = data.map(item => [
        item.timestampDisplay,
        item.reporterName || 'Anonymous',
        `Wereda ${item.violationWereda?.toString().padStart(2, '0')}`,
        item.violationType,
        item.violationRule,
        item.penaltyAmount,
        item.dailyStatus,
        `"${(item.violationDescription || '').replace(/"/g, '""')}"`
      ]);
    } else {
      headers = ["Date", "Name", "Phone", "Wereda", "Topic", "Message"];
      rows = data.map(item => [
        item.timestampDisplay,
        item.name || 'Anonymous',
        item.phone,
        item.wereda === 'all' ? 'General' : `Wereda ${item.wereda?.toString().padStart(2, '0')}`,
        item.topic,
        `"${(item.message || '').replace(/"/g, '""')}"`
      ]);
    }

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- PDF EXPORT HANDLER ---
  const downloadPDF = async (elementId, filename) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    setIsGeneratingPDF(true);
    try {
      const opt = {
        margin: [0.5, 0.5],
        filename: `${filename}_${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1.5, // Reduced from 2 for better performance
          useCORS: true, 
          logging: false 
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (loading) {
    return <div className="text-center py-24 text-textLight">Loading secure data...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary mb-2">Admin Login</h2>
          <p className="text-textLight">Access restricted control panel</p>
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" placeholder="Email Address" required value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <input 
            type="password" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)}
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          <button type="submit" className="btn py-4 text-lg mt-2">Login to Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold text-primary">Admin Dashboard</h2>
          <p className="text-textLight text-sm mt-1">Logged in as {user.email}</p>
        </div>
        <button onClick={handleLogout} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-colors shadow-sm">
          Logout
        </button>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setActiveTab('reports')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            activeTab === 'reports' 
              ? 'bg-primary text-white shadow-md' 
              : 'bg-white text-textLight border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Finance Reports (የገቡ ሪፖርቶች)
          <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{submittedReports.length}</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('compliments')}
          className={`px-6 py-3 rounded-full font-bold transition-all ${
            activeTab === 'compliments' 
              ? 'bg-[#27ae60] text-white shadow-md' 
              : 'bg-white text-textLight border border-gray-200 hover:bg-gray-50'
          }`}
        >
          Compliments (አድናቆቶች)
          <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{submittedCompliments.length}</span>
        </button>
      </div>

      <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-16 overflow-x-auto min-h-[500px]">
        
        {/* REPORTS TABLE */}
        {activeTab === 'reports' && (
          <>
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-primary/20">
              <h3 className="text-2xl font-bold text-textDark">Submitted Reports</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadCSV(submittedReports, "Finance_Reports")}
                  className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg font-bold transition-all text-sm"
                >
                  <span>📥 Download Excel</span>
                </button>
                <button 
                  onClick={() => downloadPDF("reports-table", "Finance_Reports")}
                  disabled={isGeneratingPDF}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm border ${
                    isGeneratingPDF 
                      ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                  }`}
                >
                  <span>{isGeneratingPDF ? '⌛ Generating...' : '📄 Download PDF'}</span>
                </button>
              </div>
            </div>
            <div id="reports-table" className="p-4 bg-white rounded-xl border border-gray-50">
              <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-bgLight text-textDark uppercase text-[10px] sm:text-xs font-bold tracking-wider">
                  <th className="p-3 sm:p-4 border-b">Date</th>
                  <th className="p-3 sm:p-4 border-b">Reporter</th>
                  <th className="p-3 sm:p-4 border-b">Wereda</th>
                  <th className="p-3 sm:p-4 border-b">Type</th>
                  <th className="p-3 sm:p-4 border-b">Rule</th>
                  <th className="p-3 sm:p-4 border-b">Amount</th>
                  <th className="p-3 sm:p-4 border-b">Status</th>
                  <th className="p-3 sm:p-4 border-b">Details</th>
                  <th className="p-3 sm:p-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {submittedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                    <td className="p-3 sm:p-4 text-xs">{report.timestampDisplay}</td>
                    <td className="p-3 sm:p-4 font-medium">{report.reporterName || 'Anonymous'}</td>
                    <td className="p-3 sm:p-4">ወረዳ {report.violationWereda?.toString().padStart(2, '0')}</td>
                    <td className="p-3 sm:p-4 text-xs" title={report.violationType}>{report.violationType}</td>
                    <td className="p-3 sm:p-4 text-xs">{report.violationRule}</td>
                    <td className="p-3 sm:p-4 font-mono font-bold text-primary whitespace-nowrap">{report.penaltyAmount} ETB</td>
                    <td className="p-3 sm:p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${report.dailyStatus === 'paid' ? 'bg-green-100 text-green-700' :
                        report.dailyStatus === 'unpaid' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                        {report.dailyStatus}
                      </span>
                    </td>
                    <td className="p-3 sm:p-4 text-xs italic text-textLight">{report.violationDescription?.substring(0,30)}...</td>
                    <td className="p-3 sm:p-4 flex gap-2 justify-center">
                      <button onClick={() => setEditingReport(report)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Edit</button>
                      <button onClick={() => handleDeleteReport(report.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {submittedReports.length === 0 && <div className="text-center py-12 text-gray-400">No finance reports have been submitted yet.</div>}
          </>
        )}

        {/* COMPLIMENTS TABLE */}
        {activeTab === 'compliments' && (
          <>
            <div className="flex justify-between items-center mb-6 pb-2 border-b-2 border-[#27ae60]/20">
              <h3 className="text-2xl font-bold text-textDark">Submitted Compliments</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => downloadCSV(submittedCompliments, "Compliments")}
                  className="flex items-center gap-2 bg-[#27ae60]/10 text-[#27ae60] hover:bg-[#27ae60] hover:text-white px-4 py-2 rounded-lg font-bold transition-all text-sm"
                >
                  <span>📥 Download Excel</span>
                </button>
                <button 
                  onClick={() => downloadPDF("compliments-table", "Compliments")}
                  disabled={isGeneratingPDF}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all text-sm border ${
                    isGeneratingPDF 
                      ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200'
                  }`}
                >
                  <span>{isGeneratingPDF ? '⌛ Generating...' : '📄 Download PDF'}</span>
                </button>
              </div>
            </div>
            <div id="compliments-table" className="p-4 bg-white rounded-xl border border-gray-50">
              <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-bgLight text-textDark uppercase text-xs font-bold tracking-wider">
                  <th className="p-4 border-b">Date</th>
                  <th className="p-4 border-b">Name</th>
                  <th className="p-4 border-b">Phone</th>
                  <th className="p-4 border-b">Wereda</th>
                  <th className="p-4 border-b">Topic</th>
                  <th className="p-4 border-b">Message</th>
                  <th className="p-4 border-b text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {submittedCompliments.map((comp) => (
                  <tr key={comp.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                    <td className="p-4 text-xs">{comp.timestampDisplay}</td>
                    <td className="p-4 font-medium">{comp.name || 'Anonymous'}</td>
                    <td className="p-4 font-mono">{comp.phone}</td>
                    <td className="p-4">{comp.wereda === 'all' ? 'General' : `ወረዳ ${comp.wereda?.toString().padStart(2, '0')}`}</td>
                    <td className="p-4 font-semibold text-[#27ae60]">{comp.topic}</td>
                    <td className="p-4 text-xs italic text-textLight">{comp.message?.substring(0,40)}...</td>
                    <td className="p-4 flex gap-2 justify-center">
                      <button onClick={() => setEditingCompliment(comp)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Edit</button>
                      <button onClick={() => handleDeleteCompliment(comp.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            {submittedCompliments.length === 0 && <div className="text-center py-12 text-gray-400">No compliments have been submitted yet.</div>}
          </>
        )}

      </section>

      {/* --- REPORT EDIT MODAL --- */}
      {editingReport && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm shadow-2xl">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setEditingReport(null)} className="absolute top-4 right-6 text-3xl text-gray-400 hover:text-gray-700">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-primary border-b pb-2">Edit Report Record</h2>
            <form onSubmit={handleUpdateReport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Reporter Name</label>
                <input type="text" value={editingReport.reporterName || ''} onChange={(e)=>setEditingReport({...editingReport, reporterName: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Wereda</label>
                <select value={editingReport.violationWereda || ''} onChange={(e)=>setEditingReport({...editingReport, violationWereda: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option value="">Select Wereda</option>
                  {[1,2,4,5,6,7,8,9].map(w => <option key={w} value={w}>ወረዳ 0{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Violation Type</label>
                <input type="text" value={editingReport.violationType || ''} onChange={(e)=>setEditingReport({...editingReport, violationType: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Rule</label>
                <input type="text" value={editingReport.violationRule || ''} onChange={(e)=>setEditingReport({...editingReport, violationRule: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Penalty Amount</label>
                <input type="number" value={editingReport.penaltyAmount || ''} onChange={(e)=>setEditingReport({...editingReport, penaltyAmount: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Status</label>
                <select value={editingReport.dailyStatus || ''} onChange={(e)=>setEditingReport({...editingReport, dailyStatus: e.target.value})} className="w-full p-2 border rounded-lg">
                   <option value="paid">Paid</option>
                   <option value="unpaid">Unpaid</option>
                   <option value="none">None</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea value={editingReport.violationDescription || ''} onChange={(e)=>setEditingReport({...editingReport, violationDescription: e.target.value})} className="w-full p-2 border rounded-lg h-24"></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingReport(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- COMPLIMENT EDIT MODAL --- */}
      {editingCompliment && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm shadow-2xl">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 relative">
            <button onClick={() => setEditingCompliment(null)} className="absolute top-4 right-6 text-3xl text-gray-400 hover:text-gray-700">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-[#27ae60] border-b pb-2">Edit Compliment Record</h2>
            <form onSubmit={handleUpdateCompliment} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input type="text" value={editingCompliment.name || ''} onChange={(e)=>setEditingCompliment({...editingCompliment, name: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <input type="text" value={editingCompliment.phone || ''} onChange={(e)=>setEditingCompliment({...editingCompliment, phone: e.target.value})} className="w-full p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Wereda</label>
                <select value={editingCompliment.wereda || ''} onChange={(e)=>setEditingCompliment({...editingCompliment, wereda: e.target.value})} className="w-full p-2 border rounded-lg">
                  <option value="all">Sub-City General</option>
                  {[1,2,4,5,6,7,8,9].map(w => <option key={w} value={w}>ወረዳ 0{w}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Message</label>
                <textarea value={editingCompliment.message || ''} onChange={(e)=>setEditingCompliment({...editingCompliment, message: e.target.value})} className="w-full p-2 border rounded-lg h-32"></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setEditingCompliment(null)} className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-bold">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-[#27ae60] hover:bg-[#219653] text-white rounded-lg font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
