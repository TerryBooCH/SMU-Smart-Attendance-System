package com.smu.smartattendancesystem.biometrics.detection;
import java.util.List;

import org.opencv.core.MatOfRect2d;
import org.opencv.core.Rect;
import org.opencv.core.Rect2d;
import com.smu.smartattendancesystem.dto.DetectionResultDTO;

public class DetectionResult implements Comparable<DetectionResult>{
    private final Rect2d bbox;
    private final double score;
    
    public DetectionResult(Rect2d bbox, double score) {
        this.bbox = bbox;
        this.score = score;
    };

    public DetectionResult(Rect2d bbox) {
        this(bbox, 0.0);
    };

    public DetectionResult(Rect bbox, double score) {
        this(new Rect2d(bbox.x, bbox.y, bbox.width, bbox.height), score);
    }

    public DetectionResult(Rect bbox) {
        this(new Rect2d(bbox.x, bbox.y, bbox.width, bbox.height), 0.0);
    }
    
    @Override
    public int compareTo(DetectionResult other) {
        int scoreComparison = -Double.compare(this.score, other.score);
        if (scoreComparison != 0) return scoreComparison;

        int areaComparison = -Double.compare(this.bbox.area(), other.bbox.area());
        if (areaComparison != 0) return areaComparison;

        return 0;
    }

    @Override
    public String toString() {
        return String.format("<Bbox: %s, Score: %.3f>", this.bbox.toString(), this.score);
    }

    public double computeIOU(Rect2d other) {
        if (this.bbox.area() <= 0 || other.area() <= 0) return 0.0;
        
        double xLeft = Math.max(this.bbox.x, other.x);
        double yTop = Math.max(this.bbox.y, other.y);
        double xRight = Math.min(this.bbox.x + this.bbox.width, other.x + other.width);
        double yBottom = Math.min(this.bbox.y + this.bbox.height, other.y + other.height);
        
        // If there is no intersection, return 0.
        if (xRight <= xLeft || yBottom <= yTop) return 0.0;
        
        double intersectionArea = (xRight - xLeft) * (yBottom - yTop);
        double unionArea = this.bbox.area() + other.area() - intersectionArea;
        
        return intersectionArea / unionArea;
    }

    public double computeIOU(DetectionResult other) {
        return computeIOU(other.bbox);
    }

    public Rect2d getBbox() {
        return bbox;
    }
    
    public double getScore() {
        return score;
    }

    public static MatOfRect2d toMatOfRect2d(List<DetectionResult> results) {
        Rect2d[] rects = results.stream()
                .map(DetectionResult::getBbox)
                .toArray(Rect2d[]::new);
        return new MatOfRect2d(rects);
    }

    public DetectionResultDTO toDTO() {
        return new DetectionResultDTO(bbox.x, bbox.y, bbox.width, bbox.height, score);
    }
}
