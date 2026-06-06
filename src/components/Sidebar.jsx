import { FaHome, FaTrophy, FaTruck, FaUserShield, FaBook, FaMapMarkerAlt, FaLifeRing, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/Dashboard.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="logo">TALENTO</h2>
      <nav className="nav-menu">
        <div><FaHome /><span>Dashboard</span></div>
        <div><FaTrophy /><span>Leaderboard</span></div>
        <div><FaTruck /><span>Shipment</span></div>
        <div><FaUserShield /><span>Administration</span></div>
        <div><FaBook /><span>Library</span></div>
        <div><FaMapMarkerAlt /><span>Maps</span></div>
        <div><FaLifeRing /><span>Support</span></div>
        <div><FaCog /><span>Setting</span></div>
        <div><FaSignOutAlt /><span>Log Out</span></div>
      </nav>
    </aside>
  );
}
