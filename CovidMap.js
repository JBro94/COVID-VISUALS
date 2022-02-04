var width1 = 960;
var height1 = 500;
var popArray = [];

function popUpVacc(geography, data){
    return '<div class = hoverInfo><strong>' +geography.properties.name + ": " + data.Fully_Vaccinated + '</strong></div>';
};

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width1/2, height1/2])    // translate to center of screen
				   .scale([800]);          // scale things down so see entire US
        
// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);  // tell path generator to use albersUsa projection

//Create SVG element and append map to the SVG
var svgMap = d3.select("#map")
			.append("svg")
			.attr("width", width1)
			.attr("height", height1);

// Load in my states data!
d3.csv("./StatePopData.csv", function(data) {
//color.domain([0,1,2]); // setting the range of the input data

for(let d = 0; d < data.length; d++){
	popArray.push((parseInt(data[d].Fully_Vaccinated)/parseInt(data[d].Population))*100)
}
var lowPopColor = "rgb(255, 255, 255)";
var highPopColor = "rgb(0, 0, 255)";
//console.log(popArray);
var minPop = d3.min(popArray);
//console.log(minPop);
var maxPop = d3.max(popArray);
//console.log(maxPop);
var ramp = d3.scaleLinear().domain([minPop, maxPop]).range([lowPopColor, highPopColor])

// Load GeoJSON data and merge with states data
d3.json("./us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {
	// Grab State Name
	var dataState = data[i].State;

	// Grab data value 
	var dataValue = (parseInt(data[i].Fully_Vaccinated)/parseInt(data[i].Population))*100

	// Find the corresponding state inside the GeoJSON
	for (let j = 0; j < json.features.length; j++)  {
		let jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.popPercent = dataValue; 

		// Stop looking through the JSON
		break;
		}
	}
}



// Bind the data to the SVG and create one path per GeoJSON feature
svgMap.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", path)
	.attr("class", function(d){return d.id})
	.style("stroke-width", ".05em")
	.style("fill", function(d){return ramp(d.properties.popPercent)});

svgMap.append("g").attr("class", "stateId").selectAll("text").data(json.features).enter().append("svg:text").text(function(d){return d.id})
										   .attr("x", function(d){
											   return path.centroid(d)[0];
										   })
										   .attr("y", function(d){
											   return path.centroid(d)[1];
										   })
										   .attr("text-anchor", "middle")
										   .attr("fill", "#333");

var key = d3.select("#map")
			.append("svg")
			.attr("width", 140)
			.attr("height", 200)
			.attr("class", "legend1"); 

var legend = key.append("defs")
				.append("svg:linearGradient")
				.attr("id", "gradient")
				.attr("x1", "100%")
				.attr("y1", "0%")
				.attr("x2", "100%")
				.attr("y2", "100%")
				.attr("spreadMethod", "pad");

  	legend.append("stop")
   		  .attr("offset", "0%")
   		  .attr("stop-color", highPopColor)
   		  .style("stop-opacity", 1);

  	legend.append("stop")
	  	  .attr("offset", "100%")
		  .attr("stop-color", lowPopColor)
		  .style("stop-opacity", 1);
	
	key.append("rect")
	   .attr("width", 40)
	   .attr("height", 112)
	   .style("fill", "url(#gradient)")
	   .attr("transform", "translate(0,20)");
	
	var y = d3.scaleLinear().range([120, 10]).domain([0, 100]);
	var yAxis = d3.axisRight(y);

	key.append("g").attr("class", "y axis").attr("transform", "translate(41,10)").call(yAxis)
	});

    let average_vacc = d3.mean(popArray);
    console.log(average_vacc)

    let std_vacc = d3.deviation(popArray);

    console.log("standard deviation " + std_vacc);
    
});

//console.log(popArray);
var vacc_Array = [];
var case_Values = [];
const barDisplayWidth = 1000;
const barDisplayHeight = 1000;
const barMargin = {top: 20, left: 30, right: 30, bottom: 30};

var barOneDisplay = d3.select("#bar")
                .append("svg")
                .attr("height", barDisplayHeight - barMargin.top - barMargin.bottom)
                .attr("width", barDisplayWidth - barMargin.right - barMargin.left)
                .attr("viewBox", [0, 0, barDisplayWidth, barDisplayHeight + 350]);

d3.csv("./StatePopData.csv", function(data){
        data.forEach(d => {
            d.Population = parseInt(d.Population);
            d.Fully_Vaccinated = parseInt(d.Fully_Vaccinated);
            d.Total_Cases = parseInt(d.Total_Cases);
        });

    var maxVacc = d3.max(data, function(d) {return (+d.Fully_Vaccinated/(+d.Population)*100)});
        //console.log(maxVacc);
        
    const barX = d3.scaleBand().domain(d3.range(data.length))
                                .range([barMargin.left, barDisplayWidth - barMargin.left])
                                .padding(.2);
    const barY = d3.scaleLinear().domain([0, 80])
                                  .range([barDisplayHeight - barMargin.top, barMargin.bottom]);

    barOneDisplay.append("g").attr("fill", "rgb(0, 0, 255)")
                                 .selectAll("rect")
                                 .data(data.sort((a,b)=> d3.descending((a.Fully_Vaccinated/a.Population)*100, (b.Fully_Vaccinated/b.Population)*100)))
                                 .enter()
                                 .append("rect")
                                 .attr("x", (d, i) => barX(i))
                                 .attr("y", (d) => barY((d.Fully_Vaccinated/d.Population)*100))
                                 .attr("height", d => barY(0) - barY((d.Fully_Vaccinated/d.Population)*100))
                                 .attr("width", barX.bandwidth())
                                 .attr("class", function(d){return d.ID});
    barOneDisplay.selectAll("text")
                 .data(data.sort((a, b) => d3.descending((a.Fully_Vaccinated/a.Population)*100, (b.Fully_Vaccinated/b.Population)*100)))
                 .enter()
                 .append("text")
                 .attr("x", (d, i) => barX(i))
                 .attr("y", (d) => barY((d.Fully_Vaccinated/d.Population)*100) - 3)
                 .text((d) => parseInt((d.Fully_Vaccinated/d.Population)*100));

    barOneDisplay.append("g").attr("transform", `translate(0, ${barDisplayHeight - barMargin.bottom + 10})`)
                                 .call(d3.axisBottom(barX).tickFormat(i => data[i].State))
                                 .attr("font-size", "15px")
                                 .selectAll("text")
                                 .style("text-anchor", "end")
                                 .attr("dx", "-.75em")
                                 .attr("dy", "-.25em")
                                 .attr("transform", "rotate(-65)");
    barOneDisplay.append("g").call(d3.axisLeft(barY))
                                 .attr("transform", `translate(${barMargin.left}, 0)`)
                                 .attr("font-size", "15px");
});

d3.selectAll(".vacc_visual")
	.on("mouseover", function(){
		d3.selectAll(".vacc_visual").style("fill", "green")
	});

//Width and height of map
var width2 = 960;
var height2 = 500;

// D3 Projection
var projection2 = d3.geoAlbersUsa()
				   .translate([width2/2, height2/2])    // translate to center of screen
				   .scale([800]);          // scale things down so see entire US
        
// Define path generator
var states = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection2);  // tell path generator to use albersUsa projection


var svg2 = d3.select("#map2")
			.append("svg")
			.attr("width", width2)
			.attr("height", height2);
        
// Append Div for tooltip to SVG
var div2 = d3.select("#map2")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

// Load in my states data!
d3.csv("./StatePopData.csv", function(data) {
//color.domain([0,1,2]); // setting the range of the input data
var caseArray = [];
for(var d = 0; d < data.length; d++){
	caseArray.push((parseInt(data[d].Total_Cases)/parseInt(data[d].Population))*100)
}
var lowCaseColor = "rgb(255, 255, 255)";
var highCaseColor = "rgb(255, 0, 0)";
//console.log(caseArray);
let minCase = d3.min(caseArray);
//console.log(minPop);
let maxCase = d3.max(caseArray);
//console.log(maxPop);
let ramp2 = d3.scaleLinear().domain([minCase, maxCase]).range([lowCaseColor, highCaseColor])

// Load GeoJSON data and merge with states data
d3.json("./us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (let i = 0; i < data.length; i++) {
	// Grab State Name
	let dataState = data[i].State;

	// Grab data value 
	let dataValue = (parseInt(data[i].Total_Cases)/parseInt(data[i].Population))*100

	// Find the corresponding state inside the GeoJSON
	for (let j = 0; j < json.features.length; j++)  {
		let jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.popCase = dataValue; 

		// Stop looking through the JSON
		break;
		}
	}
}

let averageCase = d3.mean(caseArray);
console.log(averageCase)
let std_case = d3.deviation(caseArray);
console.log("standard deviation " + std_case)
// Bind the data to the SVG and create one path per GeoJSON feature
svg2.selectAll("path")
	.data(json.features)
	.enter()
	.append("path")
	.attr("d", states)
	.attr("class", "case_visual")
	.style("stroke-width", ".15em")
	.style("fill", function(d){return ramp2(d.properties.popCase)});


var key2 = d3.select("#map2")
			.append("svg")
			.attr("width", 240)
			.attr("height", 500)
			.attr("class", "legend2"); 

var legend2 = key2.append("defs")
				.append("svg:linearGradient")
				.attr("id", "gradient1")
				.attr("x1", "100%")
				.attr("y1", "0%")
				.attr("x2", "100%")
				.attr("y2", "100%")
				.attr("spreadMethod", "pad");

  	legend2.append("stop")
   		  .attr("offset", "0%")
   		  .attr("stop-color", highCaseColor)
   		  .style("stop-opacity", 1);

  	legend2.append("stop")
	  	  .attr("offset", "100%")
		  .attr("stop-color", lowCaseColor)
		  .style("stop-opacity", 1);
	
	key2.append("rect")
	   .attr("width", 40)
	   .attr("height", 112)
	   .style("fill", "url(#gradient1)")
	   .attr("transform", "translate(50,290)");
	
	var y2 = d3.scaleLinear().range([120, 10]).domain([0, 100]);
	var yAxis2 = d3.axisRight(y2);

	key2.append("g").attr("class", "y axis").attr("transform", "translate(91,280)").call(yAxis2)
	});
});

const caseDisplayWidth = 1000;
const caseDisplayHeight = 1000;
const caseMargin = {top: 20, left: 30, right: 30, bottom: 30};

    var barTwoDisplay = d3.select("#bar2")
                .append("svg")
                .attr("height", caseDisplayHeight - caseMargin.top - caseMargin.bottom)
                .attr("width", caseDisplayWidth - caseMargin.right - caseMargin.left)
                .attr("viewBox", [0, 0, caseDisplayWidth, caseDisplayHeight + 350]);
    

    d3.csv("./StatePopData.csv", function(data){
        data.forEach(d => {
            d.Population = parseInt(d.Population);
            d.Fully_Vaccinated = parseInt(d.Fully_Vaccinated);
            d.Total_Cases = parseInt(d.Total_Cases);
        });

        var maxCaseNum = d3.max(data, function(d) {return (+d.Total_Cases/(+d.Population)*100)});
        //console.log(maxVacc);
        
        const caseX = d3.scaleBand().domain(d3.range(data.length))
                                .range([caseMargin.left, caseDisplayWidth - caseMargin.left])
                                .padding(.2);
        const caseY = d3.scaleLinear().domain([0, 30])
                                  .range([caseDisplayHeight - caseMargin.top, caseMargin.bottom]);

        barTwoDisplay.append("g").attr("fill", "rgb(255, 0, 0)")
                                 .selectAll("rect")
                                 .data(data.sort((a,b)=> d3.descending((a.Total_Cases/a.Population)*100, (b.Total_Cases/b.Population)*100)))
                                 .enter()
                                 .append("rect")
                                 .attr("x", (d, i) => caseX(i))
                                 .attr("y", (d) => caseY((d.Total_Cases/d.Population)*100))
                                 .attr("height", d => caseY(0) - caseY((d.Total_Cases/d.Population)*100))
                                 .attr("width", caseX.bandwidth())
                                 .attr("class", "case_visual");

        barTwoDisplay.selectAll("text")
                     .data(data.sort((a, b) => d3.descending((a.Total_Cases/a.Population)*100, (b.Total_Cases/b.Population)*100)))
                     .enter()
                     .append("text")
                     .attr("x", (d, i) => caseX(i))
                     .attr("y", (d) => caseY((d.Total_Cases/d.Population)*100) - 3)
                     .text((d) => parseInt((d.Total_Cases/d.Population)*100));

        barTwoDisplay.append("g").attr("transform", `translate(0, ${caseDisplayHeight - caseMargin.bottom + 10})`)
                                 .call(d3.axisBottom(caseX).tickFormat(i => data[i].State))
                                 .attr("font-size", "15px")
                                 .selectAll("text")
                                 .style("text-anchor", "end")
                                 .attr("dx", "-.75em")
                                 .attr("dy", "-.25em")
                                 .attr("transform", "rotate(-65)");
        barTwoDisplay.append("g").call(d3.axisLeft(caseY).ticks(null, data.format))
                                 .attr("transform", `translate(${caseMargin.left}, 0)`)
                                 .attr("font-size", "15px");
    });


const margin_line = { top: 30, right: 20, bottom: 20, left: 30 };
var width3 = 960 - margin_line.left - margin_line.right;
var height3 = 600 - margin_line.top - margin_line.bottom;


