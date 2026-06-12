package com.humarapandit.api.dto;

import java.util.List;

public record GemstoneResponse(
    String prediction,
    String energyAuraColor,
    List<ChakraReading> chakras,
    List<GemstoneRecommendation> recommendedGemstones,
    int transitBalanceScore,
    String remedialRitual
) {
}
