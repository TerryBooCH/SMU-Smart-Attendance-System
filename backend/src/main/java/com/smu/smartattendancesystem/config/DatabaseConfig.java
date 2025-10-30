package com.smu.smartattendancesystem.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class DatabaseConfig {

    @Value("${database.mode:runtime}")
    private String databaseMode;

    @Value("${firebase.enabled:false}")
    private boolean firebaseEnabled;

    @Value("${firebase.sync-on-startup:true}")
    private boolean syncOnStartup;

    public boolean isRuntimeMode() {
        return "runtime".equals(databaseMode);
    }

    public boolean isPersistentMode() {
        return "persistent".equals(databaseMode);
    }

    public boolean isFirebaseEnabled() {
        return firebaseEnabled;
    }

    public boolean isSyncOnStartup() {
        return syncOnStartup && firebaseEnabled;
    }
}
