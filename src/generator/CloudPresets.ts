import { CloudGeneratorConfig } from "./CloudGenerator";

export interface CloudPreset extends CloudGeneratorConfig {
  color: string;
}

/**
 * Preconfigured profiles to fit a certain visual fidelity.
 */
export default class CloudPresets {
  static regular: CloudPreset = {
    width: 11,
    height: 5,
    fluctuation: 3,
    renderRadius: 10,
    holeTreshold: 0,
    color: "#48c7ff"
  }

  static foggy: CloudPreset = {
    width: 17,
    height: 5,
    fluctuation: 7,
    renderRadius: 10,
    holeTreshold: 2,
    color: "#dadada"
  }
}
