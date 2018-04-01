// This is the main javascript file
// Authro: Ruida Xie & Tong Wang

// Set up geometric size
var diameter = 940;
var radius = diameter / 2;
var innerRadius = radius - 270;

// Set up the data assessors
var loom = d3.loom()
    .value(function(d){ return d.appear})
    .inner(function(d){ return d.name})
    .outer(function(d){ return 0}) // TO DO: extract houses from characters, repeat characters allowed.

// Set up appearence 
loom.padAngle(0.05)
    .widthInner(30)
    .heightInner(20)
    .emptyPerc(0.2)