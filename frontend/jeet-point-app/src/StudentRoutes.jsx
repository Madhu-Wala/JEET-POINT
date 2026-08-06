import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Unauthorized from "./Unauthorized";

export default function StudentRoute({ children }) {
  const { userData } = useContext(AuthContext);

  if (!userData) {
    return <Unauthorized />;
  }

  return userData.role === "Student"
    ? children
    : <Unauthorized />;
}