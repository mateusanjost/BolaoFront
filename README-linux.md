# MdbAngularFree README for linux developers

## Prerequisites

### [optional] cleanup npm packages and cache and install just @angular/cli
cd
rm -rf .npm/ .npm-global/
npm install -g @angular/cli

### cd to the angular project and install required packages from package.js
cd BolaoFront
npm install

### remove reported vulnerabilities
npm audit fix

### revert unwanted angular devkit version and install again
sed -i 's|"@angular-devkit/build-angular": "^0.803.21"|"@angular-devkit/build-angular": "0.802.2"|' package.json
npm install

## Develop

### build
ng build

### run an embedded http server to display the site
ng serve
