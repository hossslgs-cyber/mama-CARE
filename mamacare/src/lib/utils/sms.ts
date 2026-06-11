/**
 * Utility to generate native SMS (sms:) links.
 * Opens the device's default messaging app with pre-filled content.
 */

export interface SMSMessage {
  phone: string;
  motherName: string;
  appointmentDate?: string;
  type: 'appointment_reminder' | 'danger_signs' | 'emergency';
}

export function generateSMSLink({ phone, motherName, appointmentDate, type }: SMSMessage): string {
  // Clean phone number
  const cleanPhone = phone.replace(/\D/g, '');
  
  let message = '';

  switch (type) {
    case 'appointment_reminder':
      message = `MamaCare: Habari ${motherName}, reminder for your visit on ${appointmentDate}.`;
      break;
    case 'danger_signs':
      message = `MamaCare: ${motherName}, remember danger signs: headache, blurred vision, bleeding. Seek help if seen.`;
      break;
    case 'emergency':
      message = `MamaCare EMERGENCY: ${motherName}, please go to the health facility immediately.`;
      break;
    default:
      message = `Habari ${motherName}, this is your MamaCare health worker.`;
  }

  // SMS encoding can vary by OS (iOS uses &body, Android uses ?body or ;)
  // Standard RFC 5724 uses ?body=
  const encodedMessage = encodeURIComponent(message);
  return `sms:${cleanPhone}?body=${encodedMessage}`;
}

export function sendSMS(params: SMSMessage) {
  const link = generateSMSLink(params);
  window.location.href = link;
}
