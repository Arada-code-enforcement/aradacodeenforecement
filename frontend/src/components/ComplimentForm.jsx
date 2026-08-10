import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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

<div class="form-group">
             <label for="violationType">የደንብ ጥሰት አይነት</label>
             <select id="violationType" name="violationType" required>
             <option value="">-- የደንብ ጥሰት አይነት-- </option>
             <option value="zoning">በህገ ወጥ መሬት ወረራ </option>
             <option value="zoning">በህገ ወጥ መሬት  ማስፋፋት </option>
             <option value="illegal-dumping">በህገ ወጥ ግንባታ</option>
             <option value="unsafe-building">በህገ ወጥ ደረቅና ፋሳሽ ቆሻሻ</option>
             <option value="noise">በህገ ወጥ መንግድ አጠቃቀም </option>
             <option value="sanitation">በህገ ወጥ  ማስታወቃያ </option>
             <option value="zoning">በህገ ወጥ  ጎዳና ንግድ  </option>
             <option value="zoning">በህገ ወጥ  የእንስሳት እርድ</option>
             <option value="sanitation">በህገ ወጥ አዋኪ ድርጊት  </option>
             <option value="zoning">በደንብ 180  </option>
             <option value="zoning"> - </option>
            <option value="other">Other</option> 
          </select>
          </div>
          <div class="form-group">
      <label for="wereda"> Select ( ወረዳ )
      </label>
      <select id="wereda" name=" wereda" required>
        <option value="">ወረዳ-- </option>
        <option value="1">ወረዳ 01</option>
        <option value="2">ወረዳ 02</option>
        <option value="4">ወረዳ 04</option>
        <option value="5">ወረዳ 05</option>
        <option value="6">ወረዳ 06</option>
        <option value="7">ወረዳ 07</option>
        <option value="8">ወረዳ 08</option> 
        <option value="9">ወረዳ 09</option>
         </select>
          </div>
          <div class="form-group">
            <label for="violationType">Block (ቀጣና)</label>
            <select id="violationType" name="violationType" required>  
             <option value="">5</option>
             <option value="">10</option>
             <option value="">15</option>
             <option value="">18</option>
             <option value="">19</option>
             <option value="">13</option>
             <option value="illegal-dumping">14 </option>
            <option value="sanitation">- </option>
            <option value="other">Other</option>
            </select>
        </div>d
             <div class="form-group">
             <label for="violationType">the amount of cash (በገዘብ የተቀጣ ብር መጠን)</label>
             <select id="violationType" name="violationType" required>
             <option value="">100ብር </option>
             <option value="">500ብር </option>
             <option value="">1000ብር </option>
             <option value="">2000ብር </option>
             <option value="">3000ብር </option>
             <option value="">5000ብር </option>
             <option value="">10,000ብር </option>
             <option value="">20,000ብር </option>
             <option value="">50,000ብር </option>
             <option value="">100,000ብር </option>
             <option value="">200,000ብር </option>
             <option value="illegal-dumping">300,000ብር</option>
             <option value="sanitation">400,000ብር </option>
             <option value="other">1,000,000ብር </option>
             <option value="">-</option>
             </select>
              </div>

        


        <div className="text-center pt-4">
          <button 
            type="submit" 
            className="btn min-w-[280px] py-4 shadow-lg hover:shadow-xl font-bold"
          >
            Send Compliment (አድናቆት ላክ)
          </button>
        </div>
      </form>
    </section>
  );
};

export default ComplimentForm;
