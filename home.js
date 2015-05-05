/**
 * Created by aadisriram on 5/1/15.
 */

var WikiUrlGrabber = require("./index.js");

var nodeDrpc = require('node-drpc');
var nodeDrpcClient =  new  nodeDrpc("152.46.17.135", 3772);

var kafka = require('kafka-node');

var prod = new kafka.Producer(new kafka.Client());

var consumer = new kafka.Consumer(new kafka.Client(), [{ topic : "wiki_url_queue"}]);

var baseURL = "https://en.wikipedia.org/wiki/";

var starting_points = ["Science", "Business", "Sports",
    "Medicine", "Literature", "Religion",
    "Politics", "Crime", "Geography", "History"];

starting_points.forEach(function(startVal) {
    //var payloads = [{topic : "wiki_url_queue", messages : JSON.stringify(startVal), attributes : 2}];
    //prod.send(payloads, function(err, data) {
    //    if(err != null)
    //        console.log(err.message);
    //});

    crawl(startVal);
});

//crawl("Racism");

function crawl(url) {
    new WikiUrlGrabber(url, function(results) {
        console.log(results);

        nodeDrpcClient.execute("check_url", baseURL + url, function(err, response) {
           console.log(response);
           if(response.indexOf("false") > -1) {
               //Push the results for the current URL to kafka to be consumed by storm
               console.log(results);
               var payload_storm = [
                   {topic : "crawler_feed1", messages : JSON.stringify(results), attributes : 2},
                   {topic : "crawler_feed2", messages : JSON.stringify(results), attributes : 2},
                   {topic : "crawler_feed3", messages : JSON.stringify(results), attributes : 2}
               ];

               prod.send(payload_storm, function(err, data) {
                  if(err != null) {
                      console.error("Failed to send to kafka" + err.message);
                  }
               });

               //Pushing the URL's that need to be crawled next into a kafka queue
               results["urls"].forEach(function(result) {

                   payloads = [{topic : "wiki_url_queue", messages : JSON.stringify(result), attributes : 2}];
                   prod.send(payloads, function(err, data) {
                       if(err != null)
                        console.log(err.message);
                   });
               });
           }
        });
    });
}

consumer.on('message', function (message) {
    crawl(message.value.replace(/['"]+/g, ''));
});
