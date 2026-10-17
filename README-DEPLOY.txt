WHAT IS THIS WORLD? - GitHub Pages deployment files
Site: https://farah19562018-dot.github.io/what-is-this-world-/

Upload these to the ROOT of the repository, keeping this exact structure:
  index.html                     main page
  404.html                       friendly "not found" page
  .nojekyll                      optional (publishes files as-is)
  assets/css/styles.css          design
  assets/js/app.js               search, categories, favorites, articles, navigation
  assets/js/articles.js          all articles, categories and image links
  assets/images/hero-fallback.svg  local background used if the online hero photo fails
  assets/images/favicon.svg      browser tab icon
Article photos are loaded online from Wikimedia Commons; a coloured cover
shows if one fails. All other paths are relative, so no server is needed.
