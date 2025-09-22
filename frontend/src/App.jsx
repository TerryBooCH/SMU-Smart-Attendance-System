import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Students from "./pages/Students";
import Sessions from "./pages/Sessions";
import Reports from "./pages/Reports";
import LiveRecognition from "./pages/LiveRecognition";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/students" element={<Students />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/live-recognition" element={<LiveRecognition />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
