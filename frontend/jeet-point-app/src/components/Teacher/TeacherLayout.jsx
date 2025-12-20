import { Outlet } from "react-router-dom";
import NavTeacher from "../NavTeacher";

export default function TeacherLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavTeacher />
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
