/**
 * Gets the bill list, adds in Open States data and 
 * produces a JSON file.
 */
var http = require('http');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var q = require('q');
var RestClient = require('node-rest-client').Client;
var restClient = new RestClient();

// Top level variables
var sourceFile = path.join(__dirname, '../data/bills-list.json');
var outputFile = path.join(__dirname, '../data/bills.json');
// Please don't steal
var OSAPIKey = '1e1c9b31bf15440aacafe4125f221bf2';
var billLookupURL = 'http://openstates.org/api/v1/bills/MN/2013-2014/[[[BILL_ID]]]/?apikey=' + OSAPIKey;
var legislatorLookupURL = 'http://openstates.org/api/v1/legislators/[[[LEG_ID]]]/?apikey=' + OSAPIKey;

// Map categories
/*
var subjectMap = {
  'Agriculture and Food': 'Agriculture and Food',
  'Animal Rights and Wildlife Issues': 'Environment and Recreation',
  'Arts and Humanities': 'Arts and Humanities',
  'Budget, Spending, and Taxes': 'Budget, Spending and Taxes',
  'Business and Consumers': 'Business and Economy',
  'Campaign Finance and Election Issues': 'Campaign Finance and Election Issues',
  'Civil Liberties and Civil Rights': 'Social Issues',
  'Commerce': 'Business and Economy',
  'Crime': 'Crime and Drugs',
  'Drugs': 'Crime and Drugs',
  'Education': 'Education',
  'Energy': 'Energy and Technology',
  'Environmental': 'Environment and Recreation',
  'Executive Branch': 'Government',
  'Family and Children Issues': 'Social Issues',
  'Federal, State, and Local Relations': 'Government',
  'Gambling and Gaming': 'Gambling and Gaming',
  'Government Reform': 'Government',
  'Guns': 'Guns',
  'Health': 'Health and Science',
  'Housing and Property': 'Housing and Property',
  'Immigration': 'Immigration',
  'Indigenous Peoples': 'Social Issues',
  'Insurance': 'Insurance',
  'Judiciary': 'Legal',
  'Labor and Employment': 'Business and Economy',
  'Legal Issues': 'Legal',
  'Legislative Affairs': 'Government',
  'Military': 'Military',
  'Municipal and County Issues': 'Government',
  'Nominations': '',
  'Other': '',
  'Public Services': 'Government',
  'Recreation': 'Environment and Recreation',
  'Reproductive Issues': 'Reproductive Issues',
  'Resolutions': '',
  'Science and Medical Research': 'Health and Science',
  'Senior Issues': 'Social Issues',
  'Sexual Orientation and Gender Issues': 'Social Issues',
  'Social Issues': 'Social Issues',
  'State Agencies': '',
  'Technology and Communication': 'Energy and Technology',
  'Trade': 'Business and Economy',
  'Transportation': 'Transportation',
  'Welfare and Poverty': 'Welfare and Poverty' 
};
*/
var subjectMap = {
  'Administration Department': 'Government',
  'Agriculture and Agriculture Department': 'Agriculture and Food',
  'Alcoholic Beverages': 'Health and Science',
  'Animals and Pets': 'Environment and Recreation',
  'Appropriations': 'Budget, Spending and Taxes',
  'Appropriations-Omnibus Bills': 'Budget, Spending and Taxes',
  'Arts': 'Arts and Humanities',
  'Banks and Financial Institutions': '',
  'Banks, Financial Institutions, and Credit Unions': '',
  'Bicycles and Bikeways': 'Transportation',
  'Boards': '',
  'Boats, Boating, and Watercraft': 'Transportation',
  'Bonds': 'Budget, Spending and Taxes',
  'Builders and Building Contractors': '',
  'Buildings and Building Codes': '',
  'Business': 'Business and Economy',
  'Chemical Dependency': 'Crime and Drugs',
  'Children and Families': 'Social Issues',
  'Children and Minors': 'Social Issues',
  'Children-Child Care and Facilities': 'Social Issues',
  'Children-Custody and Support': 'Social Issues',
  'Cities and Towns': 'Government',
  'Cities and Towns-Specific': 'Government',
  'Claims': 'Legal',
  'Commerce Department': 'Business and Economy',
  'Commerce and Commerce Department': 'Business and Economy',
  'Commissions': 'Government',
  'Committees and Working Groups': 'Government',
  'Constitutional Amendments': 'Government',
  'Constitutional Offices': 'Government',
  'Consumer Protection': 'Business and Economy',
  'Contracts': 'Legal',
  'Cooperatives': 'Business and Economy',
  'Corrections and Corrections Department': 'Crime and Drugs',
  'Corrections-Juveniles': 'Crime and Drugs',
  'Councils': 'Government',
  'Counties': 'Government',
  'Counties-Specific': 'Government',
  'Courts': 'Legal',
  'Courts-Specific': '',
  'Credit and Credit Services': 'Business and Economy',
  'Crime Victims': 'Crime and Drugs',
  'Crimes and Criminals': 'Crime and Drugs',
  'Crimes and Criminals-Sexual Offenses': 'Crime and Drugs',
  'Crimes and Criminals-Victims': 'Crime and Drugs',
  'Data Practices and Privacy': '',
  'Death': 'Social Issues',
  'Death, Funerals, and Cemeteries': 'Social Issues',
  'Disabilities and Access': 'Health and Science',
  'Disasters': 'Environment and Recreation',
  'Drivers\' Licenses, Training, and ID Cards': 'Government',
  'Drugs and Medicine': 'Health and Science',
  'Easements and Conveyances': 'Housing and Property',
  'Economic Development': 'Business and Economy',
  'Education and Education Department': 'Education',
  'Education-Higher': 'Education',
  'Education-K-12': 'Education',
  'Education-Pre-Kindergarten-12': 'Education',
  'Education-School Districts': 'Education',
  'Elections': 'Campaign Finance and Election Issues',
  'Emergency and 911 Services': '',
  'Employee Relations Department': '',
  'Employment and Economic Development Department': 'Business and Economy',
  'Energy': 'Energy and Technology',
  'Environment': 'Environment and Recreation',
  'Ethics': '',
  'Family': 'Social Issues',
  'Fire and Firefighters': '',
  'Firearms and Dangerous Weapons': 'Guns',
  'Fish and Fishing': 'Environment and Recreation',
  'Forests and Trees': 'Environment and Recreation',
  'Fuels': 'Energy and Technology',
  'Funerals and Cemeteries': 'Social Issues',
  'Gambling': 'Gambling and Gaming',
  'Gambling and Lottery': 'Gambling and Gaming',
  'Government-Employees': 'Government',
  'Government-Federal': 'Government',
  'Government-Local': 'Government',
  'Government-State': 'Government',
  'Governmental Operations-Federal': 'Government',
  'Governmental Operations-Local': 'Government',
  'Governmental Operations-State': 'Government',
  'Guardians and Conservators': 'Social Issues',
  'Hazardous Substances': 'Environment and Recreation',
  'Health and Health Department': 'Health and Science',
  'Health-Mental Health': 'Health and Science',
  'Highways, Roads, and Bridges': 'Transporation',
  'Historic Sites and Historical Societies': '',
  'Hospitals and Health Care Facilities': 'Health and Science',
  'Hospitals and Health Facilities': 'Health and Science',
  'Housing and Housing Finance Agency': 'Housing and Property',
  'Human Rights and Human Rights Department': 'Social Issues',
  'Human Services and Human Services Department': '',
  'Hunting and Game': 'Environment and Recreation',
  'Immigrants and Aliens': 'Immigration',
  'Insurance': 'Insurance',
  'Insurance-Health': 'Insurance',
  'Insurance-Property and Casualty': 'Insurance',
  'International Relations': '',
  'Interstate Compacts and Agreements': '',
  'Judges': 'Legal',
  'Labor, Employment, and Labor and Industry Department': 'Business and Economy',
  'Lakes, Ponds, Rivers, and Streams': 'Environment and Recreation',
  'Landlords and Tenants': 'Housing and Property',
  'Lands': 'Housing and Property',
  'Lands-State': 'Housing and Property',
  'Law Enforcement': 'Crime and Drugs',
  'Legal Proceedings': 'Legal',
  'Legislature': 'Government',
  'Liability': 'Legal',
  'Licenses': '',
  'Liquor': 'Social Issues',
  'Marriage and Marriage Dissolution': 'Social Issues',
  'Metropolitan Area': '',
  'Military and Military Affairs Department': '',
  'Mines and Mining': 'Environment and Recreation',
  'Minnesota Management and Budget Department': '',
  'Minnesota State Colleges and Universities': 'Education',
  'Minorities and Protected Groups': '',
  'Mortgages and Deeds': 'Housing and Property',
  'Motor Vehicles': 'Transporation',
  'Motor Vehicles-Carriers': 'Transporation',
  'Motor Vehicles-Motorcycles, Snowmobiles, and ATVs': 'Transporation',
  'Motor Vehicles-Registration, Licensing, and Taxation': 'Transporation',
  'Motorcycles, Snowmobiles, and ATVs': 'Transporation',
  'Museums and Theaters': 'Arts and Humanities',
  'Native Americans': 'Social Issues',
  'Natural Resources Department': 'Environment and Recreation',
  'Natural Resources and Natural Resources Department': 'Environment and Recreation',
  'Nonprofit and Charitable Organizations': '',
  'Nursing Homes and Care Facilities': 'Health and Science',
  'Occupations and Professions': '',
  'Omnibus Bills': 'Budget, Spending and Taxes',
  'Parks and Trails': 'Environment and Recreation',
  'Pets': '',
  'Plants, Seeds, and Nurseries': 'Environment and Recreation',
  'Police and Peace Officers': 'Crime and Drugs',
  'Pollution and Pollution Control Agency': 'Environment and Recreation',
  'Popular Names': '',
  'Public Safety Department': 'Crime and Drugs',
  'Public Utilities and Public Utilities Commission': '',
  'Public and State Employees': 'Government',
  'Railroads': 'Transportation',
  'Real Estate': 'Housing and Property',
  'Reapportionment and Redistricting': '',
  'Religion and Religious Beliefs': 'Social Issues',
  'Resolutions': '',
  'Retirement': 'Social Issues',
  'Retirement-Public and State Employees': 'Government',
  'Safety': 'Crime and Drugs',
  'Securities': '',
  'Sewers and Septic Systems': '',
  'State Agencies and Departments': 'Government',
  'State Boards': 'Government',
  'State Councils and Commissions': 'Government',
  'State Officials': 'Government',
  'Statutes': 'Government',
  'Students': 'Education',
  'Taxation': 'Budget, Spending and Taxes',
  'Taxation-Income': 'Budget, Spending and Taxes',
  'Taxation-Property': 'Budget, Spending and Taxes',
  'Taxation-Sales and Use': 'Budget, Spending and Taxes',
  'Teachers': 'Education',
  'Telecommunications and Information Technology': 'Energy and Technology',
  'Television and Radio': '',
  'Tobacco Products': 'Social Issues',
  'Trade Practices': 'Business and Economy',
  'Traffic Regulations': 'Transportation',
  'Transportation and Transportation Department': 'Transportation',
  'Trusts': '',
  'Unemployment Insurance': 'Insurance',
  'Uniform Acts': '',
  'Uniform Commercial Code': '',
  'University of Minnesota': 'Education',
  'Veterans and Veterans Affairs Department': '',
  'Wages': 'Business and Economy',
  'Waste and Waste Management': '',
  'Water, Water Resources, and Waterways': '',
  'Waters-Lakes': 'Environment and Recreation',
  'Waters-Rivers': 'Environment and Recreation',
  'Watershed Districts': 'Environment and Recreation',
  'Weights and Measures': '',
  'Women': 'Social Issues',
  'Workers Compensation': 'Business and Economy',
  'Zoos': '',
}


// Get data
var sourceData = require(sourceFile);

// Make defer
function makeDeferHTTPRequest(url) {
  var d = q.defer();
  
  restClient.get(url, function(data, response) {
    if (response.statusCode != 200) {
      console.log('Error on OS call: ' + response.statusCode + ' : ' + url);
      return;
    }
    d.resolve(JSON.parse(data), response);
  });
  
  return d.promise;
}

// Parse source bill
function parseSourceBill(bill) {
  var newBill = {};
  
  if (bill.house_vote) {
    newBill.house_ayes = parseInt(bill.house_vote.split('-')[0], 10);
    newBill.house_nays = parseInt(bill.house_vote.split('-')[1], 10);
  }
  else {
    console.log('No house vote on: ' + bill.bill);
  }
  
  if (bill.senate_vote) {
    newBill.senate_ayes = parseInt(bill.senate_vote.split('-')[0], 10);
    newBill.senate_nays = parseInt(bill.senate_vote.split('-')[1], 10);
  }
  else {
    console.log('No senate vote on: ' + bill.bill);
  }
  
  newBill.bill_id = bill.bill;
  newBill.description = bill.description;
  newBill.vetoed = (bill.vetoed && bill.vetoed !== '0') ? true : false;
  newBill.veto_link = bill.veto_link;
  newBill.signed = bill.signed;
  newBill.categories = bill.topics.split('||');
  
  return newBill;
}

// Handle finish
function finishProcess(output) {
  // Silly, but given the defers, we just write out the
  // file every time.
  fs.writeFile(outputFile, JSON.stringify(output), function(error) {
    if (error) {
      console.log('Error saving output file: ' + error);
    }
    else {
      console.log('Output saved with rows: ' + Object.keys(output).length);
    }
  });
}

// Process data
(function processData(sourceData) {
  var billsOutput = {};
  var knownLegislators = {};

  sourceData.forEach(function(bill, i) {
    var bill_id = bill.bill;
    var newCategories = [];
    var url = billLookupURL.replace('[[[BILL_ID]]]', encodeURIComponent(bill_id));
    
    makeDeferHTTPRequest(url).done(function(data, response) {
      var defers = [];
      
      try {
        billsOutput[bill_id] = parseSourceBill(bill);
        
        // Basics
        billsOutput[bill_id].title = data.title;
        billsOutput[bill_id].billurl = data.sources[0].url;
        billsOutput[bill_id].end_date = data.action_dates.last;
        
        // Start and end date
        data.actions.forEach(function(a) {
          if (a.type[0] == 'bill:introduced') {
            billsOutput[bill_id].start_date = a.date;
          }
          if (a.type[0] == 'governor:vetoed') {
            billsOutput[bill_id].bill_status = 'vetoed';
          }
        });
        
        // Categories
        
        billsOutput[bill_id].categories = billsOutput[bill_id].categories || [];
        billsOutput[bill_id].categories.forEach(function(c) {
          if (subjectMap[c] !== undefined && subjectMap[c] !== '' && newCategories.indexOf(subjectMap[c]) === -1) {
            newCategories.push(subjectMap[c]);
          }
          else if (subjectMap[c] === undefined && c !== '' && newCategories.indexOf(c) === -1) {
            newCategories.push(c);
          }
        });
        billsOutput[bill_id].categories = newCategories;
        
        // Status
        billsOutput[bill_id].bill_status = 'indeterminate';
        if (billsOutput[bill_id].signed !== '') {
          billsOutput[bill_id].bill_status = 'signed'; 
        }
        else {
          billsOutput[bill_id].bill_status = 'pending';
        }
        if (data.action_dates.signed) {
          billsOutput[bill_id].bill_status = 'signed';
        }
        if (billsOutput[bill_id].vetoed && billsOutput[bill_id].veto_link === '') {
          billsOutput[bill_id].bill_status = 'vetoed';
          billsOutput[bill_id].categories.push('Vetoed');
        }
        else if (billsOutput[bill_id].vetoed && billsOutput[bill_id].veto_link !== '') {
          billsOutput[bill_id].bill_status = 'partially vetoed';
        }
        
        // Sponsors
        billsOutput[bill_id].senate_sponsors = [];
        billsOutput[bill_id].house_sponsors = [];
        
        data.sponsors.forEach(function(s) {
          if (s.chamber === 'upper' && knownLegislators[s.leg_id]) {
            billsOutput[bill_id].senate_sponsors.push(knownLegislators[s.leg_id]);
          }
          else if (s.chamber === 'lower' && knownLegislators[s.leg_id]) {
            billsOutput[bill_id].house_sponsors.push(knownLegislators[s.leg_id]);
          }
          else {
            defers.push(makeDeferHTTPRequest(legislatorLookupURL.replace('[[[LEG_ID]]]', s.leg_id)));
          }
        });
        
        q.all(defers).done(function(foundLegs) {
          foundLegs.forEach(function(l) {
            var legDetails = [];
            legDetails.push(l.full_name);
            legDetails.push(l.party);
            legDetails.push(l.photo_url);
            legDetails.push(l.url);
            knownLegislators[l.id] = legDetails;
            
            if (l.chamber === 'upper') {
              billsOutput[bill_id].senate_sponsors.push(legDetails);
            }
            else {
              billsOutput[bill_id].house_sponsors.push(legDetails);
            }
          });
        
          // Finish
          finishProcess(billsOutput);
        });
      }
      catch (e) {
        console.log(e);
        console.log('Error on bill data creation for ' + bill_id + ': ' + 
          ' : ' + url);
      }
    });
  });
  
})(sourceData);
