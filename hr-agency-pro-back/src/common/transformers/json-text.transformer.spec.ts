import { jsonTextTransformer } from './json-text.transformer';

describe('jsonTextTransformer', () => {
  describe('to (serialize)', () => {
    it('returns null for null input', () => {
      expect(jsonTextTransformer.to(null)).toBeNull();
    });

    it('returns null for undefined input', () => {
      expect(jsonTextTransformer.to(undefined)).toBeNull();
    });

    it('serializes an array to JSON string', () => {
      expect(jsonTextTransformer.to(['read', 'write'])).toBe('["read","write"]');
    });

    it('serializes an object to JSON string', () => {
      expect(jsonTextTransformer.to({ key: 'value' })).toBe('{"key":"value"}');
    });
  });

  describe('from (deserialize)', () => {
    it('returns null for null input', () => {
      expect(jsonTextTransformer.from(null)).toBeNull();
    });

    it('returns null for undefined input', () => {
      expect(jsonTextTransformer.from(undefined as any)).toBeNull();
    });

    it('parses a JSON array string back to array', () => {
      expect(jsonTextTransformer.from('["read","write"]')).toEqual(['read', 'write']);
    });

    it('parses a JSON object string back to object', () => {
      expect(jsonTextTransformer.from('{"key":"value"}')).toEqual({ key: 'value' });
    });

    it('returns the raw value when JSON.parse fails', () => {
      const bad = 'not-json';
      expect(jsonTextTransformer.from(bad)).toBe(bad);
    });
  });

  describe('round-trip', () => {
    it('array round-trips correctly', () => {
      const original = ['prospects:read', 'prospects:create'];
      const serialized = jsonTextTransformer.to(original);
      const deserialized = jsonTextTransformer.from(serialized);
      expect(deserialized).toEqual(original);
    });

    it('object round-trips correctly', () => {
      const original = { name: 'admin', level: 1 };
      const serialized = jsonTextTransformer.to(original);
      const deserialized = jsonTextTransformer.from(serialized);
      expect(deserialized).toEqual(original);
    });
  });
});
