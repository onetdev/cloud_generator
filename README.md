# Cloud Generator

Stylised flat cloud/fog/mist shape SVG generator with various configuration options. This repository contains all the UI elements (Vue.js in TypeScript) and Vue-Bootrstrap based components.

If your are only looking for the actual generator, check out the `src/generator/CloudGenerator.ts` file. Don't worry if you are not ready for TypeScript, you can transpile your own using the [Playground](http://www.typescriptlang.org/play/)).

[Live demo](https://cloud-svg-generator.netlify.app/)

## How it looks

![Screenshot](https://raw.githubusercontent.com/onetdev/cloud_generator/main/src/assets/screenshot-v0.2.0.png)

## Example usage of generator

```typescript
import CloudGenerator from 'CloudGenerator'
const config: CloudGeneratorConfig = {
  width: 11,
  height: 5,
  randomness: 3,
  renderRadius: 10,
  holeTreshold: 0
}
const generator = new CloudGenerator(config)
console.log(generator.generate().export())
```

## Todo

- Composition showcase, cloud animations to make it feel alive. (maybe)
- Add shape support for cloud treshold. (maybe)

## Project setup

You will need NodeJS version from `.nvmrc` and pnpm version installed first and then you can simply run the application by using:

```
pnpm install
```

### Compiles and hot-reloads for development

```
pnpm run dev
```

### Compiles and minifies for production

```
pnpm run build
```
