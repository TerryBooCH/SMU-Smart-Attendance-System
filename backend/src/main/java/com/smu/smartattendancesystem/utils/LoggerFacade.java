package com.smu.smartattendancesystem.utils;

import java.io.IOException;
import java.util.logging.*;

public class LoggerFacade {
    private static Logger logger;

    static {
        logger = Logger.getLogger("AttendanceLogger");
        setupLogger();
    }

    private static void setupLogger() {
        try {
            // FileHandler: append mode true
            FileHandler fileHandler = new FileHandler("attendance.log", true);
            fileHandler.setFormatter(new CustomLogFormatter());

            logger.addHandler(fileHandler);
            logger.setUseParentHandlers(false); // prevents console duplication
            logger.setLevel(Level.INFO);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void info(String message) {
        logger.info(message);
    }

    public static void warning(String message) {
        logger.warning(message);
    }

    public static void severe(String message) {
        logger.severe(message);
    }
}
