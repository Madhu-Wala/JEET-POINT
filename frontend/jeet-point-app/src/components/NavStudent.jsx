import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import {auth } from "./Firebase"; 
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";

function NavStudent({ user }) {
  const { userData } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

    const nav= useNavigate();
  const navLinkClass = ({ isActive }) =>
    `relative transition duration-300 before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-0 before:h-[3px] before:bg-[#5715f1] hover:before:w-full before:transition-all before:duration-300 ${
      isActive ? "text-[#5715f1] font-semibold" : "text-[#333]"
    }`;

    async function handleSignOut() {
        try{
            await signOut(auth);
                alert("Sign-out successful.");
                nav("/");
            
        }catch(error) {
                alert("Sign-out error:", error);
            }
    }

  return (
    <nav className="bg-violet-100 p-2 px-5 top-0 z-50 m-3 rounded-4xl shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img className="w-10 sm:w-12" src="/jeetlogo.png" alt="logo" />
          <div className="text-black text-xl sm:text-3xl font-bold">JEET Point</div>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center text-base md:text-xl space-x-8">
          <NavLink to="/StudentDASH" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/StudentDASH/contests" className={navLinkClass}>
            Contests
          </NavLink>
          <NavLink to="/StudentDASH/analytics" className={navLinkClass}>
            Analytics
          </NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-5">
          <div className="text-sm md:text-2xl font-bold text-[#180335]">Welcome {userData?.name}!</div>
          <button onClick={handleSignOut} className="text-white font-semibold shadow-md btn-grad-logout px-3 py-1 rounded-md">
            Sign out
          </button>
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

      {/* Mobile menu content */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col space-y-2">
            <NavLink to="/StudentDASH" end className={navLinkClass} onClick={() => setIsOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/StudentDASH/contests" className={navLinkClass} onClick={() => setIsOpen(false)}>
              Contests
            </NavLink>
            <NavLink to="/StudentDASH/analytics" className={navLinkClass} onClick={() => setIsOpen(false)}>
              Analytics
            </NavLink>

            <div className="pt-2 border-t mt-2">
              <div className="text-sm font-semibold text-[#180335] mb-2">Welcome {userData?.name}!</div>
              <button onClick={handleSignOut} className="w-full text-white font-semibold shadow-md btn-grad-logout py-2 rounded-md">
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
export default NavStudent;