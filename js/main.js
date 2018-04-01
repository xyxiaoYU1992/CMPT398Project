// This is the main javascript file
// Authro: Ruida Xie & Tong Wang

// Set up geometric size
// var diameter = 940;
// var radius = diameter / 2;
// var innerRadius = radius - 270;

var margin = {left:80, top:40, right:120, bottom:50},
	width = Math.max( Math.min(window.innerWidth, 1100) - margin.left - margin.right - 20, 400),
    height = Math.max( Math.min(window.innerHeight - 250, 900) - margin.top - margin.bottom - 20, 400),
    innerRadius = Math.min(width * 0.33, height * .45),
    outerRadius = innerRadius * 1.05;

width = outerRadius * 2 + margin.right + margin.left;
height = outerRadius * 2 + margin.top + margin.bottom;

var newFontSize = Math.min(70, Math.max(40, innerRadius * 62.5 / 250));
d3.select("html").style("font-size", newFontSize + "%");

// Set up necessary parameters
var pullOutSize = 20 + 30/135 * innerRadius;
var defaultOpacity = 0.85,
	fadeOpacity = 0.075;

// Set up the data assessors
var loom = d3.loom()
    .value(function(d){ return d.appear})
    .inner(function(d){ return d.name})
    .outer(function(d){ return d.house}) // TO DO: extract houses from characters, repeat characters allowed.

// Set up appearence 
loom.padAngle(0.05)
    .widthInner(30)
    .heightInner(20)
    .emptyPerc(0.2)

var arc = d3.arc()
    .innerRadius(innerRadius*1.01)
    .outerRadius(outerRadius);

var string = d3.string()
    .radius(innerRadius)
    .pullout(pullOutSize);

// Create SVG
var svg = d3.select("#GoTVis").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

// Create data var
var characters;
var housesDict = {};
var numChars = 56;

// Create temp var
var tempHouseList;
var tempAppear;

// Manually sorted the characters based on their appearances
var characterOrder = ["Tyrion Lannister", "Cersei Lannister", "Daenerys Targaryen", "Jon Snow", "Sansa Stark", 
                      "Arya Stark", "Jorah Mormont", "Jaime Lannister", "Samwell Tarly", "Theon Greyjoy", 
                      "Petyr Baelish", "Varys", "Brienne of Tarth", "Tywin Lannister", "Sandor Clegane", "Bronn", 
                      "Joffrey Baratheon", "Barristan Selmy", "Bran Stark", "Catelyn Stark", "Stannis Baratheon", 
                      "Missandei", "Podrick Payne", "Robb Stark", "Margaery Tyrell", "Davos Seaworth", "Shae", 
                      "Melisandre", "Gilly", "Tommen Baratheon", "Loras Tyrell", "Olenna Tyrell", "Tormund", 
                      "Grey Worm", "Roose Bolton", "Ygritte", "Gendry", "Ramsay Bolton", "Daario Naharis", 
                      "Yara Greyjoy", "Jaqen H'ghar", "Myrcella Baratheon", "Lancel Lannister", "Kevan Lannister", 
                      "Jeor Mormont", "Eddard Stark", "Shireen Baratheon", "Khal Drogo", "Edmure Tully", "Robin Arryn", 
                      "Renly Baratheon", "Oberyn Martell", "Robert Baratheon", "Walder Frey"];

// Read data
d3.csv('lotr_words_location.json', function (data) {
	characters = data;
	//Find the total number of appearance per house
	for (var i = 0; i < numChars; i++) {
		tempHouseList = (characters[i]['houseallegiance'] != '') ? characters[i]['houseallegiance'].split(', ') : [];
        tempAppear = characters[i]['appeared'];
		for (var j = 0; j < tempHouseList.length; i++) {
			if (tempHouseList[j] in housesDict) {
				housesDict[tempHouseList[j]] += tempAppear;
			} else {
			    housesDict[tempHouseList[j]] = tempAppear;
			}
		}
	}
	//Sort the inner characters based on the total number of episodes appearance
	
	
}



















