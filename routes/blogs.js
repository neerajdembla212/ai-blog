const express = require("express");
const router = express.Router();
const Parser = require("rss-parser");
const jsdomModule = require("jsdom");
const { JSDOM } = jsdomModule;


const parser = new Parser();

router.get("/", async (req, res, next) => {
    const feed = await parser.parseURL("https://medium.com/feed/@hoferjonathan14");
    const blogs = feed.items?.map(item => {
        const rawContent = item["content:encoded"] || '';
        const dom = new JSDOM(rawContent);
        const blogText = dom.window.document.body.textContent || '';

        return {
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            blogText
        }

    })
    res.json({
        blogs
    });

})

module.exports = router;
