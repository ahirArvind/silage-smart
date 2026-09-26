import { createFileRoute } from "@tanstack/react-router";

/**
 * Prototype AI service endpoint.
 *
 * Returns DEMO predictions only. The response shape is kept stable so a real
 * Python ML API (computer vision + spectral ML + sensor fusion) can be plugged
 * in later without changing the frontend.
 */
export const Route = createFileRoute("/api/analyze")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown> = {};
        try {
          body = (await request.json()) as Record<string, unknown>;
        } catch {
          body = {};
        }
        const sampleType = body["sample_type"] === "silage" ? "silage" : "feed";
        const sensors = (body["sensor_data"] ?? {}) as Record<string, number>;

        const moisture = Number(sensors["moisture"] ?? (sampleType === "silage" ? 61 : 9.2));
        const ph = Number(sensors["ph"] ?? 4.8);
        const temperature = Number(sensors["temperature"] ?? (sampleType === "silage" ? 31 : 27));

        const feed = {
          quality_score: 86,
          protein: 18.4,
          moisture,
          fibre: 13.8,
          energy: 3150,
          mould_risk: "low",
          adulteration_risk: "low",
          confidence: 0.92,
          advisory: "Maintain dry storage conditions.",
        };
        const silage = {
          quality_score: 72,
          protein: 8.6,
          moisture,
          fibre: 24.5,
          energy: 2450,
          ph,
          temperature,
          mould_risk: moisture > 65 || temperature > 33 ? "high" : "medium",
          adulteration_risk: "low",
          confidence: 0.88,
          advisory:
            "Monitor moisture and storage conditions. Inspect the affected portion and consider laboratory confirmation if mould contamination is suspected.",
        };

        return Response.json({
          ...(sampleType === "silage" ? silage : feed),
          source: "prototype_demo_model",
          disclaimer:
            "AI screening estimate only — not a laboratory-confirmed result. Laboratory confirmation recommended when contamination is suspected.",
        });
      },
    },
  },
});
