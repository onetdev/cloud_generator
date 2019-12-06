# Cloud Generator
Stylised flat cloud/fog/ shape SVG generator with various configuration options. This repository contains all the UI stuff (Vue.js in TypeScript) and Vue-Bootrstrap based components.

If your are only looking for the actual generator, check out the `src/services/CloudGenerator.ts` file. Don't worry if you are not ready for TypeScript, you can transpile your own using the [Playground](http://www.typescriptlang.org/play/)).

[Live demo](https://onetdev.com/projects/cloud_generator)

## Known issues to be fixed and missing features to be added

- The generator should not create new iteration by changing the color but only when chaning generator settings.
- Header, explanation footer and share options should be added.
- Download is not working as of yet.
- Add tests.

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
