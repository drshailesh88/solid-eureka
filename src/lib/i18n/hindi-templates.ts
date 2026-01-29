// =================================================================
// Hindi Instruction Templates (Deterministic, No AI)
// =================================================================

export const hindiFrequency: Record<string, string> = {
  'once daily': 'दिन में एक बार',
  'twice daily': 'दिन में दो बार',
  'thrice daily': 'दिन में तीन बार',
  'four times daily': 'दिन में चार बार',
  'every 4 hours': 'हर 4 घंटे में',
  'every 6 hours': 'हर 6 घंटे में',
  'every 8 hours': 'हर 8 घंटे में',
  'every 12 hours': 'हर 12 घंटे में',
  'as needed': 'जरूरत पड़ने पर',
  'at bedtime': 'सोते समय',
  'in the morning': 'सुबह',
  'in the evening': 'शाम को',
  'with meals': 'खाने के साथ',
  'before meals': 'खाने से पहले',
  'after meals': 'खाने के बाद',
  'empty stomach': 'खाली पेट',
  'weekly': 'हफ्ते में एक बार',
  'alternate days': 'एक दिन छोड़कर'
};

export const hindiPatterns: Record<string, string> = {
  '100': 'सुबह',
  '010': 'दोपहर',
  '001': 'रात',
  '110': 'सुबह-दोपहर',
  '101': 'सुबह-रात',
  '011': 'दोपहर-रात',
  '111': 'सुबह-दोपहर-रात',
  '1000': 'सुबह खाली पेट',
  '0001': 'रात सोते समय'
};

export const hindiDuration: Record<string, string> = {
  '1 day': '1 दिन',
  '2 days': '2 दिन',
  '3 days': '3 दिन',
  '5 days': '5 दिन',
  '7 days': '7 दिन',
  '1 week': '1 हफ्ता',
  '2 weeks': '2 हफ्ते',
  '10 days': '10 दिन',
  '14 days': '14 दिन',
  '15 days': '15 दिन',
  '1 month': '1 महीना',
  '2 months': '2 महीने',
  '3 months': '3 महीने',
  'continue': 'जारी रखें',
  'as directed': 'बताए अनुसार'
};

export const hindiInstructions: Record<string, string> = {
  'take with water': 'पानी के साथ लें',
  'take with milk': 'दूध के साथ लें',
  'chew before swallowing': 'चबाकर खाएं',
  'do not crush': 'कुचलें नहीं',
  'apply locally': 'प्रभावित जगह पर लगाएं',
  'for external use only': 'केवल बाहरी उपयोग के लिए',
  'keep in cool place': 'ठंडी जगह पर रखें',
  'shake well before use': 'उपयोग से पहले अच्छी तरह हिलाएं',
  'avoid alcohol': 'शराब से बचें',
  'avoid driving': 'गाड़ी चलाने से बचें',
  'complete the course': 'पूरा कोर्स करें',
  'if symptoms persist consult doctor': 'अगर तकलीफ बनी रहे तो डॉक्टर से मिलें'
};

// Generate Hindi instruction from English components
export function generateHindiInstruction(
  frequency?: string,
  pattern?: string,
  duration?: string,
  additionalInstructions?: string
): string {
  const parts: string[] = [];

  // Add pattern first (morning/afternoon/night)
  if (pattern && hindiPatterns[pattern]) {
    parts.push(hindiPatterns[pattern]);
  } else if (frequency && hindiFrequency[frequency.toLowerCase()]) {
    parts.push(hindiFrequency[frequency.toLowerCase()]);
  }

  // Add duration
  if (duration && hindiDuration[duration.toLowerCase()]) {
    parts.push(`- ${hindiDuration[duration.toLowerCase()]}`);
  }

  // Add additional instructions
  if (additionalInstructions) {
    const hindiAdditional = hindiInstructions[additionalInstructions.toLowerCase()];
    if (hindiAdditional) {
      parts.push(`(${hindiAdditional})`);
    }
  }

  return parts.join(' ') || '';
}

// Get all available templates for UI dropdowns
export function getFrequencyOptions() {
  return Object.entries(hindiFrequency).map(([en, hi]) => ({
    value: en,
    labelEn: en,
    labelHi: hi
  }));
}

export function getPatternOptions() {
  return Object.entries(hindiPatterns).map(([pattern, hi]) => ({
    value: pattern,
    labelEn: pattern,
    labelHi: hi
  }));
}

export function getDurationOptions() {
  return Object.entries(hindiDuration).map(([en, hi]) => ({
    value: en,
    labelEn: en,
    labelHi: hi
  }));
}
