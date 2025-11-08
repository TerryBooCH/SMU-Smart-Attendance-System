package com.smu.smartattendancesystem.services.export;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.QuoteMode;

public class CSVReportGenerator implements ReportGenerator {

    @Override
    public void generate(String title, List<String> headers, List<List<String>> rows, OutputStream out) throws Exception {

        try (OutputStreamWriter writer = new OutputStreamWriter(out, StandardCharsets.UTF_8);
                CSVPrinter printer = new CSVPrinter(
                        writer,
                        CSVFormat.DEFAULT.builder()
                                .setHeader(headers.toArray(new String[0])) // write header row
                                .setQuoteMode(QuoteMode.MINIMAL) // quote only when needed
                                .setSkipHeaderRecord(false)
                                .setIgnoreEmptyLines(true)
                                .build())) {

            for (List<String> row : rows) {
                // Null-safe: Commons CSV prints empty fields for nulls
                printer.printRecord(row);
            }
            printer.flush();
        }
    }

    @Override
    public String getContentType() {
        return "text/csv";
    }

    @Override
    public String getFileExtension() {
        return "csv";
    }
}
