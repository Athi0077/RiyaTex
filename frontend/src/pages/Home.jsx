import { Link } from 'react-router-dom';
import ScrollAnimation from '../components/ScrollAnimation';
import heroImg from '../assets/riyatex.jpeg';
import silkImg from '../assets/silk2.webp';
import cottonImg from '../assets/cotton.png';
import designerImg from '../assets/designed2.webp';
import allcollection from '../assets/allcollection2.webp'

function Home() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero Section */}
      <ScrollAnimation />

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 place-items-center">
          
          {/* All Collections */}
          <Link to="/shopping" className="flex flex-col items-center group cursor-pointer transition-transform transform hover:-translate-y-2">
            <div className="relative w-32 h-40 sm:w-40 sm:h-52 rounded-t-full rounded-b-full border-4 border-yellow-400 overflow-hidden shadow-lg group-hover:shadow-xl transition-all bg-white p-1">
              <div className="w-full h-full rounded-t-full rounded-b-full overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-pink-400 to-brand">
                <img src={allcollection} alt="All Collections" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <p className="mt-4 font-medium text-gray-700 tracking-widest text-xs sm:text-sm uppercase">Shop All</p>
          </Link>

          {/* Silk Sarees */}
          <Link to="/shopping?fabric=Silk" className="flex flex-col items-center group cursor-pointer transition-transform transform hover:-translate-y-2">
            <div className="relative w-32 h-40 sm:w-40 sm:h-52 rounded-t-full rounded-b-full border-4 border-yellow-400 overflow-hidden shadow-lg group-hover:shadow-xl transition-all bg-white p-1">
              <div className="w-full h-full rounded-t-full rounded-b-full overflow-hidden">
                <img src={silkImg} alt="Silk Sarees" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                {/* <span className="text-white text-xl sm:text-3xl font-serif drop-shadow-md tracking-wider">SALE</span> */}
              </div>
            </div>
            <p className="mt-4 font-medium text-gray-700 tracking-widest text-xs sm:text-sm uppercase">Silk Sarees</p>
          </Link>

          {/* Cotton Sarees */}
          <Link to="/shopping?fabric=Cotton" className="flex flex-col items-center group cursor-pointer transition-transform transform hover:-translate-y-2">
            <div className="relative w-32 h-40 sm:w-40 sm:h-52 rounded-t-full rounded-b-full border-4 border-yellow-400 overflow-hidden shadow-lg group-hover:shadow-xl transition-all bg-white p-1">
              <div className="w-full h-full rounded-t-full rounded-b-full overflow-hidden">
                <img src={cottonImg} alt="Cotton Sarees" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <p className="mt-4 font-medium text-gray-700 tracking-widest text-xs sm:text-sm uppercase">Cotton Sarees</p>
          </Link>

          {/* Designer Sarees */}
          <Link to="/shopping?fabric=Designed" className="flex flex-col items-center group cursor-pointer transition-transform transform hover:-translate-y-2">
            <div className="relative w-32 h-40 sm:w-40 sm:h-52 rounded-t-full rounded-b-full border-4 border-yellow-400 overflow-hidden shadow-lg group-hover:shadow-xl transition-all bg-white p-1">
              <div className="w-full h-full rounded-t-full rounded-b-full overflow-hidden">
                <img src={designerImg} alt="Designer Sarees" loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
            </div>
            <p className="mt-4 font-medium text-gray-700 tracking-widest text-xs sm:text-sm uppercase">Designer Sarees</p>
          </Link>

        </div>
      </section>
    </div>
  );
}

export default Home;
