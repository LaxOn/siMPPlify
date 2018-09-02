<img align="center" src="/img/logo.png" />

**3rd prize project for [Hack The 6ix](https://hackthe6ix.com) in September 2018 at Toronto, Canada**

A web app that helps the average person voice their positions to current bills being debated at the Ontario House of Commons by conveniently emailing their corresponding MPPs and providing an approval or disapproval template email of the bill for them to send.

siMPPlify geolocates the user to provide them information on their MPP. It also allows one to research issues and quickly generate a draft email, which one can send from the website to the MPP. The goal is to be able to do this in five minutes! Never have the barriers to participating in a democracy been lower.

### How it's built?
siMPPlify is a web app that uses [cheerio](https://github.com/cheeriojs/cheerio) to scrape the [Legislative Assembly of Ontario's website](https://www.ola.org/en/legislative-business/bills/current) to gain information on the latest bills. It uses the [Represent Civic Information API](https://represent.opennorth.ca/api/) as well as [Google Maps API](https://developers.google.com/maps/documentation/) to figure out who the user's MPP is. Then based on the user's choices, it helps populate an email, which the user can further edit, before submitting using [nodemailer](https://nodemailer.com/).
