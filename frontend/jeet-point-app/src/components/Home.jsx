import "./Gradient.css";
import Navbar from "./Navbar";
import Features from './Features'
import About from './About'
import Contact from './Contact'
import Footer from './Footer'
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  return (<>
  <div className="relative font-notosans min-h-screen overflow-hidden">
      <div className="full-radial-bg" />
      <Navbar />
      {/* Main content area with gradient background */}
      <div className="z-10 mt-8 md:mt-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center md:justify-between gap-8">
          <div className="flex flex-col w-full md:w-1/2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">Learn. Practice. JEET It!</h1>
            <p className="text-base sm:text-lg text-gray-700 mb-6">Take engaging quizzes, track your progress, and master every concept on your path to success.</p>

            <div className="w-full sm:w-auto flex justify-center sm:justify-start">
              <button
                onClick={() => navigate('/signup')}
                className="btn-grad w-full sm:inline-block sm:w-auto px-6 sm:px-8 py-4 sm:py-3 rounded-lg text-white text-lg sm:text-xl font-semibold text-center shadow-lg hover:scale-102 transition-transform duration-200"
                aria-label="Get Started"
              >
                Get Started
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 hidden md:flex justify-center">
            <img src="/img1.png" alt="Illustration showing studying and quizzes" className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain" />
          </div>
        </div>
      </div>

      <Features/>
    <About/>
    <Contact/>
    <Footer/>
</div>
      </>
        
    
  );
}
export default Home;