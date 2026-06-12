package com.humarapandit.api.dto;

public record GemstoneRequest(
    String name,
    String intention,
    String deepenIntent,
    Integer budget,
    String selectedChakra
) {
}
