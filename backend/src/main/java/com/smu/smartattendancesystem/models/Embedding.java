package com.smu.smartattendancesystem.models;

import jakarta.persistence.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(
    name = "embeddings",
    uniqueConstraints = @UniqueConstraint(columnNames = {"detector", "recognizer", "face_data_id"})
)
public class Embedding extends BaseEntity {

    @Column(nullable = false)
    private String detector;

    @Column(nullable = false)
    private String recognizer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "face_data_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private FaceData faceData;

    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(nullable = false)
    private byte[] vector;   // stored as BLOB


    public Embedding() {}

    public Embedding(String detector, String recognizer, FaceData faceData, double[] vector) {
        this.detector = detector;
        this.recognizer = recognizer;
        this.faceData = faceData;
        this.vector = doubleArrayToBytes(vector);
    }

    // Convert double[] → byte[]
    private static byte[] doubleArrayToBytes(double[] values) {
        byte[] bytes = new byte[values.length * Double.BYTES];
        for (int i = 0; i < values.length; i++) {
            long bits = Double.doubleToRawLongBits(values[i]);
            for (int j = 0; j < 8; j++) {
                bytes[i * 8 + j] = (byte) (bits >>> (j * 8));
            }
        }
        return bytes;
    }

    // Convert byte[] → double[]
    private static double[] bytesArrayToDouble(byte[] bytes) {
        int count = bytes.length / Double.BYTES;
        double[] arr = new double[count];
        for (int i = 0; i < count; i++) {
            long bits = 0;
            for (int j = 0; j < 8; j++) {
                bits |= ((long) bytes[i * 8 + j] & 0xff) << (j * 8);
            }
            arr[i] = Double.longBitsToDouble(bits);
        }
        return arr;
    }

    // Getters and Setters
    public String getDetector() {
        return detector;
    }

    public void setDetector(String detector) {
        this.detector = detector;
    }

    public String getRecognizer() {
        return recognizer;
    }

    public void setRecognizer(String recognizer) {
        this.recognizer = recognizer;
    }

    public FaceData getFaceData() {
        return faceData;
    }

    public void setFaceData(FaceData faceData) {
        this.faceData = faceData;
    }

    public double[] getVector() {
        return bytesArrayToDouble(vector);
    }

    public void setVector(double[] vector) {
        this.vector = doubleArrayToBytes(vector);
    }
}
