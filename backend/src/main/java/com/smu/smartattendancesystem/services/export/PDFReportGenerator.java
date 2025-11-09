package com.smu.smartattendancesystem.services.export;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.Color;
import java.io.OutputStream;
import java.util.List;

public class PDFReportGenerator implements ReportGenerator {

    @Override
    public void generate(String title, List<String> headers, List<List<String>> rows, OutputStream out)
            throws Exception {
        // Define document layout
        Rectangle pageSize = PageSize.A4.rotate();
        Document doc = new Document(pageSize, 36, 36, 36, 36);
        PdfWriter.getInstance(doc, out);

        // Define fonts
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
        Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 9);

        doc.open();

        // Add title paragraph (e.g. Student Attendance Summary)
        Paragraph p = new Paragraph(title, titleFont);
        p.setSpacingAfter(8f);
        doc.add(p);

        PdfPTable table = new PdfPTable(headers.size());
        table.setWidthPercentage(100);
        table.setHeaderRows(1);

        float[] widths = new float[headers.size()];
        for (int i = 0; i < widths.length; i++)
            widths[i] = 1f;
        table.setWidths(widths);

        // Add header row
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(nullSafe(h), headerFont));
            cell.setBackgroundColor(new Color(230, 230, 230));
            cell.setPadding(6f);
            cell.setHorizontalAlignment(Element.ALIGN_LEFT);
            table.addCell(cell);
        }

        // Add data row
        for (List<String> row : rows) {
            for (int c = 0; c < headers.size(); c++) {
                String val = (c < row.size() && row.get(c) != null) ? row.get(c) : "";
                PdfPCell cell = new PdfPCell(new Phrase(val, cellFont));
                cell.setPadding(5f);
                cell.setHorizontalAlignment(Element.ALIGN_LEFT);
                table.addCell(cell);
            }
        }

        doc.add(table);
        doc.close();
        out.flush();
    }

    private static String nullSafe(String s) {
        return s == null ? "" : s;
    }

    @Override
    public String getContentType() {
        return "application/pdf";
    }

    @Override
    public String getFileExtension() {
        return "pdf";
    }
}
