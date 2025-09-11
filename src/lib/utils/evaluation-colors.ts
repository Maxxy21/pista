export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "High": return "text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800";
    case "Medium": return "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800";
    case "Low": return "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800";
    default: return "text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-950/50 border-gray-200 dark:border-gray-800";
  }
};

export const getViabilityColor = (viability: string) => {
  switch (viability) {
    case "Strong": return "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50";
    case "Moderate": return "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50";
    case "Weak": return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50";
    default: return "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/50";
  }
};

export const getExecutionColor = (capability: string) => {
  switch (capability) {
    case "Excellent": return "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50";
    case "Good": return "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50";
    case "Fair": return "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50";
    case "Poor": return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50";
    default: return "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/50";
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 8) return "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50";
  if (score >= 6) return "text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50";
  if (score >= 4) return "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50";
  return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/50";
};