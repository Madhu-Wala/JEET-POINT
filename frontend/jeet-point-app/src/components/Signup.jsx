import { signInWithPopup, getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "./Firebase";
import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { ChevronUpDownIcon } from '@heroicons/react/16/solid'
import { CheckIcon } from '@heroicons/react/20/solid'
import { useState } from "react";
import { doc,getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./Firebase";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { select } from "@material-tailwind/react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const roles = [
  { id: 1, name: "Select" },
  { id: 2, name: "Student" },
  { id: 3, name: "Teacher" },
];

function Signup() {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState(roles[0]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setLoading ,loading} = useContext(AuthContext); // use global loading


  const nav = useNavigate();

  const handleEmailSignup = async (event) => {
    event.preventDefault();

    if (selected.name === "Select") {
      alert("Please select a role before signing up.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);
 
    try {
      const authInstance = getAuth();
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      const user = userCredential.user;



      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: selected.name,
        created: serverTimestamp()
      });

      alert("Sign up successful!");
      if(selected.id==2){
        nav("/StudentDASH");
      }else if(selected.id==3){
        nav("/TeacherDASH");
      }
      


    } catch (err) {
  if (err.code === "auth/email-already-in-use") {
    alert("An account with this email already exists. Redirecting you to login...");
    nav("/login"); // adjust path if your login route is different
  } else if (err.code === "auth/invalid-email") {
    alert("Invalid email address format.");
  } else if (err.code === "auth/weak-password") {
    alert("Password should be at least 6 characters.");
  } else {
    alert(err.message);
  }
} finally {
      setLoading(false);
      setName("");
      setEmail("");
      setSelected(roles[0]);
      setPassword("");
      setConfirmPassword("");
    }
  };

  const handleGoogleSignup = async () => {
    if (selected.name === "Select") {
      alert("Please select a role before signing up.");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

const userDocRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      // ✅ Already registered
      const existingData = userSnap.data();
      alert(`You are already signed up as a ${existingData.role}. Redirecting to dashboard.`);

      if (existingData.role === "Student") {
        nav("/StudentDASH");
      } else if (existingData.role === "Teacher") {
        nav("/TeacherDASH");
      } else {
        alert("Unknown role. Please contact support.");
      }
    }
     else{
       await setDoc(doc(db, "users", user.uid), {
        name: user.displayName,
        email: user.email,
        role: selected.name,
        created: serverTimestamp(),
      });

      alert("Signed up with Google successfully!");
      
       if(selected.id==2){
        nav("/StudentDASH");
      }else if(selected.id==3){
        nav("/TeacherDASH");
      }
    }
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-4 mt-10 rounded-3xl backdrop-blur-md bg-white/10 border border-white/100 shadow-2xl">
      <div>
        <img src="/jeetlogo.png" className="mx-auto h-25 w-auto my-3" alt="JEET Logo" />
        <h1 className="mt-3 text-center text-2xl font-bold tracking-tight text-gray-900">
          Create your account
        </h1>
      </div>

      <form onSubmit={handleEmailSignup} className="space-y-4 max-w-md mx-auto mt-6">
        <div>
          <label className="mb-2 text-sm text-slate-900 font-medium block">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your Full Name"
            className="px-4 py-3 bg-[#f0f1f2] w-full text-sm border border-gray-200 focus:border-black outline-0 rounded-md"
          />
        </div>

        <Listbox value={selected} onChange={setSelected}>
          <Listbox.Label className="block mb-2 text-sm font-medium text-slate-900">Select your role</Listbox.Label>
          <div className="relative">
            <Listbox.Button className="w-full rounded-md bg-white py-2 pl-3 pr-10 text-left text-sm border border-gray-300">
              <span className="block truncate">{selected.name}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-sm ring-1 ring-black/5">
              {roles.map((role) => (
                <Listbox.Option
                  key={role.id}
                  value={role}
                  className={({ active }) =>
                    `cursor-default select-none relative py-2 pl-10 pr-4 ${
                      active ? "bg-indigo-600 text-white" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-semibold" : "font-normal"}`}>{role.name}</span>
                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <div>
          <label className="mb-2 text-sm text-slate-900 font-medium block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="px-4 py-3 bg-[#f0f1f2] w-full text-sm border border-gray-200 focus:border-black outline-0 rounded-md"
          />
        </div>

        <div>
          <label className="mb-2 text-sm text-slate-900 font-medium block">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="px-4 py-3 bg-[#f0f1f2] w-full text-sm border border-gray-200 focus:border-black outline-0 rounded-md"
          />
        </div>

        <div>
          <label className="mb-2 text-sm text-slate-900 font-medium block">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter Password"
            className="px-4 py-3 bg-[#f0f1f2] w-full text-sm border border-gray-200 focus:border-black outline-0 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 px-5 py-2.5 w-full text-[15px] font-medium rounded-md mt-4 ${
            loading ? "bg-gray-400" : "bg-[#420599] hover:bg-[#180335]"
          } text-white`}
        >
          {loading ? <ClipLoader size={18} color="#fff" /> : "Sign Up"}
        </button>
      </form>

      <h1 className="text-center mt-4">Or</h1>

      <button
        type="button"
        onClick={handleGoogleSignup}
        disabled={loading}
        className="flex items-center justify-center w-full gap-2 mt-4 px-5 py-2.5 bg-white hover:bg-gray-200 border text-black font-medium rounded-md"
      >
        {loading ? <ClipLoader size={18} color="#000" /> : (
          <>
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="G" className="w-5 h-5" />
            Sign up with Google
          </>
        )}
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

export default Signup;
