// Profanity and censored words filter utility using bad-words library
import {Filter} from 'bad-words';

// Initialize the filter
const filter = new Filter();

/**
 * Checks if text contains censored words
 */
export function containsCensoredWords(text: string): boolean {
  if (!text) return false;

  return filter.isProfane(text);
}

/**
 * Validates multiple fields for censored words
 */
export function validateFieldsForProfanity(fields: { [key: string]: string }): {
  isValid: boolean;
  invalidFields: string[];
} {
  const invalidFields: string[] = [];

  for (const [fieldName, value] of Object.entries(fields)) {
    if (value && containsCensoredWords(value)) {
      invalidFields.push(fieldName);
    }
  }

  return {
    isValid: invalidFields.length === 0,
    invalidFields
  };
}

/**
 * Gets a user-friendly field name for error messages
 */
export function getFieldDisplayName(fieldName: string): string {
  const displayNames: { [key: string]: string } = {
    username: 'Username',
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email',
    position: 'Position'
  };

  return displayNames[fieldName] || fieldName;
}

/**
 * Generates an error message for censored word validation
 */
export function getCensoredWordError(fieldName: string): string {
  return `${getFieldDisplayName(fieldName)} contains inappropriate language`;
}

/**
 * Add custom words to the filter if needed
 */
export function addCustomWords(words: string[]): void {
  filter.addWords(...words);
}

/**
 * Remove words from the filter if needed
 */
export function removeWords(words: string[]): void {
  filter.removeWords(...words);
}
