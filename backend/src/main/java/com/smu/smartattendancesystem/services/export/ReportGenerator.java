package com.smu.smartattendancesystem.services.export;

import java.io.OutputStream;
import java.util.List;

public interface ReportGenerator {

    /**
     * Writes a report (CSV, PDF, Excel) to the given OutputStream.
     *
     * @param headers Column headers (e.g., ["Student ID", "Name", "Status"])
     * @param rows    Table data (each row corresponds to one record)
     * @param out     OutputStream where file bytes will be written
     * @throws Exception if any error occurs during generation
     */
    void generate(List<String> headers, List<List<String>> rows, OutputStream out) throws Exception;

    /** @return MIME type (e.g., "text/csv", "application/pdf") */
    String getContentType();

    /** @return File extension without dot (e.g., "csv", "xlsx", "pdf") */
    String getFileExtension();
}
