# Gulp + ES6 webapp scaffold

Initial set-up for a Gulp/ES6 web project. Gulpfile uses ES6 (and compiles thru Babel) and so the main app.js file.

## Build description
1. Move static assets to dist folder.
2. Compile SASS, concatenate and minify CSS.
3. Compile and minify ES6 app.js file.
4. Concatenate and minify all js dependencies.
5. JS gets checked against eslint.

## Gulp --dev description
1. Use Browserify for autoreload
1. Watch for changes on SASS, JS, Markup, and other dependencies such as static assets.

;)
