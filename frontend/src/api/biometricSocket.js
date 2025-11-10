import SockJS from "sockjs-client";

let socket = null;

export function connectWebSocket(onMessage) {
  socket = new SockJS("http://localhost:8080/ws/biometric");

  socket.onopen = () => {
    console.log("SockJS connected");
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Invalid JSON:", event.data);
    }
  };

  socket.onclose = () => {
    console.log("SockJS disconnected");
  };

  socket.onerror = (error) => {
    console.error("SockJS error:", error);
  };
}

export function sendDetection(base64Image, detectorType) {
  if (!socket) return;
  const payload = {
    event: "detect",
    image: base64Image,
    detector_type: detectorType || null,
  };
  socket.send(JSON.stringify(payload));
}

export function sendRecognition(
  base64Image,
  sessionId,
  detectorType = null,
  type = null,
  metricName = null,
  manualThreshold = null,
  autoThreshold = null
) {
  if (!socket) return;
  const payload = {
    event: "recognize",
    image: base64Image,
    session_id: sessionId,
    detector_type: detectorType,
    type,
    metric_name: metricName,
    manualThreshold,
    autoThreshold
  };
  socket.send(JSON.stringify(payload));
}


export function closeWebSocket() {
  if (socket) socket.close();
}
