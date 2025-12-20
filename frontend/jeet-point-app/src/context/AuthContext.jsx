import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth,db } from "../components/Firebase.jsx";
import { doc, getDoc } from "firebase/firestore";
import "./Loader.css";

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);//firebase user object
    const [userData, setUserData] = useState(null); //Firebase user data from Firestore
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
            
            setUser(currentUser);

            if (currentUser) {

                try{
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    setUserData(userDocSnap.data());
                    
                } else {
                    setUserData(null);
                    // User document does not exist, handle accordingly
                    console.log("No such document!");
                }
            }catch (error) {
                console.error("Error fetching user data:", error);
                setUserData(null);
            }
        }else{
                setUserData(null);
                }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="loader"> </div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user,userData, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

