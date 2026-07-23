import { Link } from 'react-router-dom';
import ScrollAnimation from '../components/ScrollAnimation';
import heroImg from '../assets/riyatex.jpeg';
import silkImg from '../assets/silk2.webp';
import cottonImg from '../assets/cotton.png';
import designerImg from '../assets/designed2.webp';
import allcollection from '../assets/allcollection2.webp';
import bgImage from '../assets/bg.png';
// import bgImage from '../assets/background3.webp';

function Home() {
  return (
    <div style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
      {/* Hero Section */}
      <ScrollAnimation />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 sm:gap-12 place-items-center">
          
          {/* All Collections */}
          <Link to="/shopping" className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-36 h-52 sm:w-48 sm:h-72 rounded-t-full rounded-b-full border border-white/40 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] group-hover:-translate-y-2 transition-all duration-500 bg-white/20 p-1.5 backdrop-blur-sm">
              <div className="w-full h-full rounded-t-full rounded-b-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-pink-400 to-brand">
                <img src={allcollection} alt="All Collections" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              </div>
            </div>
            <p className="mt-6 font-semibold text-[#2d241c] tracking-[0.2em] text-[10px] sm:text-xs uppercase group-hover:text-[#c5a070] transition-colors duration-300">Shop All</p>
          </Link>

          {/* Silk Sarees */}
          <Link to="/shopping?fabric=Silk" className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-36 h-52 sm:w-48 sm:h-72 rounded-t-full rounded-b-full border border-white/40 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] group-hover:-translate-y-2 transition-all duration-500 bg-white/20 p-1.5 backdrop-blur-sm">
              <div className="w-full h-full rounded-t-full rounded-b-full overflow-hidden">
                <img src={silkImg} alt="Silk Sarees" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              </div>
            </div>
            <p className="mt-6 font-semibold text-[#2d241c] tracking-[0.2em] text-[10px] sm:text-xs uppercase group-hover:text-[#c5a070] transition-colors duration-300">Silk Sarees</p>
          </Link>

          {/* Cotton Sarees */}
          <Link to="/shopping?fabric=Cotton" className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-36 h-52 sm:w-48 sm:h-72 rounded-t-full rounded-b-full border border-white/40 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] group-hover:-translate-y-2 transition-all duration-500 bg-white/20 p-1.5 backdrop-blur-sm">
              <div className="w-full h-full rounded-t-full rounded-b-full overflow-hidden">
                <img src={cottonImg} alt="Cotton Sarees" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              </div>
            </div>
            <p className="mt-6 font-semibold text-[#2d241c] tracking-[0.2em] text-[10px] sm:text-xs uppercase group-hover:text-[#c5a070] transition-colors duration-300">Cotton Sarees</p>
          </Link>

          {/* Designer Sarees */}
          <Link to="/shopping?fabric=Designed" className="flex flex-col items-center group cursor-pointer">
            <div className="relative w-36 h-52 sm:w-48 sm:h-72 rounded-t-full rounded-b-full border border-white/40 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] group-hover:shadow-[0_25px_50px_rgba(0,0,0,0.25)] group-hover:-translate-y-2 transition-all duration-500 bg-white/20 p-1.5 backdrop-blur-sm">
              <div className="w-full h-full rounded-t-full rounded-b-full overflow-hidden">
                <img src={designerImg} alt="Designer Sarees" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              </div>
            </div>
            <p className="mt-6 font-semibold text-[#2d241c] tracking-[0.2em] text-[10px] sm:text-xs uppercase group-hover:text-[#c5a070] transition-colors duration-300">Designer Sarees</p>
          </Link>

        </div>
      </section>
    </div>
  );
}

export default Home;
