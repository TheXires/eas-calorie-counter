/**
 * converts a string to an integer
 *
 * @param text string to convert to number
 * @returns number from string or null if string is not a number
 */
export const convertTextToInteger = (text: string): number | undefined =>
  Number.isNaN(parseInt(text, 10)) ? undefined : parseInt(text, 10);
