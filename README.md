Minnesota state legislative roundup.  The goal of this project is to create a visualization that explores the bills of the MN State Legislative Session 88 (2013).

## Previous version

* Previous [code](https://github.com/zzolo/minnpost-legislature-roundup-201).
* Previous [2012 live application](http://www.minnpost.com/data/2012/05/2012-legislative-session-what-did-they-pass). 

## Data

* Vetoed bills are listed on the [Governor's site](http://mn.gov/governor/resources/legislation/).
* [Open States API](http://sunlightlabs.github.io/openstates-api/).

## Install

1. `bower install`
1. `npm install`

## Data Processing

* A [scraper](https://scraperwiki.com/scrapers/mn_governor_bills/) has been built to pull bills from the Governor page then get the votes from the MN Revisor site.
    * TODO, get scraper to work locally.  It has been copied in `data-processing/gov-bill-scraper.py`.
* Get the data with: `wget -O data/bills-list.json "https://api.scraperwiki.com/api/1.0/datastore/sqlite?format=json&name=mn_governor_bills&query=select+*+from+%60swdata%60&apikey="`
* Process the data with: `node data-processing/build-bills-json.js`
 
## Application

Go to `index-src.html` in a browser.

## Build and Deploy

1. Install `grunt`
1. To build, run: `grunt`
1. To deploy, run: `grunt mp-deploy`

