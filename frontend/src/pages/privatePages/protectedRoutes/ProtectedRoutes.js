import { Outlet } from "react-router-dom";
import SideBar from "../../../components/sideBar/SideBar";
import SideBoard from "../../../components/sideBoard/SideBoard";
import "./ProtectedRoutes.css";

const ProtectedRoutes = () => {
  return (
    <div>
      <div className="homeContainer">
        <SideBar />
        <Outlet />
        <SideBoard />
      </div>
    </div>
  );
};

export default ProtectedRoutes;
