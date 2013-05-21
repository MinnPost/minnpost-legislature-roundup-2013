Minnesota state legislative roundup.  The goal of this project is to create a visualization that explores the bills of the MN State Legislative Session 88 (2013).

## Previous version

* Previous [code](https://github.com/zzolo/minnpost-legislature-roundup-201).
* Previous [2012 live application](http://www.minnpost.com/data/2012/05/2012-legislative-session-what-did-they-pass). 

## Data

* Vetoed bills are listed on the [Governer's site](http://mn.gov/governor/resources/legislation/).
* [Open States API](http://sunlightlabs.github.io/openstates-api/).

## Data Processing

 - build-bills-json.py loops through each bill in the list, using the OpenStates API to get information like bill title, sponsors and sponsor info, starting date, ending date, whether the bill was signed or vetoed, and the house votes for or against.
 - OpenStates unfortunately lacks data on Minnesota Senate votes, so build-bills-json pulls those from a scraper (https://scraperwiki.com/scrapers/mn_bills/)
 - All the data gets written to ```bills.json```
 
## Application

 - The application (found at ```vis/index.html```) runs from the produced ```bills.json```.  This data file is uploaded to S3 for the live application.  Change reference as needed.
 - Please update the Open States API key to your own.
