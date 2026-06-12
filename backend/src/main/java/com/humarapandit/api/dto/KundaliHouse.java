package com.humarapandit.api.dto;

import java.util.List;

public record KundaliHouse(
    int house,
    String sign,
    List<String> planets
) {
}
