/*
 * MamaCare — Supabase Seed Script
 * ================================
 * Populates the database with realistic demo data for hackathon presentations.
 *
 * HOW TO RUN:
 *   1. Open your Supabase project dashboard → SQL Editor
 *   2. Paste this file and click "Run"
 *   3. Or run via CLI: psql "$SUPABASE_DB_URL" -f supabase/seed.sql
 *
 * WHAT IT SEEDS:
 *   - 8 patients with varied risk profiles (low, medium, high)
 *   - 21 ANC visits across all patients with vitals & symptoms
 *   - 5 upcoming appointments
 *   - 5 risk alerts (active & resolved)
 *
 * NOTES:
 *   - All IDs are fixed UUIDs for predictable relationships
 *   - Dates are relative to NOW() for freshness on any day
 *   - Run multiple times safely — data will be duplicated unless you
 *     uncomment the DELETE section below to reset first
 *   - Requires pgcrypto extension (pre-enabled in Supabase)
 */

-- ────────────────────────────────────────────────────────────
-- RESET (uncomment to wipe demo data before re-seeding)
-- ────────────────────────────────────────────────────────────
-- DELETE FROM risk_alerts;
-- DELETE FROM appointments;
-- DELETE FROM visits;
-- DELETE FROM patients;

-- ────────────────────────────────────────────────────────────
-- PATIENTS
-- ────────────────────────────────────────────────────────────

INSERT INTO patients (id, full_name, age, phone, village, address, edd, gravida, para, risk_factors, risk_level, emergency_contact, chw_id, created_at, updated_at)
VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Grace Wanjiku',
  28,
  '+254722100001',
  'Kibera',
  'House 42, Kibera',
  NOW() + INTERVAL '115 days',
  3,
  2,
  '{}',
  'low',
  'John Wanjiku - +254722111001',
  'chw-demo-001',
  NOW() - INTERVAL '120 days',
  NOW() - INTERVAL '7 days'
),
(
  'a0000000-0000-0000-0000-000000000002',
  'Mary Akinyi',
  33,
  '+254722100002',
  'Mathare',
  'Plot 7, Mathare Valley',
  NOW() + INTERVAL '80 days',
  2,
  1,
  ARRAY['preeclampsia','severe_anemia'],
  'high',
  'Peter Akinyi - +254722111002',
  'chw-demo-001',
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '7 days'
),
(
  'a0000000-0000-0000-0000-000000000003',
  'Esther Muthoni',
  27,
  '+254722100003',
  'Kawangware',
  'Section 3, Kawangware',
  NOW() + INTERVAL '156 days',
  1,
  0,
  ARRAY['first_pregnancy'],
  'medium',
  'David Muthoni - +254722111003',
  'chw-demo-001',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '28 days'
),
(
  'a0000000-0000-0000-0000-000000000004',
  'Joyce Njeri',
  36,
  '+254722100004',
  'Dandora',
  'Block 15, Dandora',
  NOW() + INTERVAL '59 days',
  4,
  3,
  ARRAY['gestational_diabetes','preeclampsia'],
  'high',
  'Samuel Njeri - +254722111004',
  'chw-demo-001',
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '14 days'
),
(
  'a0000000-0000-0000-0000-000000000005',
  'Agnes Chebet',
  30,
  '+254722100005',
  'Embakasi',
  'Phase 2, Embakasi',
  NOW() + INTERVAL '167 days',
  1,
  0,
  '{}',
  'low',
  'Joseph Chebet - +254722111005',
  'chw-demo-001',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '56 days'
),
(
  'a0000000-0000-0000-0000-000000000006',
  'Faith Wangari',
  33,
  '+254722100006',
  'Kariobangi',
  'Zone 4, Kariobangi',
  NOW() + INTERVAL '33 days',
  3,
  2,
  ARRAY['previous_c_section'],
  'medium',
  'James Wangari - +254722111006',
  'chw-demo-001',
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '28 days'
),
(
  'a0000000-0000-0000-0000-000000000007',
  'Linet Auma',
  29,
  '+254722100007',
  'Ruiru',
  'Estate 9, Ruiru',
  NOW() + INTERVAL '110 days',
  1,
  0,
  '{}',
  'low',
  'George Auma - +254722111007',
  'chw-demo-001',
  NOW() - INTERVAL '60 days',
  NOW() - INTERVAL '14 days'
),
(
  'a0000000-0000-0000-0000-000000000008',
  'Dorcas Jepchirchir',
  34,
  '+254722100008',
  'Kiserian',
  'Area 6, Kiserian',
  NOW() - INTERVAL '7 days',
  5,
  4,
  ARRAY['grand_multipara','severe_anemia'],
  'high',
  'Paul Jepchirchir - +254722111008',
  'chw-demo-001',
  NOW() - INTERVAL '90 days',
  NOW() - INTERVAL '14 days'
);

-- ────────────────────────────────────────────────────────────
-- VISITS
-- ────────────────────────────────────────────────────────────

-- Grace Wanjiku — 4 visits, BP trending up, last flagged medium risk
INSERT INTO visits (id, patient_id, visit_date, visit_type, blood_pressure, weight, fundal_height, fetal_heart_rate, urine, symptoms, notes, chw_id, created_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '70 days',
  'clinic',
  '112/72',
  62.0,
  18,
  140,
  'normal',
  ARRAY['nausea','fatigue'],
  'First ANC visit. Routine blood work done.',
  'chw-demo-001',
  NOW() - INTERVAL '70 days'
),
(
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '49 days',
  'clinic',
  '118/76',
  63.5,
  24,
  142,
  'normal',
  ARRAY['heartburn'],
  'Routine check. Fetal movements reported normal.',
  'chw-demo-001',
  NOW() - INTERVAL '49 days'
),
(
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '28 days',
  'clinic',
  '122/78',
  64.8,
  28,
  138,
  'normal',
  ARRAY['mild_edema'],
  'Mild ankle edema noted. Advised rest and leg elevation.',
  'chw-demo-001',
  NOW() - INTERVAL '28 days'
),
(
  'b0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  NOW() - INTERVAL '7 days',
  'clinic',
  '125/82',
  65.5,
  31,
  144,
  'normal',
  ARRAY['edema','headache'],
  'BP trending up. Medium risk monitoring initiated. Referred for review.',
  'chw-demo-001',
  NOW() - INTERVAL '7 days'
);

-- Mary Akinyi — 4 visits, referred for preeclampsia, blood transfusion for anemia
INSERT INTO visits (id, patient_id, visit_date, visit_type, blood_pressure, weight, fundal_height, fetal_heart_rate, urine, symptoms, notes, chw_id, created_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '84 days',
  'clinic',
  '145/95',
  70.0,
  20,
  150,
  'protein+2',
  ARRAY['severe_headache','visual_disturbances'],
  'Severe preeclampsia suspected. Urgent referral to hospital.',
  'chw-demo-001',
  NOW() - INTERVAL '84 days'
),
(
  'b0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '56 days',
  'clinic',
  '150/98',
  71.0,
  24,
  148,
  'protein+3',
  ARRAY['severe_headache','epigastric_pain'],
  'Referred to hospital for preeclampsia management. Admitted for 48hr observation.',
  'chw-demo-001',
  NOW() - INTERVAL '56 days'
),
(
  'b0000000-0000-0000-0000-000000000007',
  'a0000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '28 days',
  'clinic',
  '138/88',
  69.0,
  28,
  146,
  'protein+1',
  ARRAY['fatigue','pallor'],
  'Post-hospital discharge. Hb 8.2 — severe anemia diagnosed. Iron supplements prescribed.',
  'chw-demo-001',
  NOW() - INTERVAL '28 days'
),
(
  'b0000000-0000-0000-0000-000000000008',
  'a0000000-0000-0000-0000-000000000002',
  NOW() - INTERVAL '7 days',
  'clinic',
  '135/85',
  70.5,
  31,
  152,
  'protein+1',
  ARRAY['fatigue','dizziness','pallor'],
  'Blood transfusion scheduled for severe anemia. Hb still low at 8.2.',
  'chw-demo-001',
  NOW() - INTERVAL '7 days'
);

-- Esther Muthoni — 2 visits, early pregnancy, routine care
INSERT INTO visits (id, patient_id, visit_date, visit_type, blood_pressure, weight, fundal_height, fetal_heart_rate, urine, symptoms, notes, chw_id, created_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000009',
  'a0000000-0000-0000-0000-000000000003',
  NOW() - INTERVAL '56 days',
  'clinic',
  '110/70',
  55.0,
  NULL,
  NULL,
  'normal',
  ARRAY['nausea','vomiting','fatigue'],
  'First ANC visit. Dating scan scheduled. Primigravida counseling provided.',
  'chw-demo-001',
  NOW() - INTERVAL '56 days'
),
(
  'b0000000-0000-0000-0000-000000000010',
  'a0000000-0000-0000-0000-000000000003',
  NOW() - INTERVAL '28 days',
  'clinic',
  '112/72',
  56.5,
  14,
  155,
  'normal',
  ARRAY['nausea'],
  'Routine check. Fetal heart detected. All normal.',
  'chw-demo-001',
  NOW() - INTERVAL '28 days'
);

-- Joyce Njeri — 3 visits, glucose test borderline, referred for preeclampsia
INSERT INTO visits (id, patient_id, visit_date, visit_type, blood_pressure, weight, fundal_height, fetal_heart_rate, urine, symptoms, notes, chw_id, created_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000011',
  'a0000000-0000-0000-0000-000000000004',
  NOW() - INTERVAL '70 days',
  'clinic',
  '128/84',
  75.0,
  22,
  140,
  'glucose+1',
  ARRAY['fatigue','excessive_thirst'],
  'Glucose test borderline. Advised dietary modifications.',
  'chw-demo-001',
  NOW() - INTERVAL '70 days'
),
(
  'b0000000-0000-0000-0000-000000000012',
  'a0000000-0000-0000-0000-000000000004',
  NOW() - INTERVAL '42 days',
  'clinic',
  '135/88',
  77.0,
  26,
  138,
  'glucose+2',
  ARRAY['frequent_urination','fatigue'],
  'Referred for OGTT. Blood glucose monitoring started.',
  'chw-demo-001',
  NOW() - INTERVAL '42 days'
),
(
  'b0000000-0000-0000-0000-000000000013',
  'a0000000-0000-0000-0000-000000000004',
  NOW() - INTERVAL '14 days',
  'clinic',
  '142/92',
  78.0,
  30,
  142,
  'protein+1, glucose+1',
  ARRAY['headache','blurred_vision'],
  'Preeclampsia suspected. Scheduled for glucose tolerance test. Urgent follow-up arranged.',
  'chw-demo-001',
  NOW() - INTERVAL '14 days'
);

-- Agnes Chebet — 1 visit, 8 weeks, confirmed pregnancy
INSERT INTO visits (id, patient_id, visit_date, visit_type, blood_pressure, weight, fundal_height, fetal_heart_rate, urine, symptoms, notes, chw_id, created_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000014',
  'a0000000-0000-0000-0000-000000000005',
  NOW() - INTERVAL '56 days',
  'clinic',
  '108/68',
  58.0,
  NULL,
  NULL,
  'normal',
  ARRAY['nausea','breast_tenderness'],
  '8 weeks pregnant. Pregnancy confirmed. Dating scan scheduled.',
  'chw-demo-001',
  NOW() - INTERVAL '56 days'
);

-- Faith Wangari — 2 visits, VBAC counseling, prefers repeat C-section
INSERT INTO visits (id, patient_id, visit_date, visit_type, blood_pressure, weight, fundal_height, fetal_heart_rate, urine, symptoms, notes, chw_id, created_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000015',
  'a0000000-0000-0000-0000-000000000006',
  NOW() - INTERVAL '70 days',
  'clinic',
  '118/76',
  68.0,
  20,
  144,
  'normal',
  '{}',
  'Previous C-section x2. VBAC counseling provided. Patient considering options.',
  'chw-demo-001',
  NOW() - INTERVAL '70 days'
),
(
  'b0000000-0000-0000-0000-000000000016',
  'a0000000-0000-0000-0000-000000000006',
  NOW() - INTERVAL '28 days',
  'clinic',
  '120/78',
  69.5,
  26,
  146,
  'normal',
  ARRAY['back_pain'],
  'Patient prefers repeat C-section. Referred to obstetric specialist.',
  'chw-demo-001',
  NOW() - INTERVAL '28 days'
);

-- Linet Auma — 2 visits, routine, all normal
INSERT INTO visits (id, patient_id, visit_date, visit_type, blood_pressure, weight, fundal_height, fetal_heart_rate, urine, symptoms, notes, chw_id, created_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000017',
  'a0000000-0000-0000-0000-000000000007',
  NOW() - INTERVAL '56 days',
  'clinic',
  '110/70',
  60.0,
  16,
  150,
  'normal',
  ARRAY['mild_nausea'],
  'Routine ANC. All measurements normal.',
  'chw-demo-001',
  NOW() - INTERVAL '56 days'
),
(
  'b0000000-0000-0000-0000-000000000018',
  'a0000000-0000-0000-0000-000000000007',
  NOW() - INTERVAL '14 days',
  'clinic',
  '112/72',
  61.5,
  22,
  148,
  'normal',
  '{}',
  'Routine follow-up. Normal fetal growth. No concerns.',
  'chw-demo-001',
  NOW() - INTERVAL '14 days'
);

-- Dorcas Jepchirchir — 3 visits, blood transfusion given, severe anemia monitoring
INSERT INTO visits (id, patient_id, visit_date, visit_type, blood_pressure, weight, fundal_height, fetal_heart_rate, urine, symptoms, notes, chw_id, created_at)
VALUES
(
  'b0000000-0000-0000-0000-000000000019',
  'a0000000-0000-0000-0000-000000000008',
  NOW() - INTERVAL '70 days',
  'clinic',
  '120/78',
  65.0,
  24,
  142,
  'normal',
  ARRAY['fatigue','pallor','shortness_of_breath'],
  'Grand multipara (gravida 5). Hb 7.8 — severe anemia diagnosed. Urgent management needed.',
  'chw-demo-001',
  NOW() - INTERVAL '70 days'
),
(
  'b0000000-0000-0000-0000-000000000020',
  'a0000000-0000-0000-0000-000000000008',
  NOW() - INTERVAL '42 days',
  'clinic',
  '118/76',
  64.0,
  28,
  140,
  'normal',
  ARRAY['severe_fatigue','dizziness','pallor'],
  'Severe anemia. Blood transfusion given. Monitored for 4 hours post-transfusion.',
  'chw-demo-001',
  NOW() - INTERVAL '42 days'
),
(
  'b0000000-0000-0000-0000-000000000021',
  'a0000000-0000-0000-0000-000000000008',
  NOW() - INTERVAL '14 days',
  'clinic',
  '122/80',
  65.5,
  32,
  144,
  'normal',
  ARRAY['mild_fatigue'],
  'Post-transfusion monitoring. Hb improving. Continued iron therapy.',
  'chw-demo-001',
  NOW() - INTERVAL '14 days'
);

-- ────────────────────────────────────────────────────────────
-- APPOINTMENTS (Upcoming)
-- ────────────────────────────────────────────────────────────

INSERT INTO appointments (id, patient_id, appointment_date, location, purpose, status, reminder_enabled, created_at)
VALUES
(
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  NOW() + INTERVAL '6 days',
  'clinic',
  'ANC follow-up — BP monitoring',
  'scheduled',
  TRUE,
  NOW()
),
(
  'c0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  NOW() + INTERVAL '4 days',
  'clinic',
  'High-risk review — preeclampsia & anemia',
  'scheduled',
  TRUE,
  NOW()
),
(
  'c0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  NOW() + INTERVAL '11 days',
  'clinic',
  'Routine ANC check',
  'scheduled',
  TRUE,
  NOW()
),
(
  'c0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000004',
  NOW() + INTERVAL '1 day',
  'clinic',
  'Glucose tolerance test',
  'scheduled',
  TRUE,
  NOW()
),
(
  'c0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000005',
  NOW() + INTERVAL '16 days',
  'clinic',
  'Dating scan',
  'scheduled',
  TRUE,
  NOW()
);

-- ────────────────────────────────────────────────────────────
-- RISK ALERTS
-- ────────────────────────────────────────────────────────────

INSERT INTO risk_alerts (id, patient_id, alert_type, risk_level, status, description, created_at, resolved_at)
VALUES
(
  'd0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000002',
  'preeclampsia',
  'critical',
  'resolved',
  'Severe preeclampsia — patient was hospitalized and managed. BP now stable on medication.',
  NOW() - INTERVAL '84 days',
  NOW() - INTERVAL '50 days'
),
(
  'd0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'anemia',
  'high',
  'active',
  'Severe anemia (Hb 8.2). Blood transfusion scheduled. Ongoing monitoring.',
  NOW() - INTERVAL '28 days',
  NULL
),
(
  'd0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000004',
  'gestational_diabetes',
  'high',
  'active',
  'Gestational diabetes with borderline glucose tests. OGTT pending. Preeclampsia also suspected.',
  NOW() - INTERVAL '70 days',
  NULL
),
(
  'd0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000008',
  'anemia',
  'critical',
  'active',
  'Grand multipara with severe anemia (Hb 7.8). Blood transfusion given. Requires continued monitoring.',
  NOW() - INTERVAL '70 days',
  NULL
),
(
  'd0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'hypertension',
  'medium',
  'active',
  'BP trending up over last 4 visits (118→125). Medium risk monitoring initiated.',
  NOW() - INTERVAL '28 days',
  NULL
);

-- Seed data inserted successfully!
-- Patients: 8 | Visits: 21 | Appointments: 5 | Risk Alerts: 5
