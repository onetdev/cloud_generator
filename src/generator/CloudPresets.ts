import { type CloudGeneratorConfig } from "./CloudGenerator";

export interface CloudPreset extends CloudGeneratorConfig {
  id: string;
  name: string;
  color: string;
}

/**
 * Preconfigured profiles to fit a certain visual fidelity.
 */
const CloudPresets: CloudPreset[] = [
  {
    id: "regular",
    name: "Regular cloud",
    width: 11,
    height: 5,
    randomness: 3,
    renderRadius: 10,
    holeTreshold: 0,
    color: "#48c7ff"
  },
  {
    id: "foggy",
    name: "Foggy",
    width: 17,
    height: 5,
    randomness: 7,
    renderRadius: 10,
    holeTreshold: 2,
    color: "#dadada"
  }
];
export type CloudPresetKeys = 'regular' | 'foggy';

export default CloudPresets;
