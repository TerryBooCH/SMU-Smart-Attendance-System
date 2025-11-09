package com.smu.smartattendancesystem.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import com.smu.smartattendancesystem.websocket.BiometricWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    private final BiometricWebSocketHandler biometricWebSocketHandler;

    public WebSocketConfig(BiometricWebSocketHandler biometricWebSocketHandler) {
        this.biometricWebSocketHandler = biometricWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(biometricWebSocketHandler, "/ws/biometric")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }
}