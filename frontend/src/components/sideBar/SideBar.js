import { Link } from "react-router-dom";
import { IoHome, IoSearch, IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import { FaRegEnvelope } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";
import "./SideBar.css";

const SideBar = () => {
  return (
    <div className="navbarContainer">
      <navbar className="navbar">
        <ul>
          <li className="listItem" data-href="home">
            <Link to="/home" className="navLink">
              <IoHome className="icon-spacing" /> Home
            </Link>
          </li>
          <li to="#" className="listItem" data-href="search">
            <Link className="navLink">
              <IoSearch className="icon-spacing" /> Search
            </Link>
          </li>

          <li to="/messages" className="listItem" data-href="messages">
            <Link className="navLink">
              <FaRegEnvelope className="icon-spacing" />
              Messages
            </Link>
          </li>
          <li to="/profile" className="listItem" data-href="profile">
            <Link className="navLink">
              <IoPersonOutline className="icon-spacing" />
              Profile
            </Link>
          </li>
          <li to="/settings" className="listItem" data-href="settings">
            <Link className="navLink">
              <IoSettingsOutline className="icon-spacing" />
              Settings
            </Link>
          </li>
        </ul>
      </navbar>
      <button className="btn navBtn" id="post">
        Post
      </button>
      <div className="profileNavbar">
        <img src="" alt="" className="profilePic" id="profilePic" />
        <div className="profileName">
          <h3 className="name" id="profileName">
            Demo
          </h3>
          <p className="username" id="profileUsername"></p>
        </div>
        <IoIosArrowDown className="fa-chevron-down" />
      </div>
    </div>
  );
};

export default SideBar;
