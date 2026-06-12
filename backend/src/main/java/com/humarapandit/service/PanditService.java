package com.humarapandit.service;

import com.humarapandit.api.dto.ChakraReading;
import com.humarapandit.api.dto.ChatMessage;
import com.humarapandit.api.dto.ChatRequest;
import com.humarapandit.api.dto.ChatResponse;
import com.humarapandit.api.dto.GemstoneRecommendation;
import com.humarapandit.api.dto.GemstoneRequest;
import com.humarapandit.api.dto.GemstoneResponse;
import com.humarapandit.api.dto.KundaliHouse;
import com.humarapandit.api.dto.KundaliReading;
import com.humarapandit.api.dto.KundaliRequest;
import com.humarapandit.api.dto.KundaliResponse;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class PanditService {

  public GemstoneResponse recommendGemstones(GemstoneRequest request) {
    int budget = request.budget() == null || request.budget() <= 0 ? 5000 : request.budget();
    String chakra = isBlank(request.selectedChakra()) ? "Heart" : request.selectedChakra();
    GemstoneProfile profile = profileFor(chakra);

    return new GemstoneResponse(
        "Blessings, " + request.name().trim() + ". Your intention for " + request.intention()
            + " shows a need to steady the " + profile.chakraName()
            + " center while keeping decisions grounded and practical.",
        profile.aura(),
        List.of(
            new ChakraReading(
                profile.chakraName(),
                profile.sanskrit(),
                "Needs gentle balancing",
                "This center reflects your stated focus and benefits from steady mantra, breathwork, and a consistent daily ritual."),
            new ChakraReading(
                "Solar Plexus",
                "Manipura",
                "Strengthening",
                "Confidence and disciplined action are the support energies for your current path.")
        ),
        List.of(
            new GemstoneRecommendation(
                profile.gemstone(),
                profile.gemSanskrit(),
                profile.colorClass(),
                profile.graha(),
                "Supports clarity, steadiness, and emotional alignment for " + request.intention() + ".",
                "Cleanse the stone in water, sit quietly on a Thursday morning, and chant the suggested mantra 108 times before wearing.",
                "Rs " + Math.round(budget * 0.75)
            ),
            new GemstoneRecommendation(
                "Clear Quartz",
                "Sphatik",
                "clear",
                "Chandra",
                "Amplifies intention and keeps the ritual simple when budget or availability is limited.",
                "Keep it near your prayer space and hold it during five minutes of slow breathing.",
                "Rs " + Math.max(500, Math.round(budget * 0.15))
            )
        ),
        76,
        "Chant 'Om Shanti Shanti Shanti' for 11 minutes at sunrise, then write one practical action for the day."
    );
  }

  public KundaliResponse castKundali(KundaliRequest request) {
    String focus = isBlank(request.currentFocus()) ? "general wellbeing" : request.currentFocus();

    return new KundaliResponse(
        "Leo (Simha)",
        "Magha",
        "Rahu-Jupiter",
        List.of(
            new KundaliHouse(1, "Leo", List.of("Asc")),
            new KundaliHouse(2, "Virgo", List.of("Su", "Me")),
            new KundaliHouse(5, "Sagittarius", List.of("Ju")),
            new KundaliHouse(7, "Aquarius", List.of("Sa")),
            new KundaliHouse(10, "Taurus", List.of("Mo", "Ve")),
            new KundaliHouse(11, "Gemini", List.of("Ra"))
        ),
        List.of(
            new KundaliReading(
                "Birth Chart Overview",
                request.name().trim() + "'s chart indicates strong communication and leadership themes, especially around " + focus + "."),
            new KundaliReading(
                "Practical Guidance",
                "Use disciplined planning before major commitments. Saturday reflection and Thursday learning rituals are favored.")
        ),
        "Offer water to the morning sun and keep a simple gratitude practice for 21 days."
    );
  }

  public ChatResponse replyToChat(ChatRequest request) {
    ChatMessage lastUserMessage = request.messages().stream()
        .filter(message -> "user".equalsIgnoreCase(message.role()))
        .reduce((first, second) -> second)
        .orElse(new ChatMessage("user", "guidance"));

    String topic = isBlank(lastUserMessage.content()) ? "your present concern" : lastUserMessage.content().trim();
    return new ChatResponse(
        "I hear you. For " + topic
            + ", begin with one steady breath and one honest action. Keep your ritual simple: light a diya, chant 'Om Shanti' 21 times, and choose the smallest practical step you can complete today."
    );
  }

  private GemstoneProfile profileFor(String chakra) {
    return switch (chakra.toLowerCase()) {
      case "root" -> new GemstoneProfile("Root", "Muladhara", "Grounded Ruby Crimson", "Ruby", "Manik", "red", "Surya");
      case "sacral" -> new GemstoneProfile("Sacral", "Svadhisthana", "Warm Moonstone Orange", "Moonstone", "Chandrakant", "orange", "Chandra");
      case "solar plexus" -> new GemstoneProfile("Solar Plexus", "Manipura", "Golden Amber", "Yellow Sapphire", "Pukhraj", "yellow", "Guru");
      case "throat" -> new GemstoneProfile("Throat", "Vishuddha", "Clear Sky Blue", "Blue Topaz", "Neel Topaz", "blue", "Shani");
      case "third eye" -> new GemstoneProfile("Third Eye", "Ajna", "Deep Indigo", "Amethyst", "Jamunia", "purple", "Guru");
      case "crown" -> new GemstoneProfile("Crown", "Sahasrara", "Soft Violet White", "Clear Quartz", "Sphatik", "clear", "Chandra");
      default -> new GemstoneProfile("Heart", "Anahata", "Lush Emerald Green", "Emerald", "Panna", "green", "Budh");
    };
  }

  private boolean isBlank(String value) {
    return value == null || value.trim().isEmpty();
  }

  private record GemstoneProfile(
      String chakraName,
      String sanskrit,
      String aura,
      String gemstone,
      String gemSanskrit,
      String colorClass,
      String graha
  ) {
  }
}
