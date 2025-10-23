package com.smu.smartattendancesystem.dto;

public class DetectionResultDTO {
    private double x;
	private double y;
	private double width;
	private double height;
	private double score;

	public DetectionResultDTO(double x, double y, double width, double height, double score) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.score = score;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public double getWidth() { return width; }
    public double getHeight() { return height; }
    public double getScore() { return score; }
    public void setX(double x) { this.x = x; }
    public void setY(double y) { this.y = y; }
    public void setWidth(double width) { this.width = width; }
    public void setHeight(double height) { this.height = height; }
    public void setScore(double score) { this.score = score; }
}