/** Searches for properties with undefined values and removes them. */
export function removeUndefinedProperties(obj: any): any {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

/** Recursively searches for properties with undefined values and removes them. */
export function removeUndefinedPropertiesRecursive(obj: any): any {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        removeUndefinedPropertiesRecursive(obj[key]);
      } else if (obj[key] === undefined) {
        delete obj[key];
      }
    }
  }
  return obj;
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
