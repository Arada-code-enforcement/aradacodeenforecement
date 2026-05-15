import mainBg from '../assets/main-bg.jpg';
import media1 from '../assets/media1.jpg';
import media2 from '../assets/media2.jpg';
import media3 from '../assets/media3.jpg';
import media4 from '../assets/media4.jpg';
import media5 from '../assets/media5.jpg';
import media6 from '../assets/media6.jpg';
const Gallery = () => {
  const images = [
    { src: media1, title: 'ARADA PARK', desc: 'photo.' },
    { src: media2, title: 'Shanbel Nurelign G/Kidan', desc: 'The architectural heart of our modern sub-city administrative district.' },
    { src: media3, title: 'Abreham Mola', desc: 'Internal staff training and code of conduct review.' },
    { src: media4, title: 'Collaborative Meeting', desc: 'Working together for a safer and cleaner sub-city.' },
    { src: media5, title: 'Mogase Tesfaye', desc: 'protect.' },
    { src: media6, title: 'Getacho chokle ', desc: 'resource.' },
  ];
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-primary tracking-tight mb-4">
          Recent Activities
        </h2>
        <div className="w-24 h-1.5 bg-accent mx-auto rounded-full mb-6"></div>
        <p className="text-textLight max-w-2xl mx-auto text-lg">
          Stay updated with our latest events, meetings, and community outreach programs across Arada Sub-City.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {images.map((item, index) => (
          <div
            key={index}
            className="group relative h-80 overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Image Overlay - Visible on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 flex flex-col justify-end p-6">
              <h3 className="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                {item.title}
              </h3>
              <p className="text-gray-300 text-sm mt-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                {item.desc}
              </p>
            </div>

            {/* Main Image */}
            <img
              src={item.src}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80'; // Fallback
              }}
            />

            {/* Badge */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold z-20 border border-white/30 group-hover:bg-primary group-hover:border-primary transition-colors">
              Gallery
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
