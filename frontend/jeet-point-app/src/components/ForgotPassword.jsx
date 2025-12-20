import { useState } from "react";
import { auth } from "./Firebase";
import { sendPasswordResetEmail } from "firebase/auth"; 
import { useNavigate } from "react-router-dom";
import "../context/Loader.css";

function ForgotPassword() { 
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);
    const nav = useNavigate();

    let handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        if(email===""){
            return
        }
        sendPasswordResetEmail(auth,email)
        .then(()=>{
            alert("Email sent successfully. Please check your Spam folder, use the link to reset password.");
            nav("/login");
        })
        .catch((error)=>alert(error))
        .finally(()=>{
        setEmail("");
        })
}
    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-white/70">
                <div className="loader"></div>
            </div>
        );
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
                <p className="mb-6">Enter your email to reset your password.</p>
                <form onSubmit={handleResetPassword}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        required
                    />
                    <button
                        type="submit"

                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}
export default ForgotPassword;