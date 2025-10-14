package com.smu.smartattendancesystem.utils;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

public class ResponseFormatting {
    // Helper methods for response formatting
    public static Map<String, String> createErrorResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("error", message);
        response.put("status", "error");
        return response;
    }

    public static Map<String, Object> createErrorResponse(String message, String field) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("error", message);
        response.put("status", "error");
        response.put("field", field);
        return response;
    }

    public static Map<String, String> createSuccessResponse(String message) {
        Map<String, String> response = new HashMap<>();
        response.put("message", message);
        response.put("status", "success");
        return response;
    }
}
