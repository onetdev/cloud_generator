# Cloud Generator
Stylised flat cloud/fog/mist shape SVG generator with various configuration options. This repository contains all the UI elements (Vue.js in TypeScript) and Vue-Bootrstrap based components.

If your are only looking for the actual generator, check out the `src/generator/CloudGenerator.ts` file. Don't worry if you are not ready for TypeScript, you can transpile your own using the [Playground](http://www.typescriptlang.org/play/)).

[Live demo](https://cloud-svg-generator.netlify.app/)

## How it looks

![Screenshot](https://raw.githubusercontent.com/orosznyet/cloud_generator/master/src/assets/screenshot.png)

## Example usage of generator

```typescript
import CloudGenerator from "CloudGenerator";
const config: CloudGeneratorConfig = {
  width: 11,
  height: 5,
  fluctuation: 3,
  renderRadius: 10,
  holeTreshold: 0
};
const generator = new CloudGenerator(config);
console.log(generator.generate().export());
```

## Todo

- Composition showcase, cloud animations to make it feel alive. (maybe)
- Add shape support for cloud treshold. (maybe)

## Project setup

You will need the latest and greatest NodeJS and Yarn version installed first and then you can simply run the application by using:

```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```
