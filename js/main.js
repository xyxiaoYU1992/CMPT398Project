// This is the main javascript file
// Author: Ruida Xie & Tong Wang

// Set up geometric size
var margin = {left:150, top:50, right:150, bottom:50},
    //width = Math.max( Math.min(window.innerWidth, 1100) - margin.left - margin.right - 20, 400),
    //height = Math.max( Math.min(window.innerHeight - 250, 900) - margin.top - margin.bottom - 20, 400),
    width = 1400;
    height = 1200;
    innerRadius = Math.min(width * 0.33, height * .45),
    outerRadius = innerRadius * 1.05;

width = outerRadius * 2.6 + margin.right + margin.left;
height = outerRadius * 2 + margin.top + margin.bottom;

var newFontSize = Math.min(80, Math.max(40, innerRadius * 62.5 / 250));
d3.select("html").style("font-size", newFontSize + "%");

// Set up necessary parameters
var pullOutSize = 120 + 20/135 * innerRadius;
var defaultOpacity = 0.85,
    fadeOpacity = 0.075;

// Set up the data assessors
var numFormat = d3.format(",.0f");
var loom = d3.loom()
    .value(function(d){ return d.appeared})
    .inner(function(d){ return d.name})
    .outer(function(d){ return d.houseallegiance})

// Set up appearence 
loom.padAngle(0.07)
    .widthInner(40)
    .heightInner(18)
    .emptyPerc(0.3)

var arc = d3.arc()
    .innerRadius(innerRadius*1.01)
    .outerRadius(outerRadius);

var string = d3.string()
    .radius(innerRadius)
    .pullout(pullOutSize);

// Create SVG
var svg = d3.select("#GoTVis").append("svg")
    .attr("width", 1800 + margin.left + margin.right)
    .attr("height", 1200 + margin.top + margin.bottom);

// Create data var
var characters; // read from csv
var cleanedChars = []; // Transform characters into list of object
var cleanedCharsJSON; // stringify cleanedChars
var housesDict = {};
var numChars = 54;

// Create temp var
var tempInnerInfo;
var tempAppear;

// Manually sorted the characters based on their appearances
// In descending order
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
d3.csv('data/thrones_characters.csv', function (data) {
    characters = data;

    //separate the allengiance into an array
    for(var i = 0; i < numChars; i++){
        //console.log(characters[i].houseallegiance);
        characters[i].houseallegiance = characters[i].houseallegiance.split(", ")
    }

    // Find the total number of appearance per house
    // Create a House dictionary to store the houses and its members appearence infomation
    for(var i = 0; i < numChars; i++){
        for(var j = 0; j < characters[i].houseallegiance.length; j++){
             housesDict[characters[i].houseallegiance[j]] = {appeared:0};
        }
    }

    for(var i = 0; i < numChars; i++){
        for(var j = 0; j < characters[i].houseallegiance.length; j++){
             if(characters[i].houseallegiance[j] in housesDict){
                housesDict[characters[i].houseallegiance[j]].appeared = housesDict[characters[i].houseallegiance[j]].appeared + parseFloat(characters[i].appeared); 
             }
        }
    }
    // Clean raw data, transform it into list of object
    for (var i = 0; i < numChars; i++) {
        if (characters[i].houseallegiance.length > 1) {
            for (var j = 0; j < characters[i].houseallegiance.length; j++) {
                cleanedChars.push({name: characters[i].name, houseallegiance: characters[i].houseallegiance[j]
                                 , appeared: parseInt(characters[i].appeared), culture: characters[i].culture
                                 , deathcause: characters[i].deathcause, gender: characters[i].gender
                                 , image: characters[i].image, origin: characters[i].origin
                                 , portrayed: characters[i].portrayed, religion: characters[i].religion
                                 , season: characters[i].season, status: characters[i].status});
            }
        } else {
            cleanedChars.push({name: characters[i].name, houseallegiance: characters[i].houseallegiance
                             , appeared: parseInt(characters[i].appeared), culture: characters[i].culture
                             , deathcause: characters[i].deathcause, gender: characters[i].gender
                             , image: characters[i].image, origin: characters[i].origin
                             , portrayed: characters[i].portrayed, religion: characters[i].religion
                             , season: characters[i].season, status: characters[i].status});
        }
    }
    cleanedCharsJSON = JSON.stringify(cleanedChars);

    var nestedChar = d3.nest()
        .key(function(d) {
            return d.name;
        })
        .rollup(function(leaves) { 
            return d3.sum(leaves, function(d) { 
                return d.appeared; 
            }); 
        })
        .entries(cleanedChars);
    // Sort the inner characters based on the total number of episodes appearance
    function sortCharacter(a, b) {
        return characterOrder.indexOf(a) - characterOrder.indexOf(b); 
    }
    // Set more loom functions
    loom.sortSubgroups(sortCharacter);
    // Color for the unique houses
    var colors = ["#5a3511", "#47635f", "#223e15", "#FF0000", "#0d1e25", "#53821a", "#4387AA", "#770000", 
                  "#373F41", "#602317", "#8D9413", "#c17924", "#3C7E16", "#DC143C", "#483D8B", "#800080", 
                  "#1E90FF", "#F08080", "#FFA500", "#ADFF2F", "#DDA0DD", "#BDB76B", "#00FF00", "#48D1CC",
                  "#9370DB", "#00FFFF", "#20B2AA", "#87CEFA", "#FFD700", "#DA70D6", "#808080", "#FFDEAD"];
    var color = d3.scaleOrdinal()
        .domain(Object.keys(housesDict))
        .range(colors);

    // Create a group that already holds the data
    var g = svg.append("g")
        .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")")
        .datum(loom(cleanedChars));

    // Set-up title
    var titles = g.append("g")
        .attr("class", "texts")
        .style("opacity", 0);
        
    titles.append("text")
        .attr("class", "name-title")
        .attr("x", 0)
        .attr("y", -innerRadius*5/6 - 155);
        
    titles.append("text")
        .attr("class", "value-title")
        .attr("x", 0)
        .attr("y", -innerRadius*5/6 - 125);

    // Draw outer arcs
    var houseArcs = g.append("g")
        .attr("class", "arcs")
        .selectAll("g")
        .data(function(s) {
            return s.groups;
        })
        .enter()
        .append("g")
        .attr("class", "arc-wrapper")
        .each(function(d) {
            d.pullOutSize = (pullOutSize * ( d.startAngle > Math.PI + 1e-2 ? -1 : 1));
        })
        .on("mouseover", function(d) {
            // Hide all other arcs
            d3.selectAll(".arc-wrapper")
              .transition()
             .style("opacity", function(s) {
                return s.outername === d.outername ? 1 : 0.5;
             });
            // Hide all other strings
            d3.selectAll(".string")
              .transition()
              .style("opacity", function(s) {
                return s.outer.outername === d.outername ? 1 : fadeOpacity;
              });
            // Find the data for the strings of the hovered over house
            var houseData = loom(cleanedChars).filter(function(s) { return s.outer.outername === d.outername; });
            // Hide the characters who don't allegiance that house
            d3.selectAll(".inner-label")
              .transition()
              .style("opacity", function(s) {
                // Find out how many episodes the character appeared at the hovered over house
                var char = houseData.filter(function(c) { return c.outer.innername === s.name; });
                return char.length === 0 ? 0.1 : 1;
              }); 
        })
        .on("mouseout", function(d) {
            // Show all arc labels
            d3.selectAll(".arc-wrapper")
             .transition()
              .style("opacity", 1);
            // Show all strings
            d3.selectAll(".string")
              .transition()
              .style("opacity", defaultOpacity);
            // Show all characters
            d3.selectAll(".inner-label")
              .transition()
              .style("opacity", 1);
        });

    var outerArcs = houseArcs.append("path")
        .attr("class", "arc")
        .style("fill", function(d) { return color(d.outername); })
        .attr("d", arc)
        .attr("transform", function(d, i) { //Pull the two slices apart
            return "translate(" + d.pullOutSize + ',' + 0 + ")";
        });

    // Draw outter labels
    // The text needs to be rotated with the offset in the clockwise direction
    var outerLabels = houseArcs.append("g")
        .each(function(d) {
        	d.angle = ((d.startAngle + d.endAngle) / 2);
        })
        .attr("class", "outer-labels")
        .attr("text-anchor", function(d) {
            return d.angle > Math.PI ? "end" : null;
        })
        .attr("transform", function(d,i) {
        	var c = arc.centroid(d);
        	return "translate(" + (c[0] + d.pullOutSize) + "," + c[1] + ")"
        	+ "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
        	+ "translate(" + 26 + ",0)"
        	+ (d.angle > Math.PI ? "rotate(180)" : "");
        });
    // Display the outer name(houses)
    outerLabels.append("text")
        .attr("class", "outer-label")
        .attr("dy", ".35em")
        .text(function(d, i) {
        	return d.outername;
        });
    // Display outer name's value(number of episodes)
    outerLabels.append("text")
        .attr("class", "outer-label-value")
        .attr("dy", "1.5em")
        .text(function(d, i){ 
        	return numFormat(d.value) + " episodes"; 
        });
    // Draw inner strings
    var strings = g.append("g")
	    .attr("class", "stringWrapper")
		.style("isolation", "isolate")
	    .selectAll("path")
	    .data(function(strings) { 
			return strings; 
		})
	    .enter().append("path")
		.attr("class", "string")
		.style("mix-blend-mode", "multiply")
	    .attr("d", string)
	    .style("fill", function(d) { 
	    	return d3.rgb( color(d.outer.outername) ).brighter(0.2); 
	    })
		.style("opacity", defaultOpacity);

	// Draw inner labels
	// The text also needs to be displaced in the horizontal directions
	// And also rotated with the offset in the clockwise direction
	var innerLabels = g.append("g")
		.attr("class","inner-labels")
	    .selectAll("text")
	    .data(function(s) { 
            return s.innergroups;
		})
	    .enter().append("text")
		.attr("class", "inner-label")
		.attr("x", function(d, i) { return d.x; })
		.attr("y", function(d, i) { return d.y; })
		.style("text-anchor", "middle")
		.attr("dy", ".35em")
	    .text(function(d,i) { return d.name; })
 	 	.on("mouseover", function(d) {
            //Empty the popup infomation

            for(var i = 0; i < characters.length; i++){
                if(d.name == characters[i].name){
                    tempInnerInfo = characters[i];
                }
            }
			//Show all the strings of the highlighted character and hide all else
		    d3.selectAll(".string")
		      	.transition()
		        .style("opacity", function(s) {
					return s.outer.innername !== d.name ? fadeOpacity : 1;
				});	
			//Update the appearance count of the outer labels
			var characterData = loom(cleanedChars).filter(function(s) { return s.outer.innername === d.name; });
			d3.selectAll(".outer-label-value")
				.text(function(s,i){
					//Find which characterData is the correct one based on house
					var hou = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					if(hou.length === 0) {
						var value = 0;
					} else {
						var value = hou[0].outer.value;
					}
					return value + (value === 1 ? " episode" : " episodes");
				});
			//Hide the arc where the character doesn't loyal to
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", function(s) {
					//Find which characterData is the correct one based on location
					var hou = characterData.filter(function(c) { return c.outer.outername === s.outername; });
					return hou.length === 0 ? 0.1 : 1;
				});
			//Update the title to show the total appearance count of the character
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 1);	
			d3.select(".name-title")
				.text(d.name);
			d3.select(".value-title")
				.text(function() {
					var appear = nestedChar.filter(function(s) { return s.key === d.name; });
					return "Appeared in " + tempInnerInfo.appeared + " episodes";
				});
			//Show the character note
            $("#node-info").empty();
            $("#charTemplate").tmpl(
                {              
                    name: tempInnerInfo.name,
                    house: tempInnerInfo.houseallegiance,
                    color: getStatusColor(tempInnerInfo.status),
                    imagesrc: tempInnerInfo.image,
                    episodes: tempInnerInfo.appeared,
                    status: tempInnerInfo.status,
                    season: tempInnerInfo.season,
                    religion: tempInnerInfo.religion,
                    culture: tempInnerInfo.culture,
                    portrayed: tempInnerInfo.portrayed                
                }
            ).appendTo( "#node-info");
            var houses = tempInnerInfo.houseallegiance;
            $.each(houses, function(i, t){
                $("#listTemplate").tmpl( {item: t}).appendTo( "#node-house-references .node-data" );
            })            
            $("#node-info").show();		
		})
     	.on("mouseout", function(d) {
            //hide the popup
            $("#node-info").hide();
			//Put the string opacity back to normal
		    d3.selectAll(".string")
		      	.transition()
				.style("opacity", defaultOpacity);
			//Return the word count to what it was
			d3.selectAll(".outer-label-value")	
				.text(function(s,i){ return s.value + " episodes"; });
			//Show all arcs again
			d3.selectAll(".arc-wrapper")
		      	.transition()
		        .style("opacity", 1);
			//Hide the title
			d3.selectAll(".texts")
				.transition()
				.style("opacity", 0);
        });
        $('.inner-label').mousemove(setPopupPosition);
});

// set the color for the character status
function getStatusColor(status){
	if (status == 'Alive') {
		color = '#7EFF2B';
	} else {
		color = '#00302B';
	}
	return color;
}

// the function to set up the position
function setPopupPosition(e){
	e = jQuery.event.fix(e);
	mouseX = e.pageX;
    mouseY = e.pageY;

	if(mouseY < $('#GoTVis').offset().top + $('#GoTVis').outerHeight()/2){
		//bottom
        mouseY += 10;
	} else {
		//top
        mouseY -= $('#node-info').outerHeight() + 10
	}

	if(mouseX < $('#GoTVis').offset().left + $('#GoTVis').outerWidth()/2 ){
		//left side
		mouseX -= $('#node-info').outerWidth() + 10;

		if(mouseX  < 0){
			mouseX = 10;
		}

	} else {
		//right side
		mouseX += 10;

		if(mouseX + $("#node-info").outerWidth() > $(window).width() - 20){
			mouseX = $(window).width() - 10 - $("#node-info").outerWidth();
		}
	}

	if(e.pageY + $('#node-info').outerHeight() + 20 > $(document).height() ){
		mouseY = e.pageY - 20 - $('#node-info').outerHeight();
	}

	$('.got-popup').css({
		top: mouseY,
		left: mouseX
	})
}
