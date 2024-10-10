# Usage

Latest version is deployed on Netlify: https://tile-parallax.netlify.app

This is a tool I used for making parallaxes for my Angular game. It will export a ZIP file containing the images and some JSON containing the tileset and layer configurations. This file can be fed to a [component library](https://www.npmjs.com/package/tilemap-parallax) that renders the parallaxes (this tool itself uses the library as well).

Renaming files is not supported. Name your image files before loading them into the tool. Otherwise you will need to rename the files in the exported ZIP file.

This is a barebones Angular project, so in case you want to run it locally, you will need Node.js, checkout the project and execute `npm install` and `npm start`.

## Folder structure of a valid parallax collection

- /image
  - [image files, can be put in nested folders]
- /tileset
  - [tileset json files]
- /parallax
  - [parallax json files]
