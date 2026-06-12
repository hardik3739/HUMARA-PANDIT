package com.humarapandit.api;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class PanditControllerTest {

  @Autowired
  private MockMvc mockMvc;

  @Test
  void healthReturnsOk() throws Exception {
    mockMvc.perform(get("/api/health"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.status").value("ok"));
  }

  @Test
  void gemstoneRecommendationMatchesFrontendShape() throws Exception {
    mockMvc.perform(post("/api/recommend-gemstones")
            .contentType(MediaType.APPLICATION_JSON)
            .content("""
                {
                  "name": "Asha",
                  "intention": "career clarity",
                  "budget": 7000,
                  "selectedChakra": "Heart"
                }
                """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.prediction").isString())
        .andExpect(jsonPath("$.chakras", hasSize(2)))
        .andExpect(jsonPath("$.recommendedGemstones", hasSize(2)))
        .andExpect(jsonPath("$.transitBalanceScore").value(76));
  }

  @Test
  void kundaliRequiresNameAndDob() throws Exception {
    mockMvc.perform(post("/api/kundali-reading")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.error").isString());
  }
}
