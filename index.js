/**
 * Created by aadisriram on 5/1/15.
 */

var jsdom = require("jsdom");

function getWikiUrls(baseUrl, callback) {
    var outlinks = [];
    jsdom.env({
        url: baseUrl,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (errors, window) {
            var $ = window.$;

            var anchors = $("#mw-content-text p").find("a").each(function() {
                var url = $(this).attr('href');
                if(/^(\/wiki)/.test(url)) {
                    //console.log(url);
                    outlinks.push(url);
                }
            });

            callback(outlinks);
        }
    });
}

module.exports = getWikiUrls;
