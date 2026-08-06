import { useState } from "react";
import { auth, db, provider } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../context/Loader.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
  const { setLoading } = useContext(AuthContext); // use global loading

  const handleEmailSignin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role;

        toast.success("Sign in successful!");

        if (role === "Student") {
          nav("/StudentDASH");
        } else if (role === "Teacher") {
          nav("/TeacherDASH");
        } else {
          alert("Unknown user role.");
        }
      } else {
        alert("User data not found in Firestore.");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else if (error.code === "auth/user-not-found") {
        alert("No account found with this email");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleGoogleSignin = async () => {
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData.role;

        if (role === "Student") {
          nav("/StudentDASH");
        } else if (role === "Teacher") {
          nav("/TeacherDASH");
        } else {
          alert("Unknown user role.");
        }
      } else {
        alert("User data not found in Firestore.");
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-8 mt-10 rounded-3xl backdrop-blur-md bg-white/10 border border-white/100 shadow-2xl">
      <div>
        <img src="/jeetlogo.png" className="mx-auto h-25 w-auto my-9" alt="" />
        <h1 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Sign in to your account
        </h1>
      </div>
      <form onSubmit={handleEmailSignin} className="space-y-4  max-w-md mx-auto mt-4">
        <div>
          <label className="mb-2 text-sm text-slate-900 font-medium block">Email</label>
          <div className="relative flex items-center">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 pr-10 bg-[#f0f1f2] focus:bg-transparent w-full text-sm border border-gray-200 focus:border-black outline-0 rounded-md transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-4"
              viewBox="0 0 682.667 682.667"
            >
              <defs>
                <clipPath id="a" clipPathUnits="userSpaceOnUse">
                  <path d="M0 512h512V0H0Z" data-original="#000000"></path>
                </clipPath>
              </defs>
              <g clipPath="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
                <path
                  fill="none"
                  strokeMiterlimit="10"
                  strokeWidth="40"
                  d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                  data-original="#000000"
                ></path>
                <path
                  d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                  data-original="#000000"
                ></path>
              </g>
            </svg>
          </div>
        </div>

        <div>
          <label className="mb-2 text-sm text-slate-900 font-medium block">Password</label>
          <div className="relative flex items-center">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="px-4 py-3 pr-10 bg-[#f0f1f2] focus:bg-transparent w-full text-sm border border-gray-200 focus:border-black outline-0 rounded-md transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#bbb"
              stroke="#bbb"
              className="w-[18px] h-[18px] absolute right-4 cursor-pointer"
              viewBox="0 0 128 128"
            >
              <path
                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                data-original="#000000"
              ></path>
            </svg>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => nav("/forgot")}
            className="px-5 py-2.5 w-40 cursor-pointer !mt-4 text-[15px] font-medium bg-yellow-600 hover:bg-orange-600 text-white rounded-md"
          >
            Forgot Password
          </button>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 w-full cursor-pointer !mt-4 text-[15px] font-medium bg-[#420599] hover:bg-[#180335] text-white rounded-md"
        >
          Sign in
        </button>
      </form>

      <h1 className="text-center mt-4">Or</h1>

      <button
        type="button"
        onClick={handleGoogleSignin}
        className="flex items-center justify-center w-full gap-2 mt-4 px-5 py-2.5 bg-white-600 hover:bg-gray-200 border-1 text-black font-medium rounded-md"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="G"
          className="w-5 h-5"
        />
        Sign in with Google
      </button>

      <div className="text-center mt-4">
          <button
            onClick={() => nav("/")}
            className="px-5 py-2.5 w-20 cursor-pointer !mt-4 text-[15px] font-medium bg-green-600 hover:bg-teal-600 text-white rounded-md"
          >
            Back
          </button>
        </div>
    </section>
  );
}

export default Login;
