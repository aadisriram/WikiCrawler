/**
 * Created by aadisriram on 5/1/15.
 */

var WikiUrlGrabber = require("./index.js");

var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.Client('152.46.20.89:2181/');

var prod = new kafka.Producer(new kafka.Client());

var prof = new WikiUrlGrabber("https://en.wikipedia.org/wiki/The_Tower_House", function(outlinks) {
    outlinks.forEach(function(outlink) {
        console.log(outlink);
        payloads = [{topic : "wiki_url_queue", messages : JSON.stringify(outlink)}];
        prod.send(payloads, function(err, data) {
            console.log(err);
        });
    });
});
