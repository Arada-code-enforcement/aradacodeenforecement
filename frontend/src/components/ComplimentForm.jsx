import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const ComplimentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    wereda: '',
    topic: '',
    message: '',
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        timestamp: new Date().toISOString()
      };
      
      await addDoc(collection(db, "compliments"), dataToSubmit);
      
      alert('Thank you for your compliment! We appreciate your feedback. (አድናቆትዎ በትክክል ተልኳል)');
      setFormData({ name: '', phone: '', wereda: '', topic: '', message: '' });
    } catch (error) {
      console.error("Error saving compliment: ", error);
      alert("Error submitting compliment. Please check your connection.");
    }
  };

  return (
    <section id="compliment" className="bg-white p-12 rounded-md shadow-sm max-w-[800px] mx-auto mb-16 border-t-[5px] border-[#27ae60]">
      <div className="flex justify-center mb-4 text-5xl">🌟</div>
      <h2 className="text-2xl font-bold text-center text-[#27ae60] border-b-2 border-gray-200 inline-block pb-2 mb-4 mx-auto block w-fit">
        Submit a Compliment (አድናቆት መግለጫ ቅፅ)
      </h2>
      <p className="text-center text-textLight mb-8">
        Did one of our officers do a great job? Have you noticed improvements in your area? Let us know below!
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label htmlFor="comp-name" className="block font-semibold mb-2 text-textDark">👤ስም:(Optional)</label>
          <input 
            type="text" id="comp-name" placeholder="Alemu" 
            value={formData.name} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/10 transition-all font-sans" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="comp-phone" className="block font-semibold mb-2 text-textDark">📱Your Phone(ስልክ ቁጥር) </label>
          <input 
            type="tel" id="comp-phone" placeholder="+251..." 
            required value={formData.phone} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/10 transition-all font-sans" 
          />
        </div>

        <div className="form-group">
          <label htmlFor="comp-wereda" className="block font-semibold mb-2 text-textDark">Select Woreda ( ወረዳ )</label>
          <select id="comp-wereda" required value={formData.wereda} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/10 transition-all font-sans bg-white">
            <option value="">ወረዳ-- </option>
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
          <label htmlFor="comp-topic" className="block font-semibold mb-2 text-textDark">Compliment Topic (የአድናቆት ርዕስ)</label>
          <select id="comp-topic" required value={formData.topic} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/10 transition-all font-sans bg-white">
            <option value="">-- Select Topic -- </option>
            <option value="officer">Excellent Service by an Officer (ጥሩ አገልግሎት)</option>
            <option value="cleanliness">Improved Area Cleanliness (የአካባቢ ጽዳት)</option>
            <option value="response">Fast Response Time (ፈጣን ምላሽ)</option>
            <option value="other">Other (ሌላ)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="comp-message" className="block font-semibold mb-2 text-textDark">Message (መልእክት)</label>
          <textarea 
            id="comp-message" placeholder="Share your positive feedback..." 
            required value={formData.message} onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#27ae60] focus:ring-2 focus:ring-[#27ae60]/10 transition-all font-sans min-h-[120px] resize-y"
          ></textarea>
        </div>

        <div className="text-center">
          <button type="submit" className="inline-block bg-[#27ae60] text-white py-3 px-6 rounded-full font-semibold no-underline mt-4 transition-all duration-300 transform hover:bg-[#219653] hover:scale-105 border-0 cursor-pointer min-w-[200px]">Send Compliment</button>
        </div>
      </form>
    </section>
  );
};

export default ComplimentForm;
