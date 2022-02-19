var width1 = 960;
var height1 = 500;
var popVaccArray = [];
var popCaseArray = [];

function popUpVacc(geography, data){
    return '<div class = hoverInfo><strong>' +geography.properties.name + ": " + data.Fully_Vaccinated + '</strong></div>';
};

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width1/2, height1/2])    // translate to center of screen
				   .scale([1000]);          // scale things down so see entire US
        
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
	popVaccArray.push((parseInt(data[d].Fully_Vaccinated_Month12)/parseInt(data[d].Population))*100);
	popCaseArray.push((parseInt(data[d].Total_Cases_Month12)/parseInt(data[d].Population))*100);
}
var lowPopColor = "rgb(255, 255, 255)";
var highPopColor = "rgb(0, 0, 255)";
//console.log(popArray);
var minVacc = d3.min(popVaccArray);
var minCase = d3.min(popCaseArray);
//console.log(minPop);
var maxVacc = d3.max(popVaccArray);
var maxCase = d3.max(popCaseArray);
//console.log(maxPop);
var ramp = d3.scaleLinear().domain([minVacc, maxVacc]).range([lowPopColor, highPopColor])

// Load GeoJSON data and merge with states data
d3.json("./us-states.json", function(json) {

// Loop through each state data value in the .csv file
for (var i = 0; i < data.length; i++) {
	// Grab State Name
	var dataState = data[i].State;

	// Grab data value 
	var dataValue = (parseInt(data[i].Fully_Vaccinated_Month12)/parseInt(data[i].Population))*100

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
	.attr("class", (d) => d.id)
	.attr('id', (d) => d.id + "stateVacc")
	.attr("stroke", "#fff")
	.style("stroke-width", ".05em")
	.style("fill", function(d){return ramp(d.properties.popPercent)})
	.on("mouseover", function(d){d3.selectAll("#" + d.id + 'stateVacc').style("fill", "#ff0")})
	.on("mouseout", function(d){d3.selectAll("#" + d.id + 'stateVacc').style("fill", function(d){return ramp(d.properties.popPercent)})});

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
	   .attr("transform", "translate(0,75)");
	
	var y = d3.scaleLinear().range([120, 10]).domain([minVacc, maxVacc]);
	var yAxis = d3.axisRight(y).ticks(5);

	key.append("g").attr("class", "y axis").attr("transform", "translate(41,65)").call(yAxis)
	});

    let average_vacc = d3.mean(popVaccArray);
    console.log(average_vacc)

    let std_vacc = d3.deviation(popVaccArray);

    console.log("standard deviation " + std_vacc);
    
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

        data.forEach(d => {
            d.Population = parseInt(d.Population);
            d.Fully_Vaccinated = parseInt(d.Fully_Vaccinated_Month12);
            d.Total_Cases = parseInt(d.Total_Cases_Month12);
        });

    var maxVacc = d3.max(data, function(d) {return (+d.Fully_Vaccinated_Month12/(+d.Population)*100)});
        //console.log(maxVacc);
        
    const barX = d3.scaleBand().domain(d3.range(data.length))
                                .range([barMargin.left, barDisplayWidth - barMargin.left])
                                .padding(.2);
    const barY = d3.scaleLinear().domain([0, 80])
                                  .range([barDisplayHeight - barMargin.top, barMargin.bottom]);

    barOneDisplay.append("g").attr("fill", "rgb(0, 0, 255)")
                                 .selectAll("rect")
                                 .data(data.sort((a,b)=> d3.descending((a.Fully_Vaccinated_Month12/a.Population)*100, (b.Fully_Vaccinated_Month12/b.Population)*100)))
                                 .enter()
                                 .append("rect")
                                 .attr("x", (d, i) => barX(i))
                                 .attr("y", (d) => barY((d.Fully_Vaccinated_Month12/d.Population)*100))
                                 .attr("height", d => barY(0) - barY((d.Fully_Vaccinated_Month12/d.Population)*100))
                                 .attr("width", barX.bandwidth())
                                 .attr("class", function(d){return d.ID + 'barVacc'})
								 .attr('id', (d) => d.ID + 'barVacc')
								 .on("mouseover", function(d){d3.selectAll("."+d.ID + 'barVacc').style("fill", "#ff0")})
								 .on("mouseout", function(d){d3.selectAll("."+d.ID +'barVacc').style("fill", "#00f")});
    barOneDisplay.append('g').selectAll("text")
                 .data(data.sort((a, b) => d3.descending((a.Fully_Vaccinated_Month12/a.Population)*100, (b.Fully_Vaccinated_Month12/b.Population)*100)))
                 .enter()
                 .append("text")
                 .attr("x", (d, i) => barX(i))
                 .attr("y", (d) => barY((d.Fully_Vaccinated_Month12/d.Population)*100) - 3)
                 .text((d) => parseInt((d.Fully_Vaccinated_Month12/d.Population)*100));

	barOneDisplay.append("g").attr("fill", "rgba(255, 0, 0)")
				 .selectAll("rect")
				 .data(data.sort((a,b)=> d3.descending((a.Full_Vaccinated_Month12/a.Population)*100, (b.Fully_Vaccinated_Month12/b.Population)*100)))
				 .enter()
				 .append("rect")
				 .attr("x", (d, i) => barX(i))
				 .attr("y", (d) => barY((d.Total_Cases_Month12/d.Population)*100))
				 .attr("height", d => barY(0) - barY((d.Total_Cases_Month12/d.Population)*100))
				 .attr("width", barX.bandwidth())
				 .attr("class", function(d){return d.ID + 'barCase'})
				 .attr('id', (d) => d.ID + 'barCase')
				 .on("mouseover", function(d){d3.selectAll("."+d.ID + 'barCase').style("fill", "#ff0")})
				 .on("mouseout", function(d){d3.selectAll("."+d.ID + 'barCase').style("fill", "#f00")});

	barOneDisplay.append('g').selectAll("text")
 				 .data(data.sort((a, b) => d3.descending((a.Full_Vaccinated_Month12/a.Population)*100, (b.Fully_Vaccinated_Month12/b.Population)*100)))
      			 .enter()
 				 .append("text")
 				 .attr("x", (d, i) => barX(i))
 				 .attr("y", (d) => barY((d.Total_Cases_Month12/d.Population)*100) - 3)
 				 .text((d) => parseInt((d.Total_Cases_Month12/d.Population)*100))
				 .style('fill', '#fff');

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
			
// // Load in my states data!
// d3.csv("./StatePopData.csv", function(data) {
// //color.domain([0,1,2]); // setting the range of the input data
// var caseArray = [];
// for(var d = 0; d < data.length; d++){
// 	caseArray.push((parseInt(data[d].Total_Cases_Month12)/parseInt(data[d].Population))*100)
// }


// const caseDisplayWidth = 1000;
// const caseDisplayHeight = 1000;
// const caseMargin = {top: 20, left: 30, right: 30, bottom: 30};

//     var barTwoDisplay = d3.select("#bar2")
//                 .append("svg")
//                 .attr("height", caseDisplayHeight - caseMargin.top - caseMargin.bottom)
//                 .attr("width", caseDisplayWidth - caseMargin.right - caseMargin.left)
//                 .attr("viewBox", [0, 0, caseDisplayWidth, caseDisplayHeight + 350]);
    

//         data.forEach(d => {
//             d.Population = parseInt(d.Population);
//             d.Fully_Vaccinated = parseInt(d.Fully_Vaccinated_Month12);
//             d.Total_Cases = parseInt(d.Total_Cases_Month12);
//         });

        
//         const caseX = d3.scaleBand().domain(d3.range(data.length))
//                                 .range([caseMargin.left, caseDisplayWidth - caseMargin.left])
//                                 .padding(.2);
//         const caseY = d3.scaleLinear().domain([0, 28])
//                                   .range([caseDisplayHeight - caseMargin.top, caseMargin.bottom]);

//         barTwoDisplay.append("g").attr("fill", "rgb(255, 0, 0)")
//                                  .selectAll("rect")
//                                  .data(data.sort((a,b)=> d3.descending((a.Total_Cases_Month12/a.Population)*100, (b.Total_Cases_Month12/b.Population)*100)))
//                                  .enter()
//                                  .append("rect")
//                                  .attr("x", (d, i) => caseX(i))
//                                  .attr("y", (d) => caseY((d.Total_Cases_Month12/d.Population)*100))
//                                  .attr("height", d => caseY(0) - caseY((d.Total_Cases_Month12/d.Population)*100))
//                                  .attr("width", caseX.bandwidth())
//                                  .attr("class", function(d){return d.ID + "Case"})
// 								 .attr('id',function(d){return d.ID+'bar'})
// 								 .on("mouseover", function(d){d3.selectAll("."+d.ID + "Case").style("fill", "#ff0")})
// 								 .on("mouseout", function(d){d3.selectAll("."+d.ID + "Case").filter('#'+d.ID+'state').style("fill", '#f00')});

//         barTwoDisplay.selectAll("text")
//                      .data(data.sort((a, b) => d3.descending((a.Total_Cases_Month12/a.Population)*100, (b.Total_Cases_Month12/b.Population)*100)))
//                      .enter()
//                      .append("text")
//                      .attr("x", (d, i) => caseX(i))
//                      .attr("y", (d) => caseY((d.Total_Cases_Month12/d.Population)*100) - 3)
//                      .text((d) => parseInt((d.Total_Cases_Month12/d.Population)*100));

//         barTwoDisplay.append("g").attr("transform", `translate(0, ${caseDisplayHeight - caseMargin.bottom + 10})`)
//                                  .call(d3.axisBottom(caseX).tickFormat(i => data[i].State))
//                                  .attr("font-size", "15px")
//                                  .selectAll("text")
//                                  .style("text-anchor", "end")
//                                  .attr("dx", "-.75em")
//                                  .attr("dy", "-.25em")
//                                  .attr("transform", "rotate(-65)");
//         barTwoDisplay.append("g").call(d3.axisLeft(caseY).ticks(null, data.format))
//                                  .attr("transform", `translate(${caseMargin.left}, 0)`)
//                                  .attr("font-size", "15px");
//     });


// const margin_line = { top: 30, right: 20, bottom: 20, left: 30 };
// var width3 = 960 - margin_line.left - margin_line.right;
// var height3 = 600 - margin_line.top - margin_line.bottom;

