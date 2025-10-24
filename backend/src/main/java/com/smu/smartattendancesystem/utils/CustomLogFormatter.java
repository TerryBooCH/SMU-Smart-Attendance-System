package com.smu.smartattendancesystem.utils;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.logging.Formatter;
import java.util.logging.LogRecord;

public class CustomLogFormatter extends Formatter {
    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

    @Override
    public String format(LogRecord record) {
        String timestamp = dateFormat.format(new Date(record.getMillis()));
        return String.format("[%s] %s: %s%n",
                timestamp,
                record.getLevel().getName(),
                record.getMessage());
    }
}
