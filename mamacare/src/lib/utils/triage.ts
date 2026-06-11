import type { DecisionTreeResult, VisitRecord } from '@/types';

export function calculateTriage(visit: Partial<VisitRecord>): DecisionTreeResult {
  const actionSteps: string[] = [];
  let riskScore = 0; // 0: Green, 1: Yellow, 2+: Red

  // Blood Pressure Check
  if (visit.blood_pressure) {
    const [systolic, diastolic] = visit.blood_pressure.split('/').map(Number);
    if (systolic >= 140 || diastolic >= 90) {
      riskScore += 2;
      actionSteps.push('Immediate referral to hospital for hypertension.');
    } else if (systolic >= 130 || diastolic >= 85) {
      riskScore += 1;
      actionSteps.push('Monitor blood pressure closely; schedule follow-up in 3 days.');
    }
  }

  // Fetal Heart Rate Check
  if (visit.fetal_heart_rate) {
    if (visit.fetal_heart_rate < 110 || visit.fetal_heart_rate > 160) {
      riskScore += 2;
      actionSteps.push('Abnormal fetal heart rate detected. Urgent hospital referral.');
    }
  }

  // Symptoms Check
  const dangerSymptoms = ['Headache', 'Blurred vision', 'Severe abdominal pain', 'Vaginal bleeding'];
  const activeDangerSymptoms = visit.symptoms?.filter(s => dangerSymptoms.includes(s)) || [];

  if (activeDangerSymptoms.length > 0) {
    riskScore += 2;
    actionSteps.push(`Danger symptoms detected: ${activeDangerSymptoms.join(', ')}. Urgent referral.`);
  }

  if (riskScore >= 2) {
    return {
      triage_level: 'red',
      summary: 'High risk condition detected. Mother requires immediate medical attention.',
      action_steps: actionSteps,
      referral_needed: true,
    };
  }

  if (riskScore === 1) {
    return {
      triage_level: 'yellow',
      summary: 'Moderate risk. Increased monitoring and early follow-up required.',
      action_steps: actionSteps.length ? actionSteps : ['Advise on rest and danger signs.'],
      referral_needed: false,
    };
  }

  return {
    triage_level: 'green',
    summary: 'Normal visit. Pregnancy appears to be progressing well.',
    action_steps: ['Continue routine ANC check-ups.', 'Maintain healthy diet and hydration.'],
    referral_needed: false,
  };
}
