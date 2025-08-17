// Helper function to round a number to fixed decimal places and return as number
export function toFixed(value: number, decimals: number): number {
  return Number(value.toFixed(decimals));
}

export function toPercentage(value: number, decimals: number = 2): number {
  return toFixed(value * 100, decimals);
}
