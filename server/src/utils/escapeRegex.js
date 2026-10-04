/**
 * Escapes special regular expression characters in a string.
 * Ensures user input can be safely used within a RegExp constructor without
 * unintended regex interpretation or syntax errors.
 *
 * @param {string} string - The string to escape.
 * @returns {string} The escaped string.
 */
export const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default escapeRegex;
