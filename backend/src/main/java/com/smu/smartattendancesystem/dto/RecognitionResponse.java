package com.smu.smartattendancesystem.dto;

import java.util.*;

public record RecognitionResponse(
    Map<String, List<String>> warnings,
    List<RecognitionResultDTO> results
) {}