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

// Read data
d3.csv('lotr_words_location.json', function (data) {



















