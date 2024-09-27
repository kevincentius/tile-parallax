## Folder structure of a valid parallax collection

- /img
  - [image files, can be put in nested folders]
- /tileset
  - [tileset json files]
- /parallax
  - [parallax json files]


## Usage in heromino
- /img/* should be copied to /src/assets/img/bg/parallax/*
- /tileset/* JSONs should be copied individually into export consts (TODO: where in code? Automate with script?)
- /parallax/* JSONs should be copied individually into epxort consts (TODO: where in code? Automate with script?)
