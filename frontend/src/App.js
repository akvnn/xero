import { Routes, Route } from "react-router-dom";

import Signup from "./pages/publicPages/signup/Signup";
import Login from "./pages/publicPages/login/Login";
import ProtectedRoutes from "./pages/privatePages/protectedRoutes/ProtectedRoutes";
import Home from "./pages/privatePages/home/Home";
import Profile from "./pages/privatePages/profile/Profile";
import Messages from "./pages/privatePages/messages/Messages";
import Settings from "./pages/privatePages/settings/Settings";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
