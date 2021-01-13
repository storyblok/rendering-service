# Website Project for: www.storyblok.com

This project is a basic template for creating new starter kit previews and/or websites on the Storyblok Rendering Service.

## Local development

```
// make sure dependencies are installed
npm install 

// local development
npm run dev

// visit: localhost:4440
```

## Production Deployment

```
// make sure dependencies are installed
npm install 

// run the following command to deploy to production
npm run deploy
```

## To-Do Build

- <strike>Add LiveReload/BrowserSync</strike>
- <strike>Add JS Bundling</strike>
- <strike>Add Liquid Templates</strike>
- <strike>Add Blok Upload</strike>
- <strike>Add Minify & Uglify</strike>
- <strike>Add CSS Pre or Postprocessor</strike>
- <strike>Add PostCSS Sass like variables</strike>
- <strike>Add CSS above / below split</strike>
- Add CSS above / below import glob

### PostCSS v8 upgrade

[Merge request](https://github.com/egoist/rollup-plugin-postcss/pull/335) for the rollup postcss module is waiting to get merged to enable postcss v8. Until than we need to use the downgraded versions of the following libs:

- postcss-nested (downgraded to 4.2.3)
- postcss-simple-vars (downgraded to 5.0.2)
- postcss-import (downgraded to 12.0.1)
- autoprefixer (downgraded to 9.8.6)
- postcss-functions (downgraded to 3.0.0)

## Renamed components

- enterprise_ctas -> button_group
- enterprise_cta -> button
- enterprise_text -> text_section
- enterprise_video -> video_section
- logogroup -> image_group
- enterprise_{something} -> something

## (To) drop Components

- form-section -> echange hubspot forms with custom forms
- search -> Searchblok on separate page
- apidoc -> Netural needs to download ecommerce docs
