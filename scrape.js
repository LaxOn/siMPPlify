var request = require('request');
var cheerio = require('cheerio');
var rp = require('request-promise');

scrape()

function scrape(){
  var options = {
      uri: 'https://www.ola.org/en/legislative-business/bills/current',
      transform: function (body) {
          return cheerio.load(body);
      }
  };

  let billInfo;

  rp(options)
      .then(function ($) {
        let billsToParse = htmlEntities($('h2').toString())
        let billTitles = parseBillsForNames(billsToParse)
        let billLinks = parseBillsForLinks(billsToParse)

        //billInfo is a JSON object that groups each bill title and link together
        billInfo = []
        for (var i = 0; i < billTitles.length; i++){
          billInfo.push({"Bill Title": billTitles[i], "Bill Link":billLinks[i]})
        }

        console.log("\n---------\n")
      }).then(async() => {
          for (let i = 0; i < billInfo.length; i++) {
            var options2 = {
                uri: "https://www.ola.org" + billInfo[i]["Bill Link"],
                transform: function (body) {
                    return cheerio.load(body, {normalizeWhitespace:true});
                }
            };
            const $ = await rp(options2);
            billInfo[i]["Long Title"] = parseLongTitle($(".longtitle").toString().replace(/[\n\r]/g," "))
            billInfo[i]["Summary"] = parseSummary($(".WordSection1").toString())
          }
          return billInfo
        }).catch((err)=>{console.log(err)})

    }//closes scrape

function htmlEntities(str) {
    return String(str).replace(/&\apos;/g,"'");
}

function parseBillsForNames(bills){
  let regex = /Bill.*?\d{4}/gm
  let regex2 = /(?<=, ).*?(?=, \d{4})/gm
  let match = []
  let billsList = bills.match(regex)
  for (var i = 0; i < billsList.length; i++) {
    match.push(billsList[i].match(regex2)[0])
  }
  return match;
}

function parseBillsForLinks(bills){
  let regex = /(?<=href=")\/en\/.*?(?=" hreflang)/gm
  let billsLinksList = bills.match(regex)
  billsLinksList.pop()
  return billsLinksList;
}

function parseLongTitle(str){
  if(str.includes("<span>")){
    var regex = /(?<=<span>).*?(?=<\/span>)/s
  } else {
    var regex = /(?<=class="longtitle">).*?(?=<\/h2>)/s
  }
  let parsed = str.match(regex)
  return parsed.toString()
}

function parseSummary(summary){
  let regex = /(?<=<\/p>).*?(?=<h2 class="number">)/su
  return summary.match(regex).toString()
}
