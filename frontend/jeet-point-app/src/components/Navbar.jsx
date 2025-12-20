import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {

  const nav=useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  function handleLogin(){
      nav("/login");
  }

  function handleSignup(){
    nav("/signup")
  }

  return (
    <nav className="bg-violet-100 p-2 top-0 z-50 m-4 sm:m-8 rounded-4xl shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
            {/*Logo*/}
            <img className="w-10 sm:w-12" src="/jeetlogo.png" alt="" />
            <div className="text-black text-lg sm:text-2xl font-bold">JEET Point</div>
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
            <a className="relative text-[#333] hover:text-[#5715f1] transition duration-300 before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-[3px] before:bg-[#5715f1] hover:before:w-full before:transition-all before:duration-300" href="/">Home</a>
            <a className="relative text-[#333] hover:text-[#5715f1] transition duration-300 before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-[3px] before:bg-[#5715f1] hover:before:w-full before:transition-all before:duration-300" href="/#features">Features</a>

            <a className="relative text-[#333] hover:text-[#5715f1] transition duration-300 before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-[3px] before:bg-[#5715f1] hover:before:w-full before:transition-all before:duration-300" href="/#about">About</a>
            <a className="relative text-[#333] hover:text-[#5715f1] transition duration-300 before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-[3px] before:bg-[#5715f1] hover:before:w-full before:transition-all before:duration-300" href="/#contact">Contact</a>
        </div>

        <div className="hidden md:flex items-center space-x-5" >
            <button onClick={handleLogin} className=" text-white font-semibold shadow-md btn-grad-login">Sign in</button>
            <button onClick={handleSignup} className="px-4 py-2 rounded-3xl bg-white text-violet-700 font-semibold border border-violet-700 hover:bg-violet-100 hover:text-violet-900 shadow-md transition-colors duration-200">Signup</button>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen((s) => !s)} aria-label="Toggle menu" className="p-2 rounded-md focus:outline-none">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col space-y-2">
            <a className="py-2" href="/" onClick={() => setIsOpen(false)}>Home</a>
            <a className="py-2" href="/#features" onClick={() => setIsOpen(false)}>Features</a>
            <a className="py-2" href="/#about" onClick={() => setIsOpen(false)}>About</a>
            <a className="py-2" href="/#contact" onClick={() => setIsOpen(false)}>Contact</a>
            <div className="pt-2 border-t mt-2 flex gap-2">
              <button onClick={handleLogin} className="flex-1 text-white font-semibold shadow-md btn-grad-login py-2 rounded-md">Sign in</button>
              <button onClick={handleSignup} className="flex-1 px-4 py-2 rounded-3xl bg-white text-violet-700 font-semibold border border-violet-700 hover:bg-violet-100 hover:text-violet-900 shadow-md transition-colors duration-200">Signup</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
export default Navbar;