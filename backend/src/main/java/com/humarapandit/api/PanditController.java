package com.humarapandit.api;

import com.humarapandit.api.dto.ChatRequest;
import com.humarapandit.api.dto.ChatResponse;
import com.humarapandit.api.dto.GemstoneRequest;
import com.humarapandit.api.dto.GemstoneResponse;
import com.humarapandit.api.dto.KundaliRequest;
import com.humarapandit.api.dto.KundaliResponse;
import com.humarapandit.service.PanditService;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class PanditController {

  private final PanditService panditService;

  public PanditController(PanditService panditService) {
    this.panditService = panditService;
  }

  @GetMapping("/health")
  public Map<String, String> health() {
    return Map.of("status", "ok", "service", "humara-pandit-backend");
  }

  @PostMapping("/recommend-gemstones")
  public ResponseEntity<?> recommendGemstones(@RequestBody GemstoneRequest request) {
    if (isBlank(request.name()) || isBlank(request.intention())) {
      return ResponseEntity.badRequest()
          .body(new ApiError("Seeker's Name and Primary Intention are required."));
    }

    GemstoneResponse response = panditService.recommendGemstones(request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/kundali-reading")
  public ResponseEntity<?> kundaliReading(@RequestBody KundaliRequest request) {
    if (isBlank(request.name()) || isBlank(request.dob())) {
      return ResponseEntity.badRequest()
          .body(new ApiError("Seeker's Name and Date of Birth are required."));
    }

    KundaliResponse response = panditService.castKundali(request);
    return ResponseEntity.ok(response);
  }

  @PostMapping("/consultation-chat")
  public ResponseEntity<?> consultationChat(@RequestBody ChatRequest request) {
    if (request.messages() == null || request.messages().isEmpty()) {
      return ResponseEntity.badRequest().body(new ApiError("A message history array is required."));
    }

    ChatResponse response = panditService.replyToChat(request);
    return ResponseEntity.ok(response);
  }

  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }
}
