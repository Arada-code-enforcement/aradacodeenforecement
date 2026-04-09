import React from 'react';

const AboutContact = () => {
  return (
    <section id="about" className="flex flex-wrap gap-8 bg-greenTint p-12 rounded-md mb-16">
      <div className="flex-1 min-w-[300px]">
        <h2 className="text-2xl font-bold text-primary border-b-2 border-gray-200 inline-block pb-2 mb-6">About Code Enforcement office </h2>
        <h3 className="text-xl font-bold mb-4">የአዲስ አበባ ከተማ አስተዳደር ደንብ ማስከበር ባለስልጣን</h3>

        <p className="text-textLight mb-8 leading-relaxed">
          We are dedicated to maintaining the health, safety, and cleanliness of our community by enforcing local codes and regulations. Together, we can build a better environment for everyone. Our officers work daily across all woredas to ensure city guidelines are followed, providing a safe and thriving sub-city for all residents.
        </p>
      </div>

      <div className="flex-1 min-w-[300px]" id="contact">
        <h1 className="text-3xl font-bold text-primary mb-6">Contact Information</h1>

        <div className="flex items-center mb-4">
          <span className="font-semibold text-primary mr-2">free Phone number(ነፃ ስልክ ቁጥር):</span> ☎️9995
        </div>
        <div className="flex items-center mb-4">
          <span className="font-semibold text-primary mr-2">Alemu📞Phone num:</span> (+251)935071709
        </div>
        <div className="flex items-center mb-4">
          <span className="font-semibold text-primary mr-2">Wanofi📞Phone num:</span> (+251)935071709
        </div>
        <div className="flex items-center mb-4">
          <span className="font-semibold text-primary mr-2">📩Email:</span> info@arada-enforcement.com
        </div>
        <div className="flex items-start mb-4">
          <span className="font-semibold text-primary mr-2">Address:</span>
          <div>
            4kilo., Arada Sub-City<br />
            Addis Ababa, Ethiopia
          </div>
        </div>
        <div className="flex items-center mb-4">
          <span className="font-semibold text-primary mr-2">⌚️Hours:</span> Mon - Fri, 8:00 AM - 5:30 PM
        </div>
      </div>
    </section>
  );
};

export default AboutContact;
