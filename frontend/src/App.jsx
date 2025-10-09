import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModalProvider } from "./context/ModalContext";
import { StudentProvider } from "./context/StudentContext";
import { SessionProvider } from "./context/SessionContext";
import { ToastProvider } from "./context/ToastContext";
import Modal from "./components/Modal";
import ToastContainer from "./components/ToastContainer";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Students from "./pages/Students";
import StudentView from "./pages/StudentView";
import Sessions from "./pages/Sessions";
import Reports from "./pages/Reports";
import LiveRecognition from "./pages/LiveRecognition";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <StudentProvider>
        <SessionProvider>
          <ModalProvider>
            <ToastProvider>
              <Modal />
              <ToastContainer />
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/students" element={<Students />} />
                <Route path="/student/:id" element={<StudentView />} />
                <Route path="/sessions" element={<Sessions />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/live-recognition" element={<LiveRecognition />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </ToastProvider>
          </ModalProvider>
        </SessionProvider>
      </StudentProvider>
    </BrowserRouter>
  );
}

export default App;
