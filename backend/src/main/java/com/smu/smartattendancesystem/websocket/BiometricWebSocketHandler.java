package com.smu.smartattendancesystem.websocket;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import com.smu.smartattendancesystem.dto.DetectionResultDTO;
import com.smu.smartattendancesystem.dto.RecognitionResponse;
import com.smu.smartattendancesystem.services.BiometricService;

@Component
public class BiometricWebSocketHandler extends BinaryWebSocketHandler {

    private final BiometricService biometricService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public BiometricWebSocketHandler(BiometricService biometricService) {
        this.biometricService = biometricService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Increase allowed message size per session
        session.setBinaryMessageSizeLimit(10 * 1024 * 1024); // 10 MB
        session.setTextMessageSizeLimit(10 * 1024 * 1024);   // 10 MB
        System.out.println("WebSocket connected: " + session.getId());
    }

    // Decode base64 image in the format data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...
    private byte[] decodeImage(String base64Image) {
        String[] parts = base64Image.split(",");
        if (parts.length < 2) throw new IllegalArgumentException("Invalid base64 image format");

        return Base64.getDecoder().decode(parts[1]);
    }

    private void handleDetection(WebSocketSession session, JsonNode json) throws IOException {
        String base64Image = json.get("image").asText();
        byte[] imageBytes = decodeImage(base64Image);

        String detector_type = getOptionalText(json, "detector_type");

        List<DetectionResultDTO> detectionResults = biometricService.detect(imageBytes, detector_type);
        sendMessage(session, detectionResults);
    }

    private void handleRecognition(WebSocketSession session, JsonNode json) throws IOException {
        // Decode base64 image
        String base64Image = json.get("image").asText();
        byte[] imageBytes = decodeImage(base64Image);

        // Extract parameters
        long session_id = json.get("session_id").asLong();
        String detector_type = getOptionalText(json, "detector_type");
        String type = getOptionalText(json, "type");
        String metric_name = getOptionalText(json, "metric_name");
        Double manualThreshold = getOptionalDouble(json, "manualThreshold");
        Double autoThreshold = getOptionalDouble(json, "autoThreshold");
        
        // Delegate processing to service
        RecognitionResponse response = biometricService.recognize(
            imageBytes, session_id, detector_type, type, metric_name, manualThreshold, autoThreshold
        );

        ObjectNode success = objectMapper.createObjectNode();
        success.put("status", "success");
        success.set("result", objectMapper.valueToTree(response));

        sendMessage(session, success);
    }


    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        try {
            JsonNode json = objectMapper.readTree(message.getPayload());

            if (!json.has("event") || json.get("event").asText().isEmpty()) {
                throw new IllegalArgumentException("Missing required field: 'event'");
            }

            switch (json.get("event").asText()) {
                case "detect": {
                    handleDetection(session, json); 
                    break;
                }
                case "recognize": {
                    handleRecognition(session, json);
                    break;
                }
                default: throw new IllegalArgumentException("Invalid field 'event'.");
            }
        } catch (IllegalArgumentException | JsonProcessingException e) {
            ObjectNode error = objectMapper.createObjectNode();
            error.put("status", "error");
            error.put("message", e.getMessage());
            sendMessage(session, error);
        } catch (Exception e) {
            e.printStackTrace();
            ObjectNode error = objectMapper.createObjectNode();
            error.put("status", "error");
            error.put("message", "An error occurred while recognizing.");
            sendMessage(session, error);
        }
    }

    private void sendMessage(WebSocketSession session, Object payload) {
        try {
            String jsonString = objectMapper.writeValueAsString(payload);
            sendMessage(session, new TextMessage(objectMapper.writeValueAsString(jsonString)));
        } catch (IOException e) {}
    }

    private void sendMessage(WebSocketSession session, WebSocketMessage<?> message) {
        try {
            session.sendMessage(message);
        } catch (IOException e) {}
    }

    private String getOptionalText(JsonNode json, String field) {
        JsonNode node = json.get(field);
        return (node == null || node.isNull()) ? null : node.asText();
    }

    private Double getOptionalDouble(JsonNode json, String field) {
        JsonNode node = json.get(field);
        return (node == null || node.isNull()) ? null : node.asDouble();
    }
}