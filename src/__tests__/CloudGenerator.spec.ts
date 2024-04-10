import CloudGenerator, { CloudGeneratorConfig } from "OLD/src/generator/CloudGenerator";

describe('CloudGenerator', () => {
  let config: CloudGeneratorConfig;

  beforeEach(() => {
    config = {
      width: 11,
      height: 5,
      fluctuation: 1,
      renderRadius: 10,
      holeTreshold: 1,
    };
  });

  test('should throw error on even height', () => {
    expect(() => {
      config.height = 10;
      new CloudGenerator(config);
    }).toThrow();
  });

  test('should throw error on even width', () => {
    expect(() => {
      config.width = 10;
      new CloudGenerator(config);
    }).toThrow();
  });

  test('should generate outline points and holes', () => {
    const generator = new CloudGenerator(config);
    generator.generate();
    expect(generator.outlinePoints.length).toEqual(10);
    expect(generator.holes.length).toBeGreaterThanOrEqual(1);
  });

  test('should export svg path to string if generation is completed', () => {
    const generator = new CloudGenerator(config);
    generator.generate();
    const result = generator.export();

    // SVG path commands, M: pend down, C: curve, Z: close last path, L: line to
    expect(result).toContain('M');
    expect(result).toContain('C');
    expect(result).toContain('Z');
    expect(result).toContain('L');
  });

  test('should not export svg path to string if generation is missing', () => {
    const generator = new CloudGenerator(config);
    expect(() => {
      generator.export();
    }).toThrow();
  });
})
