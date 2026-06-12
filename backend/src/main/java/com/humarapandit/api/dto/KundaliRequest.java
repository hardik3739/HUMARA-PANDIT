package com.humarapandit.api.dto;

public record KundaliRequest(
    String name,
    String dob,
    String tob,
    String pob,
    String currentFocus
) {
}
