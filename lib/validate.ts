import { z } from 'zod';

// Serving size schema
export const ServingSizeSchema = z.object({
  value: z.number().positive(),
  unit: z.enum(['g', 'ml', 'ea']),
});

// Individual nutrient schema
export const NutrientValueSchema = z.object({
  value: z.number().min(0),
  unit: z.enum(['g', 'mg', 'kcal', '%']),
});

// Complete nutrients schema
export const NutrientsSchema = z.object({
  energy: NutrientValueSchema,
  protein: NutrientValueSchema,
  fat_total: NutrientValueSchema,
  fat_saturated: NutrientValueSchema.optional(),
  fat_trans: NutrientValueSchema.optional(),
  carbohydrate: NutrientValueSchema,
  sugar: NutrientValueSchema.optional(),
  sodium: NutrientValueSchema,
  cholesterol: NutrientValueSchema.optional(),
  fiber: NutrientValueSchema.optional(),
});

// Daily Value schema
export const DVSchema = z.record(z.string(), z.number().min(0).max(1000));

// AI Summary schema - 식약처 기준 상세 분석
export const AISummarySchema = z.object({
  summary: z.string(),
  highlights: z.array(z.string()),
  cautions: z.array(z.string()),
  nutritional_analysis: z.object({
    energy_analysis: z.string(),
    macronutrient_balance: z.string(),
    micronutrient_evaluation: z.string(),
  }).optional(),
  kfda_compliance: z.object({
    labeling_status: z.string(),
    health_claims: z.array(z.string()),
    warnings: z.array(z.string()),
  }).optional(),
  functional_food_analysis: z.object({
    classification: z.string(),
    functionality: z.array(z.string()),
    intake_recommendations: z.string(),
  }).optional(),
});

// Complete nutrition label schema
export const NutritionLabelSchema = z.object({
  meta: z.object({
    product: z.string().optional(),
    batch: z.string().optional(),
  }).optional(),
  serving_size: ServingSizeSchema,
  nutrients: NutrientsSchema,
  dv: DVSchema.optional(),
  ai_summary: AISummarySchema.optional(),
});

export type NutritionLabel = z.infer<typeof NutritionLabelSchema>;
export type Nutrients = z.infer<typeof NutrientsSchema>;
export type AISummary = z.infer<typeof AISummarySchema>;
