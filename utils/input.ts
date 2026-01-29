export function validateNumberInput(input: string): boolean {
  return /^[0-9]*$/.test(input);
}
