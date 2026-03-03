const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {
    // Configure markdown-it with proper nested list support
    const md = markdownIt({
        html: true,
        breaks: false,
        linkify: true
    });

    // Add cactus-link class to links
    const defaultRender = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
        tokens[idx].attrPush(['class', 'cactus-link']);
        return defaultRender(tokens, idx, options, env, self);
    };

    // Add title class to h1 and h2
    md.renderer.rules.heading_open = function(tokens, idx, options, env, self) {
        const token = tokens[idx];
        if (token.tag === 'h1' || token.tag === 'h2') {
            token.attrPush(['class', 'title']);
        }
        return self.renderToken(tokens, idx, options);
    };

    eleventyConfig.setLibrary("md", md);

    // Passthrough copy for static assets
    eleventyConfig.addPassthroughCopy("styles.css");
    eleventyConfig.addPassthroughCopy("script.js");
    eleventyConfig.addPassthroughCopy("assets");
    eleventyConfig.addPassthroughCopy("technical/**/*.png");
    eleventyConfig.addPassthroughCopy("technical/**/*.jpg");
    eleventyConfig.addPassthroughCopy("technical/**/*.jpeg");
    eleventyConfig.addPassthroughCopy("technical/**/*.gif");
    eleventyConfig.addPassthroughCopy("technical/**/*.svg");

    // Watch for changes
    eleventyConfig.addWatchTarget("./styles.css");
    eleventyConfig.addWatchTarget("./script.js");

    return {
        dir: {
            input: ".",
            output: "_site",
            includes: "_includes",
            data: "_data"
        },
        templateFormats: ["njk", "md", "html"],
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk"
    };
};
