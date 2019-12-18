/**
 * Validates given code for ISO country code
 * @remarks controls if it is 2 alphabetic character
 * @param code Country ISO code.
 */
export const isValidCountryCode = (code: string): boolean =>
  /^[A-Za-z]{2}$/.test(code);

/**
 * Validates username
 * @remarks only alphanumeric characters with hyphen and underscore as a seperator and minimum length of 3
 * @param name
 */
export const isValidDisplayName = (name: string) =>
  name.length <= 15 &&
  name.length >= 3 &&
  /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/.test(name);

/**
 * Validate ObjectId
 */
export const isValidObjectId = (id: string) =>
  /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(id);

/**
 * Validate score
 */
export const isValidScore = (score: number) => score > 0;
