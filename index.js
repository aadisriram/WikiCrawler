/**
 * Created by aadisriram on 5/1/15.
 */

var jsdom = require("jsdom");

var baseUrl = "https://en.wikipedia.org/wiki/";

function getWikiUrls(link, callback) {
    var outlinks = [];
    jsdom.env({
        url: baseUrl + link,
        scripts: ["http://code.jquery.com/jquery.js"],
        done: function (errors, window) {
            if (window != undefined) {
                var $ = window.$;

                //var noarticle = $("#noarticletext").text();
                //if(noarticle.length > 0) {
                //    callback(null);
                //}

                var anchors = $("#mw-content-text p").find("a").each(function () {
                    var url = $(this).attr('href');
                    if (/^(\/wiki)/.test(url)) {
                        var splitUrl = url.split("/")[2];

                        if (splitUrl.indexOf("#") > -1)
                            splitUrl = splitUrl.split("#")[1];

                        if (!/^(Wikipedia|File|Help)/.test(splitUrl))
                            outlinks.push(splitUrl);
                    }
                });

                var categories = [];
                $("#mw-normal-catlinks ul").find("li").each(function () {
                    categories.push($(this).find("a").text());
                });

                var result = {baseurl: link, urls: outlinks, categories: categories};

                callback(result);
            }
        }
    });
}

module.exports = getWikiUrls;
