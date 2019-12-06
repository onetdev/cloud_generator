import { CloudGeneratorConfig } from '../services/CloudGenerator';

export interface CloudPreset extends CloudGeneratorConfig {
  color: string;
}

export default class CloudPresets {
  static regular: CloudPreset = {
    width: 11,
    height: 5,
    fluctuation: 3,
    renderRadius: 10,
    holeTreshold: 2,
    color: "#48c7ff"
  }

  static foggy: CloudPreset = {
    width: 11,
    height: 5,
    fluctuation: 5,
    renderRadius: 10,
    holeTreshold: 2,
    color: "#dadada"
  }
}
