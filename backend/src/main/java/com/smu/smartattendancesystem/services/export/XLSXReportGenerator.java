package com.smu.smartattendancesystem.services.export;

import java.io.OutputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;

public class XLSXReportGenerator implements ReportGenerator {

    @Override
    public void generate(List<String> headers, List<List<String>> rows, OutputStream out) throws Exception {
        SXSSFWorkbook wb = new SXSSFWorkbook(100);
        try {
            // Create a streaming workbook to stream rows
            SXSSFSheet sheet = wb.createSheet("Export");
            sheet.trackAllColumnsForAutoSizing();

            // Define cell styles
            Font headerFont = wb.createFont();
            headerFont.setBold(true);

            CellStyle headerStyle = wb.createCellStyle();
            headerStyle.setFont(headerFont);

            CellStyle textStyle = wb.createCellStyle();
            DataFormat fmt = wb.createDataFormat();
            textStyle.setDataFormat(fmt.getFormat("@")); // treat all values as plain text to prevent excel from
                                                         // auto-formatting

            // Create header row
            Row headerRow = sheet.createRow(0);
            for (int c = 0; c < headers.size(); c++) {
                Cell cell = headerRow.createCell(c, CellType.STRING);
                cell.setCellStyle(headerStyle);
                cell.setCellValue(sanitizeForExcel(headers.get(c)));
            }

            sheet.createFreezePane(0, 1); // keeps header row visible when scrolling

            // Create data rows
            int r = 1;
            for (List<String> row : rows) {
                Row xRow = sheet.createRow(r++); // create a row for each List<String> record
                for (int c = 0; c < headers.size(); c++) {
                    Cell cell = xRow.createCell(c, CellType.STRING); // creates the cell in each row
                    cell.setCellStyle(textStyle);
                    String value = (c < row.size() && row.get(c) != null) ? row.get(c) : ""; // handles null values
                    cell.setCellValue(sanitizeForExcel(value));
                }
            }

            // Auto-size columns
            for (int c = 0; c < headers.size(); c++) {
                sheet.autoSizeColumn(c);
            }

            // Write the workbook to the output stream
            wb.write(out);
            out.flush();
        } finally {
            wb.dispose();
            wb.close();
        }
    }

    // Prevent Excel from interpreting strings as formulas by appending a
    // single quote (') if the value begins with a ('=', '+', '-', or '@')
    private static String sanitizeForExcel(String v) {
        if (v == null || v.isEmpty())
            return "";
        char c = v.charAt(0);
        return (c == '=' || c == '+' || c == '-' || c == '@') ? "'" + v : v;
    }

    @Override
    public String getContentType() {
        return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    @Override
    public String getFileExtension() {
        return "xlsx";
    }
}
