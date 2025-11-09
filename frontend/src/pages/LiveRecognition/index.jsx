import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LiveRecognitionSidebar from "./LiveRecognitionSidebar";
import MainRecognitionScreen from "./MainRecognitionScreen";
import ControlBar from "./ControlBar";
import useSession from "../../hooks/useSession";
import useToast from "../../hooks/useToast";

const LiveRecognition = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSessionById } = useSession();
  const { showToast } = useToast();

  const [isCameraOn, setIsCameraOn] = useState(true);
  const [activeSidebar, setActiveSidebar] = useState("notifications");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!id || hasFetched.current) return;
    hasFetched.current = true;

    const fetchSession = async () => {
      try {
        const data = await fetchSessionById(id);
        if (data && data.open === false) {
          showToast("This session is closed.", "warning");
          navigate("/sessions");
        }
      } catch (err) {
        console.error("Failed to fetch session:", err);
        showToast("Failed to fetch session data.", "error");
        navigate("/sessions");
      }
    };

    fetchSession();
  }, [id, fetchSessionById, navigate, showToast]);

  return (
    <div className="min-h-screen flex">
      <main className="h-screen w-full bg-[#fafafa] flex flex-col">
        <div className="px-4 pt-3 flex flex-col overflow-hidden">
          <MainRecognitionScreen isCameraOn={isCameraOn} />
        </div>
        <ControlBar
          id={id}
          isCameraOn={isCameraOn}
          setIsCameraOn={setIsCameraOn}
          activeSidebar={activeSidebar}
          setActiveSidebar={setActiveSidebar}
        />
      </main>

      <LiveRecognitionSidebar
        id={id}
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
      />
    </div>
  );
};

export default LiveRecognition;
