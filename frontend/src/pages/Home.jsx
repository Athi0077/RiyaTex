import { Link } from 'react-router-dom';
import heroImg from '../assets/riyatex.jpeg';
import silkImg from '../assets/silk2.webp';
import cottonImg from '../assets/cotton.png';
import designerImg from '../assets/designed2.webp';
import allcollection from '../assets/allcollection2.webp'

function Home() {
  return (
    <div className="bg-[#fdfbf7]">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden flex flex-col md:flex-row items-center justify-center min-h-[60vh] bg-[#f4eee0]">
        <div className="absolute inset-0 w-full h-full object-cover">
           <img src={heroImg} alt="Hero" className="w-full h-full object-cover opacity-90" />
        </div>
        
        {/* Overlay Content */}
        <div className="z-10 text-center p-8 bg-white/70 backdrop-blur-sm rounded-lg shadow-xl border border-white/40 max-w-lg mt-8 mb-8">
          <h1 className="text-5xl font-serif text-brand mb-4">Riya Sarees</h1>
          <p className="text-lg text-gray-800 tracking-wider mb-2">
            Silk | Cotton | Designing Sarees
          </p>
          <div className="flex flex-col items-center gap-2 mb-6 text-sm text-gray-700">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              +91 9363008505
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Elampillai, Salem.
            </span>
          </div>
          <Link to="/shopping">
            <button className="bg-brand text-white px-8 py-3 rounded hover:bg-brand-light transition-all shadow-md font-medium tracking-wide">
              Order Now
            </button>
          </Link>
        </div>
      </section>

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
