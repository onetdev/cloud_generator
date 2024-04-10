import { type CloudGeneratorConfig } from "./CloudGenerator";

export interface CloudPreset extends CloudGeneratorConfig {
  color: string;
}

export type CloudPresetKeys = 'regular' | 'foggy';
/**
 * Preconfigured profiles to fit a certain visual fidelity.
 */
const CloudPresets: Record<CloudPresetKeys, CloudPreset> = {
  regular: {
    width: 11,
    height: 5,
    fluctuation: 3,
    renderRadius: 10,
    holeTreshold: 0,
    color: "#48c7ff"
  },
  foggy: {
    width: 17,
    height: 5,
    fluctuation: 7,
    renderRadius: 10,
    holeTreshold: 2,
    color: "#dadada"
  }
};

export default CloudPresets;
