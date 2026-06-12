package com.humarapandit.api.dto;

import java.util.List;

public record ChatRequest(List<ChatMessage> messages) {
}
