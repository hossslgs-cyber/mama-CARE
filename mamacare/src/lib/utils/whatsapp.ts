/**
 * Utility to generate WhatsApp "Click to Chat" links.
 * Standardizes phone numbers and encodes health reminders.
 */

export interface WhatsAppMessage {
  phone: string;
  motherName: string;
  appointmentDate?: string;
  type: 'appointment_reminder' | 'danger_signs' | 'follow_up';
}

export function generateWhatsAppLink({ phone, motherName, appointmentDate, type }: WhatsAppMessage): string {
  // Clean phone number (remove spaces, plus signs, dashes)
  const cleanPhone = phone.replace(/\D/g, '');
  
  let message = '';

  switch (type) {
    case 'appointment_reminder':
      message = `Habari ${motherName}, this is a reminder from MamaCare for your upcoming ANC visit on ${appointmentDate}. Please remember to bring your clinic card.`;
      break;
    case 'danger_signs':
      message = `Habari ${motherName}, just a reminder of the danger signs: Severe headache, blurred vision, or bleeding. If you experience these, please visit the clinic immediately or contact me.`;
      break;
    case 'follow_up':
      message = `Habari ${motherName}, I am following up on our last visit. How are you and the baby feeling today?`;
      break;
    default:
      message = `Habari ${motherName}, this is your health worker from MamaCare.`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function openWhatsApp(params: WhatsAppMessage) {
  const link = generateWhatsAppLink(params);
  window.open(link, '_blank');
}
