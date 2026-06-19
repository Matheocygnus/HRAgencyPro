import { ValueTransformer } from 'typeorm';

export const jsonTextTransformer: ValueTransformer = {
  to(value: any): string | null {
    if (value === null || value === undefined) return null;
    return JSON.stringify(value);
  },
  from(value: string | null): any {
    if (value === null || value === undefined) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
};
