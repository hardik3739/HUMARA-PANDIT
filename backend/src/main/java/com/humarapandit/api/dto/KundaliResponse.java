package com.humarapandit.api.dto;

import java.util.List;

public record KundaliResponse(
    String ascendant,
    String nakshatra,
    String mahadasha,
    List<KundaliHouse> chartData,
    List<KundaliReading> readings,
    String remedy
) {
}
