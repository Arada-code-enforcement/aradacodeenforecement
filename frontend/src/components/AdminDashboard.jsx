import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submittedReports, setSubmittedReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchReports();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "reports"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const reportsData = [];
      querySnapshot.forEach((docSnap) => {
        const rawData = docSnap.data();
        const displayDate = new Date(rawData.timestamp).toLocaleString();
        reportsData.push({ id: docSnap.id, ...rawData, timestamp: displayDate });
      });
      setSubmittedReports(reportsData);
    } catch (error) {
      console.error("Error fetching reports: ", error);
      alert("Error fetching reports. You may not have access.");
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
  };

  if (loading) {
    return <div className="text-center py-24">Loading...</div>;
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
      
      <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 mb-16 overflow-hidden animate-fade-in">
        <div className="flex justify-between items-end mb-6 pb-2 border-b-2 border-primary/20">
          <h3 className="text-2xl font-bold text-textDark">
            Submitted Reports (የገቡ ሪፖርቶች)
          </h3>
          <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">{submittedReports.length} Total</span>
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
                  <td className="p-4 text-xs whitespace-nowrap">{report.timestamp}</td>
                  <td className="p-4 font-medium">{report.reporterName || 'Anonymous'}</td>
                  <td className="p-4">ወረዳ 0{report.violationWereda}</td>
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
              <p>No reports have been submitted yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
