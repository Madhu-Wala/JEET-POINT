// src/components/Student/StudentLayout.jsx
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import NavStudent from "../NavStudent";
import { AuthContext } from "../../context/AuthContext";

export default function StudentLayout() {
  const { user, authLoading } = useContext(AuthContext);
  const nav = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      nav("/login");
    }
  }, [authLoading, user, nav]);

  if (authLoading) return null;

  return <div className="bg-gray-100 min-h-screen flex flex-col">
      <NavStudent user={user} />
      <div className="p-4">
        <Outlet key={user?.uid} />
      </div>
    </div>
  
}
