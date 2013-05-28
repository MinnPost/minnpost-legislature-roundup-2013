/**
 * Gets the bill list, adds in Open States data and 
 * produces a JSON file.
 */
var http = require('http');
var fs = require('fs');
var path = require('path');
var moment = require('moment');

// Top level variables
var sourceFile = path.join(__dirname, '../data/bills-list.json');
var outputFile = path.join(__dirname, '../data/bills.json');

// Map categories
var subjectMap = {
  'Agriculture and Food' : 'Agriculture and Food' , 
  'Animal Rights and Wildlife Issues' : 'Environment and Recreation' , 
  'Arts and Humanities' : 'Arts and Humanities' , 
  'Budget, Spending, and Taxes' : 'Budget, Spending and Taxes' , 
  'Business and Consumers' : 'Business and Economy' , 
  'Campaign Finance and Election Issues' : 'Campaign Finance and Election Issues' , 
  'Civil Liberties and Civil Rights' : 'Social Issues' , 
  'Commerce' : 'Business and Economy' , 
  'Crime' : 'Crime and Drugs' , 
  'Drugs' : 'Crime and Drugs' , 
  'Education' : 'Education' , 
  'Energy' : 'Energy and Technology' , 
  'Environmental' : 'Environment and Recreation' , 
  'Executive Branch' : 'Government' , 
  'Family and Children Issues' : 'Social Issues' , 
  'Federal, State, and Local Relations' : 'Government' , 
  'Gambling and Gaming' : 'Gambling and Gaming' , 
  'Government Reform' : 'Government' , 
  'Guns' : 'Guns' , 
  'Health' : 'Health and Science' , 
  'Housing and Property' : 'Housing and Property' , 
  'Immigration' : 'Immigration' , 
  'Indigenous Peoples' : 'Social Issues' , 
  'Insurance' : 'Insurance' , 
  'Judiciary' : 'Legal' , 
  'Labor and Employment' : 'Business and Economy' , 
  'Legal Issues' : 'Legal' , 
  'Legislative Affairs' : 'Government' , 
  'Military' : 'Military' , 
  'Municipal and County Issues' : 'Government' , 
  'Nominations' : '' , 
  'Other' : '' , 
  'Public Services' : 'Government' , 
  'Recreation' : 'Environment and Recreation' , 
  'Reproductive Issues' : 'Reproductive Issues' , 
  'Resolutions' : '' , 
  'Science and Medical Research' : 'Health and Science' , 
  'Senior Issues' : 'Social Issues' , 
  'Sexual Orientation and Gender Issues' : 'Social Issues' , 
  'Social Issues' : 'Social Issues' , 
  'State Agencies' : '' , 
  'Technology and Communication' : 'Energy and Technology' , 
  'Trade' : 'Business and Economy' , 
  'Transportation' : 'Transportation' , 
  'Welfare and Poverty' : 'Welfare and Poverty' 
};

// Get data
var sourceData = require(sourceFile);