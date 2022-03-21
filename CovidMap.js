var slider = document.getElementById('myRange');
let dateChosen = slider.value;
console.log(dateChosen);
slider.oninput = function(){
	console.log(this.value);
};

var width1 = 960;
var height1 = 500;
let popArray = [];
var popVaccArray12 = [];
var popCaseArray12 = [];
var popVaccArray11 = [];
var popCaseArray11 = [];
let popVaccArray10 = [];
let popCaseArray10 = [];
let popVaccArray09 = [];
let popCaseArray09 = [];
let popVaccArray08 = [];
let popCaseArray08 = [];
let popCaseArray07 = [];
let popVaccArray07 = [];
let popCaseArray06 = [];
let popVaccArray06 = [];
let popCaseArray05 = [];
let popVaccArray05 = [];
let popCaseArray04 = [];
let popVaccArray04 = [];
let popCaseArray03 = [];
let popVaccArray03 = [];
let popCaseArray02 = [];
let popVaccArray02 = [];
let popCaseArray01 = [];
let popVaccArray01 = [];

// function loadVaccData(){
// 	let chosenVaccArray = [];
// 	switch(slider.value){
// 		case 1:
// 			chosenVaccArray = [...popVaccArray01];
// 			break;
// 		case 2:
// 			chosenVaccArray = [...popVaccArray02];
// 			break;
// 		case 3:
// 			chosenVaccArray = [...popVaccArray03];
// 			break;
// 		case 4:
// 			chosenVaccArray = [...popVaccArray04];
// 			break;
// 		case 5:
// 			chosenVaccArray = [...popVaccArray05];
// 			break;
// 		case 6:
// 			chosenVaccArray = [...popVaccArray06];
// 			break;
// 		case 7:
// 			chosenVaccArray = [...popVaccArray07];
// 			break;
// 		case 8:
// 			chosenVaccArray = [...popVaccArray08];
// 			break;
// 		case 9:
// 			chosenVaccArray = [...popVaccArray09];
// 			break;
// 		case 10:
// 			chosenVaccArray = [...popVaccArray10];
// 			break;
// 		case 11:
// 			chosenVaccArray = [...popVaccArray11];
// 			break;
// 		case 12:
// 			chosenVaccArray = [...popVaccArray12];
// 			break;
// 	}
// 	return chosenVaccArray;
// }

// D3 Projection
// scale things down so see entire US
var projection = d3.geoAlbersUsa()
				   .translate([width1/2, height1/2])// translate to center of screen
				   .scale([1000]);         
// Define path generator
// tell path generator to use albersUsa projection
var path = d3.geoPath()// path generator that will convert GeoJSON to SVG paths
		  	 .projection(projection);

//Create SVG element and append map to the SVG
var svgMap = d3.select("#map")
			   .append("svg")
			   .attr("width", width1)
			   .attr("height", height1);

//Function to dynamically load the chosen data
d3.csv("./StatePopData.csv", function(data) {
	for(let d = 0; d < data.length; d++){
		popArray.push(parseInt(data[d].Population));
		popVaccArray12.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month12)/parseInt(data[d].Population))*100));
		popCaseArray12.push(Math.floor((parseInt(data[d].Total_Cases_Month12)/parseInt(data[d].Population))*100));
		popVaccArray11.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month11)/parseInt(data[d].Population))*100));
		popCaseArray11.push(Math.floor((parseInt(data[d].Total_Cases_Month11)/parseInt(data[d].Population))*100));
		popVaccArray10.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month10)/parseInt(data[d].Population))*100));
		popCaseArray10.push(Math.floor((parseInt(data[d].Total_Cases_Month10)/parseInt(data[d].Population))*100));
		popVaccArray09.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month09)/parseInt(data[d].Population))*100));
		popCaseArray09.push(Math.floor((parseInt(data[d].Total_Cases_Month09)/parseInt(data[d].Population))*100));
		popVaccArray08.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month08)/parseInt(data[d].Population))*100));
		popCaseArray08.push(Math.floor((parseInt(data[d].Total_Cases_Month08)/parseInt(data[d].Population))*100));
		popVaccArray07.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month07)/parseInt(data[d].Population))*100));
		popCaseArray07.push(Math.floor((parseInt(data[d].Total_Cases_Month07)/parseInt(data[d].Population))*100));	
		popVaccArray06.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month06)/parseInt(data[d].Population))*100));
		popCaseArray06.push(Math.floor((parseInt(data[d].Total_Cases_Month06)/parseInt(data[d].Population))*100));
		popVaccArray05.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month05)/parseInt(data[d].Population))*100));
		popCaseArray05.push(Math.floor((parseInt(data[d].Total_Cases_Month05)/parseInt(data[d].Population))*100));
		popVaccArray04.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month04)/parseInt(data[d].Population))*100));
		popCaseArray04.push(Math.floor((parseInt(data[d].Total_Cases_Month04)/parseInt(data[d].Population))*100));
		popVaccArray03.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month03)/parseInt(data[d].Population))*100));
		popCaseArray03.push(Math.floor((parseInt(data[d].Total_Cases_Month03)/parseInt(data[d].Population))*100));
		popVaccArray02.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month02)/parseInt(data[d].Population))*100));
		popCaseArray02.push(Math.floor((parseInt(data[d].Total_Cases_Month02)/parseInt(data[d].Population))*100));
		popVaccArray01.push(Math.floor((parseInt(data[d].Fully_Vaccinated_Month01)/parseInt(data[d].Population))*100));
		popCaseArray01.push(Math.floor((parseInt(data[d].Total_Cases_Month01)/parseInt(data[d].Population))*100));
	}
	console.log(popVaccArray12);
	var lowPopColor = "rgb(255, 255, 255)";
	var highPopColor = "rgb(0, 0, 255)";
	var minVacc = d3.min(popVaccArray12);
	var maxVacc = d3.max(popVaccArray12);
	var ramp = d3.scaleLinear().domain([minVacc, maxVacc]).range([lowPopColor, highPopColor])
	// Load GeoJSON data and merge with states data
	d3.json("./us-states.json", function(json) {
		// Loop through each state data value in the .csv file
		for (var i = 0; i < data.length; i++) {
			// Grab State Name
			var dataState = data[i].State;
			for (let j = 0; j < json.features.length; j++)  {
				let jsonState = json.features[j].properties.name;
				if (dataState == jsonState) {
				// Copy the data value into the JSON
				json.features[j].properties.popNum = parseInt(data[i].Population);
				json.features[j].properties.popPercent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month12)/parseInt(data[i].Population)*100);
				json.features[j].properties.caseNumber = parseInt(data[i].Total_Cases_Month12);
				json.features[j].properties.vaxNumber = parseInt(data[i].Fully_Vaccinated_Month12);
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
			.attr("stroke", "#005")
			.style("stroke-width", ".05em")
			.style("fill", function(d){return ramp(d.properties.popPercent)})
			.on("mouseover", function(d){
				d3.selectAll("." + d.id).style("fill", "#ff0")
				d3.selectAll('#'+ d.id + 'caseNumber').style('fill', '#000')
				document.getElementById('dataDisplay').innerHTML = d.properties.name + ": Number of Fully Vaccinated: " + d.properties.vaxNumber + ", No. Cases: " + d.properties.caseNumber;
			})
			.on("mouseout", function(d){
				d3.selectAll("#" + d.id + 'stateVacc').style("fill", function(d){return ramp(d.properties.popPercent)})
				d3.selectAll('#' + d.id + 'barVacc').style('fill', '#00f')
				d3.selectAll('#'+ d.id + 'caseNumber').style('fill', '#fff')
			});
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
		
		key.append("g").attr("class", "y axis").attr("transform", "translate(41,65)").call(yAxis);

		console.log(json.features.sort((a,b)=>b.properties.popPercent-a.properties.popPercent));
	
			
	const barDisplayWidth = 1000;
	const barDisplayHeight = 1000;
	const barMargin = {top: 20, left: 30, right: 30, bottom: 30};
		
	var barOneDisplay = d3.select("#bar")
						  .append("svg")
						  .attr("height", barDisplayHeight - barMargin.top - barMargin.bottom)
						  .attr("width", barDisplayWidth - barMargin.right - barMargin.left)
						  .attr("viewBox", [0, 0, barDisplayWidth, barDisplayHeight + 350]);
			
	const barX = d3.scaleBand().domain(d3.range(data.length))
										.range([barMargin.left, barDisplayWidth - barMargin.left])
										.padding(.2);
	const barY = d3.scaleLinear().domain([0, 100])
										  .range([barDisplayHeight - barMargin.top, barMargin.bottom]);
		
	barOneDisplay.append("g").attr("fill", "rgb(0, 0, 255)")
										 .selectAll("rect")
										 .data(json.features.sort((a,b)=> d3.descending((a.properties.vaxNumber/a.properties.popNum)*100, (b.properties.vaxNumber/b.properties.popNum)*100)))
										 .enter()
										 .append("rect")
										 .attr("x", (d, i) => barX(i))
										 .attr("y", (d) => barY((d.properties.vaxNumber/d.properties.popNum)*100))
										 .attr("height", d => barY(0) - barY((d.properties.vaxNumber/d.properties.popNum)*100))
										 .attr("width", barX.bandwidth())
										 .attr("class", function(d){return d.id})
										 .attr('id', (d) => d.id + 'barVacc')
										 .on("mouseover", function(d){
											 d3.selectAll("."+d.id).style("fill", "#ff0")
											 d3.selectAll('#'+d.id + 'caseNumber').style('fill', '#000')
											 document.getElementById('dataDisplay').innerHTML = d.properties.name + ": No. Fully Vaccinated: " + d.properties.vaxNumber + ", No. Cases: " + d.properties.caseNumber;
											})
										 .on("mouseout", function(d){
											 d3.selectAll("#"+d.id +'barVacc').style("fill", "#00f")
											 d3.selectAll('#'+d.id +'stateVacc').style('fill', function(d){return ramp(d.properties.popPercent)})
											 d3.selectAll("#"+d.id + 'caseNumber').style('fill', "#fff")
										});
			
	barOneDisplay.append('g').selectAll("text")
						 .data(json.features.sort((a, b) => d3.descending((a.properties.vaxNumber/a.properties.popNum)*100, (b.properties.vaxNumber/b.properties.popNum)*100)))
						 .enter()
						 .append("text")
						 .attr("x", (d, i) => barX(i))
						 .attr("y", (d) => barY((d.properties.vaxNumber/d.properties.popNum)*100) - 3)
						 .text((d) => parseInt((d.properties.vaxNumber/d.properties.popNum)*100));
		
	barOneDisplay.append("g").attr("fill", "rgba(255, 0, 0)")
						 .selectAll("rect")
						 .data(json.features.sort((a,b)=> d3.descending((a.properties.vaxNumber/a.properties.popNum)*100, (b.properties.vaxNumber/b.properties.popNum)*100)))
						 .enter()
						 .append("rect")
						 .attr("x", (d, i) => barX(i))
						 .attr("y", (d) => barY((d.properties.caseNumber/d.properties.popNum)*100))
						 .attr("height", d => barY(0) - barY((d.properties.caseNumber/d.properties.popNum)*100))
						 .attr("width", barX.bandwidth())
						 .attr("class", function(d){return d.id + 'barCase'})
						 .attr('id', (d) => d.id + 'barCase')
						 .on("mouseover", function(d){
							 d3.selectAll("."+d.id + 'barCase').style("fill", "#ff0")
							 document.getElementById('dataDisplay').innerHTML = d.properties.name + ": No. Fully Vaccinated: " + d.properties.vaxNumber + ", No. Cases: " + d.properties.caseNumber;
							})
						 .on("mouseout", function(d){d3.selectAll("."+d.id + 'barCase').style("fill", "#f00")});
		
	barOneDisplay.append('g').selectAll("text")
						  .data(json.features.sort((a, b) => d3.descending((a.properties.vaxNumber/a.properties.popNum)*100, (b.properties.vaxNumber/b.properties.popNum)*100)))
						   .enter()
						  .append("text")
						  .attr("x", (d, i) => barX(i))
						  .attr("y", (d) => barY((d.properties.caseNumber/d.properties.popNum)*100) - 3)
						 .attr('id', (d) => d.id + 'caseNumber')
						  .text((d) => parseInt((d.properties.caseNumber/d.properties.popNum)*100))
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
	});