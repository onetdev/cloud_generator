import { describe, expect, it } from "vitest";
import CloudGenerator, { type CloudGeneratorConfig } from "../CloudGenerator";

describe('CloudGenerator', () => {
  const getConfig = (): CloudGeneratorConfig => ({
    width: 11,
    height: 5,
    randomness: 1,
    renderRadius: 10,
    holeTreshold: 1,
  });

  it('should throw error on even height', () => {
    const config = getConfig();
    config.height = 10;
    expect(() => new CloudGenerator(config)).toThrow();
  });

  it('should throw error on even width', () => {
    const config = getConfig();
    config.width = 10;
    expect(() => new CloudGenerator(config)).toThrow();
  });

  it('should generate outline points and holes', () => {
    const config = getConfig();
    const generator = new CloudGenerator(config);
    generator.generate();
    expect(generator.outlinePoints.length).toEqual(10);
    expect(generator.holes.length).toBeGreaterThanOrEqual(1);
  });

  it('should export svg path to string if generation is completed', () => {
    const config = getConfig();
    const generator = new CloudGenerator(config);
    generator.generate();
    const result = generator.export();

    // SVG path commands, M: pend down, C: curve, Z: close last path, L: line to
    expect(result).toContain('M');
    expect(result).toContain('C');
    expect(result).toContain('Z');
    expect(result).toContain('L');
  });

  it('should not export svg path to string if generation is missing', () => {
    const config = getConfig();
    const generator = new CloudGenerator(config);
    expect(() => {
      generator.export();
    }).toThrow();
  });
})
