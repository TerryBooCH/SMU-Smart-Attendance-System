import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import { AuthProvider } from "./context/AuthContext";
import { ModalProvider } from "./context/ModalContext";
import { StudentProvider } from "./context/StudentContext";
import { SessionProvider } from "./context/SessionContext";
import { RosterProvider } from "./context/RosterContext";
import { AttendanceProvider } from "./context/AttendanceContext";
import { ToastProvider } from "./context/ToastContext";
import Modal from "./components/Modal";
import ToastContainer from "./components/ToastContainer";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import SignIn from "./pages/SignIn";
import Students from "./pages/Students";
import StudentView from "./pages/StudentView";
import Sessions from "./pages/Sessions";
import SessionView from "./pages/SessionView";
import Rosters from "./pages/Rosters";
import RosterView from "./pages/RosterView";
import Reports from "./pages/Reports";
import LiveRecognition from "./pages/LiveRecognition";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StudentProvider>
          <RosterProvider>
            <SessionProvider>
              <AttendanceProvider>
                <ModalProvider>
                  <SidebarProvider>
                    <ToastProvider>
                      <Modal />
                      <ToastContainer />
                      <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/students" element={<Students />} />
                        <Route path="/student/:id" element={<StudentView />} />
                        <Route path="/rosters" element={<Rosters />} />
                        <Route path="/roster/:id" element={<RosterView />} />
                        <Route path="/sessions" element={<Sessions />} />
                        <Route path="/session/:id/" element={<SessionView />} />
                        <Route
                          path="/session/:id/live-recognition"
                          element={<LiveRecognition />}
                        />
                        <Route path="/reports" element={<Reports />} />
                        <Route
                          path="/live-recognition"
                          element={<LiveRecognition />}
                        />
                        <Route path="/settings" element={<Settings />} />
                      </Routes>
                    </ToastProvider>
                  </SidebarProvider>
                </ModalProvider>
              </AttendanceProvider>
            </SessionProvider>
          </RosterProvider>
        </StudentProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
