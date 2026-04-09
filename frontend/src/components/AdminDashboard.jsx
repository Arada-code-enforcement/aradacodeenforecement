import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Tab State
  const [activeTab, setActiveTab] = useState('reports');
  
  const [submittedReports, setSubmittedReports] = useState([]);
  const [submittedCompliments, setSubmittedCompliments] = useState([]);
  const [loading, setLoading] = useState(true);

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
      // 1. Fetch Reports
      const qReports = query(collection(db, "reports"), orderBy("timestamp", "desc"));
      const snapReports = await getDocs(qReports);
      const reportsData = [];
      snapReports.forEach((docSnap) => {
        const raw = docSnap.data();
        reportsData.push({ id: docSnap.id, ...raw, timestampDisplay: new Date(raw.timestamp).toLocaleString() });
      });
      setSubmittedReports(reportsData);

      // 2. Fetch Compliments
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
      // Fails quietly if compliments collection doesn't exist yet or rules are blocked.
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert("Login failed. Check your credentials.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setSubmittedReports([]);
    setSubmittedCompliments([]);
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
    <div className="max-w-7xl mx-auto">
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

      <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-16 overflow-hidden animate-fade-in">
        
        {/* REPORTS TABLE */}
        {activeTab === 'reports' && (
          <>
            <div className="flex justify-between items-end mb-6 pb-2 border-b-2 border-primary/20">
              <h3 className="text-2xl font-bold text-textDark">Submitted Reports</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bgLight text-textDark uppercase text-xs font-bold tracking-wider">
                    <th className="p-4 border-b">Date</th>
                    <th className="p-4 border-b">Reporter</th>
                    <th className="p-4 border-b">Wereda</th>
                    <th className="p-4 border-b">Type</th>
                    <th className="p-4 border-b">Rule</th>
                    <th className="p-4 border-b">Amount</th>
                    <th className="p-4 border-b">Status</th>
                    <th className="p-4 border-b">Details</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {submittedReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                      <td className="p-4 text-xs whitespace-nowrap">{report.timestampDisplay}</td>
                      <td className="p-4 font-medium">{report.reporterName || 'Anonymous'}</td>
                      <td className="p-4">ወረዳ {report.violationWereda?.toString().padStart(2, '0')}</td>
                      <td className="p-4 truncate max-w-[150px]" title={report.violationType}>{report.violationType}</td>
                      <td className="p-4">{report.violationRule}</td>
                      <td className="p-4 font-mono font-bold text-primary">{report.penaltyAmount} ETB</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${report.dailyStatus === 'paid' ? 'bg-green-100 text-green-700' :
                          report.dailyStatus === 'unpaid' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {report.dailyStatus}
                        </span>
                      </td>
                      <td className="p-4 text-xs italic text-textLight">{report.violationDescription}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {submittedReports.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p>No finance reports have been submitted yet.</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* COMPLIMENTS TABLE */}
        {activeTab === 'compliments' && (
          <>
            <div className="flex justify-between items-end mb-6 pb-2 border-b-2 border-[#27ae60]/20">
              <h3 className="text-2xl font-bold text-textDark">Submitted Compliments</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bgLight text-textDark uppercase text-xs font-bold tracking-wider">
                    <th className="p-4 border-b">Date</th>
                    <th className="p-4 border-b">Name</th>
                    <th className="p-4 border-b">Phone</th>
                    <th className="p-4 border-b">Wereda</th>
                    <th className="p-4 border-b">Topic</th>
                    <th className="p-4 border-b">Message</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {submittedCompliments.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50 transition-colors border-b border-gray-50">
                      <td className="p-4 text-xs whitespace-nowrap">{comp.timestampDisplay}</td>
                      <td className="p-4 font-medium">{comp.name || 'Anonymous'}</td>
                      <td className="p-4 font-mono">{comp.phone}</td>
                      <td className="p-4">{comp.wereda === 'all' ? 'General' : `ወረዳ ${comp.wereda?.toString().padStart(2, '0')}`}</td>
                      <td className="p-4 font-semibold text-[#27ae60]">{comp.topic}</td>
                      <td className="p-4 text-xs italic text-textLight max-w-xs">{comp.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {submittedCompliments.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <p>No compliments have been submitted yet.</p>
                </div>
              )}
            </div>
          </>
        )}

      </section>
    </div>
  );
};

export default AdminDashboard;
