package com.smu.smartattendancesystem.dto;

import java.util.Map;

public record LoginResponse(
        String accessToken,
        long expiresIn,
        String tokenType,
        Map<String, Object> user) {
}
