/**
 * Utility functions for formatting strings and data for the UI
 */

// Formats a category string from the database (e.g. "Smart-Watch") 
// into a UI-friendly string (e.g. "Smart Watch")
export const formatCategory = (category) => {
  if (!category) return "";
  return category.replace(/-/g, ' ');
};
