package com.humarapandit.api.dto;

public record GemstoneRecommendation(
    String name,
    String sanskrit,
    String colorClass,
    String graha,
    String benefits,
    String ritualMethod,
    String approxPrice
) {
}
