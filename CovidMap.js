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
	var dataValue = Math.floor((parseInt(data[i].Fully_Vaccinated_Month12)/parseInt(data[i].Population))*100);
	var caseData = parseInt(data[i].Total_Cases_Month12);
	var vaxData = parseInt(data[i].Fully_Vaccinated_Month12);

	// Find the corresponding state inside the GeoJSON
	for (let j = 0; j < json.features.length; j++)  {
		let jsonState = json.features[j].properties.name;

		if (dataState == jsonState) {

		// Copy the data value into the JSON
		json.features[j].properties.popPercent = dataValue;
		json.features[j].properties.caseNumber = caseData;
		json.features[j].properties.vaxNumber = vaxData;

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
		document.getElementById('dataDisplay').innerHTML = d.properties.name + ": % of Population Vaccinated: " + d.properties.popPercent + "%, No. Cases: " + d.properties.caseNumber;
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

	key.append("g").attr("class", "y axis").attr("transform", "translate(41,65)").call(yAxis)
	});
    
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
    const barY = d3.scaleLinear().domain([0, 100])
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
                                 .attr("class", function(d){return d.ID})
								 .attr('id', (d) => d.ID + 'barVacc')
								 .on("mouseover", function(d){
									 d3.selectAll("."+d.ID).style("fill", "#ff0")
									 d3.selectAll('#'+d.ID + 'caseNumber').style('fill', '#000')
									 document.getElementById('dataDisplay').innerHTML = d.State + ": No. Fully Vaccinated: " + d.Fully_Vaccinated_Month12 + ", No. Cases: " + d.Total_Cases_Month12;
									})
								 .on("mouseout", function(d){
									 d3.selectAll("#"+d.ID +'barVacc').style("fill", "#00f")
									 d3.selectAll('#'+d.ID +'stateVacc').style('fill', function(d){return ramp(d.properties.popPercent)})
									 d3.selectAll("#"+d.ID + 'caseNumber').style('fill', "#fff")
								});
	
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
				 .on("mouseover", function(d){
					 d3.selectAll("."+d.ID + 'barCase').style("fill", "#ff0")
					 document.getElementById('dataDisplay').innerHTML = d.State + ": No. Fully Vaccinated: " + d.Fully_Vaccinated_Month12 + ", No. Cases: " + d.Total_Cases_Month12;
					})
				 .on("mouseout", function(d){d3.selectAll("."+d.ID + 'barCase').style("fill", "#f00")});

	barOneDisplay.append('g').selectAll("text")
 				 .data(data.sort((a, b) => d3.descending((a.Full_Vaccinated_Month12/a.Population)*100, (b.Fully_Vaccinated_Month12/b.Population)*100)))
      			 .enter()
 				 .append("text")
 				 .attr("x", (d, i) => barX(i))
 				 .attr("y", (d) => barY((d.Total_Cases_Month12/d.Population)*100) - 3)
				 .attr('id', (d) => d.ID + 'caseNumber')
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

// Use the settings object to change the theme



// const lineMargin = {top: 25,
// 					right: 45,
// 					bottom: 50,
// 					left: 25
// 				};
// let line_width = 956;
// let line_height = 415;

// let lineDisplay = d3.select('#info').append('svg').attr('height', line_height).attr('width', line_width);

// lineDisplay.append('g').attr('transform', 'translate(' + lineMargin.left + ', ' + lineMargin.top + ')');

// let dataArray = [];

// d3.csv("./COVIDTEST.csv", function(data) {

// 	for(let i = 0; i < data.length; i++){
// 		data[i].Date = d3.timeParse("%m/%d/%Y")(data[i].Date),
//         data[i].Vaccines = parseInt(data[i].Vaccines),
//         data[i].Cases = parseInt(data[i].Cases),
//         data[i].State = data[i].State
// 	}
// 	lineDisplay.append("text")
//                 .attr("y", lineMargin.top - 10)
//                 .attr("x", (line_width / 3))
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text("Avg Number of  ");
// 	lineDisplay.append("text")
//                 .attr("y", lineMargin.top - 10)
//                 .attr("x", (line_width / 3) + 70)
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text(" Cases ")
//                 .style("fill", 'red');
//     lineDisplay.append("text")
//                 .attr("y", lineMargin.top - 10)
//                 .attr("x", (line_width / 3) + 100)
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text(" vs. ");
//     lineDisplay.append("text")
//                 .attr("y", lineMargin.top - 10)
//                 .attr("x", (line_width / 2) + 25)
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text("Vaccines Administered")
//                 .style("fill", 'blue');

// 	lineDisplay.append("text")
//                 .attr("y", lineMargin.top - 50)
//                 .attr("x", (line_width / 3))
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text("United States, D.C. and Puerto Rico");

// 	let dataArr = data.sort((a, b) => b.Date - a.Date).reverse();
// 	console.log(dataArr);


	
	
	
	
// });



// const margin = { top: 30, right: 20, bottom: 20, left: 30 };
// var width = 960 - margin.left - margin.right;
// var height = 600 - margin.top - margin.bottom;

// function plotLineChart() {

//     let display = d3.select("#info").append("svg")
//         .attr("width", width + margin.left * 2 + margin.right * 2)
//         .attr("height", height + margin.top * 2 + margin.bottom * 2)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     // let AKDisplay = d3.select("body").append("svg")
//     //                      .attr("width", width + margin.left * 2 + margin.right * 2)
//     //                      .attr("height", height + margin.top * 2 + margin.bottom * 2)
//     //                      .append("g")
//     //                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//     // let CADisplay = d3.select("body").append("svg")
//     //                      .attr("width", width + margin.left * 2 + margin.right * 2)
//     //                      .attr("height", height + margin.top * 2 + margin.bottom * 2)
//     //                      .append("g")
//     //                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//     // let TXDisplay = d3.select("body").append("svg")
//     //                      .attr("width", width + margin.left * 2 + margin.right * 2)
//     //                      .attr("height", height + margin.top * 2 + margin.bottom * 2)
//     //                      .append("g")
//     //                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     // let HIDisplay = d3.select("body").append("svg")
//     //                      .attr("width", width + margin.left * 2 + margin.right * 2)
//     //                      .attr("height", height + margin.top * 2 + margin.bottom * 2)
//     //                      .append("g")
//     //                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//     d3.csv("./COVIDTEST.csv", function(d) {
//             return {
//                 Date: d3.timeParse("%m/%d/%Y")(d.Date),
//                 Vaccines: +d.Vaccines,
//                 Cases: +d.Cases,
//                 State: d.State,
//             }
//         },
//         function(data) {
//             let AKcaseArray = [];
//             let AKvaccineArray = [];
//             let timeArray = [];
//             let ALcaseArray = [];
//             let ALvaccineArray = [];
//             let ARvaccineArray = [];
//             let ARcaseArray = [];
//             let CAcaseArray = [];
//             let CAvaccineArray = [];
//             let COvaccineArray = [];
//             let COcaseArray = [];
//             let CTcaseArray = [];
//             let CTvaccineArray = [];
//             let DCcaseArray = [];
//             let DCvaccineArray = [];
//             let DEcaseArray = [];
//             let DEvaccineArray = [];
//             let FLcaseArray = [];
//             let FLvaccineArray = [];
//             let GAcaseArray = [];
//             let GAvaccineArray = [];
//             let HIcaseArray = [];
//             let HIvaccineArray = [];
//             let IAcaseArray = [];
//             let IAvaccineArray = [];
//             let IDcaseArray = [];
//             let IDvaccineArray = [];
//             let ILcaseArray = [];
//             let ILvaccineArray = [];
//             let INcaseArray = [];
//             let INvaccineArray = [];
//             let KScaseArray = [];
//             let KSvaccineArray = [];
//             let KYcaseArray = [];
//             let KYvaccineArray = [];
//             let LAcaseArray = [];
//             let LAvaccineArray = [];
//             let MAcaseArray = [];
//             let MAvaccineArray = [];
//             let MEcaseArray = [];
//             let MEvaccineArray = [];
//             let MDcaseArray = [];
//             let MDvaccineArray = [];
//             let MNcaseArray = [];
//             let MNvaccineArray = [];
//             let MIcaseArray = [];
//             let MIvaccineArray = [];
//             let MOcaseArray = [];
//             let MOvaccineArray = [];
//             let MScaseArray = [];
//             let MSvaccineArray = [];
//             let MTcaseArray = [];
//             let MTvaccineArray = [];
//             let NCcaseArray = [];
//             let NCvaccineArray = [];
//             let NDcaseArray = [];
//             let NDvaccineArray = [];
//             let NEcaseArray = [];
//             let NEvaccineArray = [];
//             let NHcaseArray = [];
//             let NHvaccineArray = [];
//             let NJcaseArray = [];
//             let NJvaccineArray = [];
//             let NMcaseArray = [];
//             let NMvaccineArray = [];
//             let NVcaseArray = [];
//             let NVvaccineArray = [];
//             let NYcaseArray = [];
//             let NYvaccineArray = [];
//             let OHcaseArray = [];
//             let OHvaccineArray = [];
//             let OKcaseArray = [];
//             let OKvaccineArray = [];
//             let ORcaseArray = [];
//             let ORvaccineArray = [];
//             let PAcaseArray = [];
//             let PAvaccineArray = [];
//             let PRcaseArray = [];
//             let PRvaccineArray = [];
//             let RIcaseArray = [];
//             let RIvaccineArray = [];
//             let SCcaseArray = [];
//             let SCvaccineArray = [];
//             let SDcaseArray = [];
//             let SDvaccineArray = [];
//             let TNcaseArray = [];
//             let TNvaccineArray = [];
//             let TXcaseArray = [];
//             let TXvaccineArray = [];
//             let UTcaseArray = [];
//             let UTvaccineArray = [];
//             let VAcaseArray = [];
//             let VAvaccineArray = [];
//             let VTcaseArray = [];
//             let VTvaccineArray = [];
//             let WAcaseArray = [];
//             let WAvaccineArray = [];
//             let WIcaseArray = [];
//             let WIvaccineArray = [];
//             let WVcaseArray = [];
//             let WVvaccineArray = [];
//             let WYcaseArray = [];
//             let WYvaccineArray = [];

//             let dataArr = data.sort((a, b) => b.Date - a.Date).reverse();

//             let stateArr = [];

//             for (let i = 0; i <= dataArr.length + 1; i++) {
//                 if (dataArr[i].State != dataArr[i + 1].State) {
//                     stateArr.push(dataArr[i].State)
//                     if (i == 51) {
//                         break;
//                     }
//                 }
//             }
//             stateArr = stateArr.sort();

//             for (let i = 0; i < dataArr.length; i++) {
//                 if (dataArr[i].State == 'AK') {
//                     AKcaseArray.push(dataArr[i].Cases);
//                     AKvaccineArray.push(dataArr[i].Vaccines);
//                     timeArray.push(dataArr[i].Date);
//                 } else if (dataArr[i].State == 'AL') {
//                     ALcaseArray.push(dataArr[i].Cases);
//                     ALvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'AR') {
//                     ARvaccineArray.push(dataArr[i].Vaccines);
//                     ARcaseArray.push(dataArr[i].Cases);
//                 } else if (dataArr[i].State == 'CA') {
//                     CAcaseArray.push(dataArr[i].Cases);
//                     CAvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'CO') {
//                     COcaseArray.push(dataArr[i].Cases);
//                     COvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'CT') {
//                     CTvaccineArray.push(dataArr[i].Vaccines);
//                     CTcaseArray.push(dataArr[i].Cases);
//                 } else if (dataArr[i].State == 'DC') {
//                     DCvaccineArray.push(dataArr[i].Vaccines);
//                     DCcaseArray.push(dataArr[i].Cases);
//                 } else if (dataArr[i].State == 'DE') {
//                     DEcaseArray.push(dataArr[i].Cases);
//                     DEvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'FL') {
//                     FLcaseArray.push(dataArr[i].Cases);
//                     FLvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'GA') {
//                     GAcaseArray.push(dataArr[i].Cases);
//                     GAvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'HI') {
//                     HIcaseArray.push(dataArr[i].Cases);
//                     HIvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'IA') {
//                     IAcaseArray.push(dataArr[i].Cases);
//                     IAvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'ID') {
//                     IDcaseArray.push(dataArr[i].Cases);
//                     IDvaccineArray.push(dataArr[i].Vaccines);
//                 } else if (dataArr[i].State == 'IL') {
//                     ILcaseArray.push(dataArr[i].Cases);
//                     ILvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'IN') {
//                     INcaseArray.push(dataArr[i].Cases);
//                     INvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'KS') {
//                     KScaseArray.push(dataArr[i].Cases);
//                     KSvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'KY') {
//                     KYcaseArray.push(dataArr[i].Cases);
//                     KYvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'LA') {
//                     LAcaseArray.push(dataArr[i].Cases);
//                     LAvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'MA') {
//                     MAcaseArray.push(dataArr[i].Cases);
//                     MAvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'MD') {
//                     MDcaseArray.push(dataArr[i].Cases);
//                     MDvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'ME') {
//                     MEcaseArray.push(dataArr[i].Cases);
//                     MEvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'MI') {
//                     MIcaseArray.push(dataArr[i].Cases);
//                     MIvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'MN') {
//                     MNcaseArray.push(dataArr[i].Cases);
//                     MNvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'MO') {
//                     MOcaseArray.push(dataArr[i].Cases);
//                     MOvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'MS') {
//                     MScaseArray.push(dataArr[i].Cases);
//                     MSvaccineArray.push(dataArr[i])
//                 } else if (dataArr[i].State == 'MT') {
//                     MTcaseArray.push(dataArr[i].Cases);
//                     MTvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'NC') {
//                     NCcaseArray.push(dataArr[i].Cases);
//                     NCvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'ND') {
//                     NDcaseArray.push(dataArr[i].Cases);
//                     NDvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'NE') {
//                     NEcaseArray.push(dataArr[i].Cases);
//                     NEvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'NH') {
//                     NHcaseArray.push(dataArr[i].Cases);
//                     NHvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'NJ') {
//                     NJcaseArray.push(dataArr[i].Cases);
//                     NJvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'NM') {
//                     NMcaseArray.push(dataArr[i].Cases);
//                     NMvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'NV') {
//                     NVcaseArray.push(dataArr[i].Cases);
//                     NVvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'NY') {
//                     NYcaseArray.push(dataArr[i].Cases);
//                     NYvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'OH') {
//                     OHcaseArray.push(dataArr[i].Cases);
//                     OHvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'OK') {
//                     OKcaseArray.push(dataArr[i].Cases);
//                     OKvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'OR') {
//                     ORcaseArray.push(dataArr[i].Cases);
//                     ORvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'PA') {
//                     PAcaseArray.push(dataArr[i].Cases);
//                     PAvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'PR') {
//                     PRcaseArray.push(dataArr[i].Cases);
//                     PRvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'RI') {
//                     RIcaseArray.push(dataArr[i].Cases);
//                     RIvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'SC') {
//                     SCcaseArray.push(dataArr[i].Cases);
//                     SCvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'SD') {
//                     SDcaseArray.push(dataArr[i].Cases);
//                     SDvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'TN') {
//                     TNcaseArray.push(dataArr[i].Cases);
//                     TNvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'TX') {
//                     TXcaseArray.push(dataArr[i].Cases);
//                     TXvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'UT') {
//                     UTcaseArray.push(dataArr[i].Cases);
//                     UTvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'VA') {
//                     VAcaseArray.push(dataArr[i].Cases);
//                     VAvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'VT') {
//                     VTcaseArray.push(dataArr[i].Cases);
//                     VTvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'WA') {
//                     WAcaseArray.push(dataArr[i].Cases);
//                     WAvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'WI') {
//                     WIcaseArray.push(dataArr[i].Cases);
//                     WIvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'WV') {
//                     WVcaseArray.push(dataArr[i].Cases);
//                     WVvaccineArray.push(dataArr[i].Vaccines)
//                 } else if (dataArr[i].State == 'WY') {
//                     WYcaseArray.push(dataArr[i].Cases);
//                     WYvaccineArray.push(dataArr[i].Vaccines)
//                 }
//             }

//             let dateArray = timeArray.sort((a, b) => b - a);
//             dateArray = dateArray.reverse();

//             let avgWeeklyCaseArray = [];
//             let avgWeeklyVaccineArray = [];

//             for(let i = 0; i < WYvaccineArray.length; i++){
//                 avgWeeklyCaseArray.push(
//                     ((ALcaseArray[i] +
//                     AKcaseArray[i] + 
//                     ARcaseArray[i] +
//                     CAcaseArray[i] +
//                     COcaseArray[i] +
//                     DCcaseArray[i] +
//                     DEcaseArray[i] +
//                     FLcaseArray[i] + 
//                     GAcaseArray[i] +
//                     HIcaseArray[i] +
//                     IAcaseArray[i] +
//                     ILcaseArray[i] +
//                     IDcaseArray[i] +
//                     INcaseArray[i] +
//                     KScaseArray[i] +
//                     KYcaseArray[i] +
//                     LAcaseArray[i] +
//                     MAcaseArray[i] +
//                     MDcaseArray[i] +
//                     MEcaseArray[i] +
//                     MIcaseArray[i] +
//                     MNcaseArray[i] +
//                     MOcaseArray[i] +
//                     NCcaseArray[i] +
//                     NDcaseArray[i] +
//                     NEcaseArray[i] +
//                     NHcaseArray[i] +
//                     NJcaseArray[i] +
//                     NMcaseArray[i] +
//                     NVcaseArray[i] +
//                     NYcaseArray[i] +
//                     OHcaseArray[i] +
//                     OKcaseArray[i] +
//                     ORcaseArray[i] +
//                     PAcaseArray[i] +
//                     PRcaseArray[i] +
//                     RIcaseArray[i] +
//                     SCcaseArray[i] +
//                     SDcaseArray[i] +
//                     TNcaseArray[i] +
//                     TXcaseArray[i] +
//                     UTcaseArray[i] +
//                     VAcaseArray[i] +
//                     VTcaseArray[i] +
//                     WAcaseArray[i] +
//                     WIcaseArray[i] +
//                     WVcaseArray[i] +
//                     WYcaseArray[i])/stateArr.length)
//                 ) 
//             }
//             for(let i = 0; i < WYvaccineArray.length; i++){
//                 avgWeeklyVaccineArray.push(
//                     (ALvaccineArray[i] +
//                     AKvaccineArray[i] + 
//                     ARvaccineArray[i] +
//                     CAvaccineArray[i] +
//                     COvaccineArray[i] +
//                     DCvaccineArray[i] +
//                     DEvaccineArray[i] +
//                     FLvaccineArray[i] + 
//                     GAvaccineArray[i] +
//                     HIvaccineArray[i] +
//                     IAvaccineArray[i] +
//                     ILvaccineArray[i] +
//                     IDvaccineArray[i] +
//                     INvaccineArray[i] +
//                     KSvaccineArray[i] +
//                     KYvaccineArray[i] +
//                     LAvaccineArray[i] +
//                     MAvaccineArray[i] +
//                     MDvaccineArray[i] +
//                     MEvaccineArray[i] +
//                     MIvaccineArray[i] +
//                     MNvaccineArray[i] +
//                     MOvaccineArray[i] +
//                     NCvaccineArray[i] +
//                     NDvaccineArray[i] +
//                     NEvaccineArray[i] +
//                     NHvaccineArray[i] +
//                     NJvaccineArray[i] +
//                     NMvaccineArray[i] +
//                     NVvaccineArray[i] +
//                     NYvaccineArray[i] +
//                     OHvaccineArray[i] +
//                     OKvaccineArray[i] +
//                     ORvaccineArray[i] +
//                     PAvaccineArray[i] +
//                     PRvaccineArray[i] +
//                     RIvaccineArray[i] +
//                     SCvaccineArray[i] +
//                     SDvaccineArray[i] +
//                     TNvaccineArray[i] +
//                     TXvaccineArray[i] +
//                     UTvaccineArray[i] +
//                     VAvaccineArray[i] +
//                     VTvaccineArray[i] +
//                     WAvaccineArray[i] +
//                     WIvaccineArray[i] +
//                     WVvaccineArray[i] +
//                     WYvaccineArray[i])/stateArr.length
//                 ) 
                   
//             }
//             let max_case = d3.max(avgWeeklyCaseArray);

//             let max_vaccine = d3.max(avgWeeklyVaccineArray);

//             let scaleMax = 0;

//             if (max_vaccine > max_case) {
//                 scaleMax = max_vaccine;
//             } else {
//                 scaleMax = max_case;
//             };
            
//             let vaccineData = [];
//             let caseData = [];
//             for(let j = 0; j < avgWeeklyCaseArray.length; j++){
//                 vaccineData.push([dateArray[j], avgWeeklyVaccineArray[j] ]);
//                 caseData.push([dateArray[j], avgWeeklyCaseArray[j]]);
//             }
			    
//             let AKcaseData = [];
//             let AKvaccineData = [];
//             let ALcaseData = [];
//             let ALvaccineData = [];
//             let ARvaccineData = [];
//             let ARcaseData = [];
//             let CAcaseData = [];
//             let CAvaccineData = [];
//             let COvaccineData = [];
//             let COcaseData = [];
//             let CTcaseData = [];
//             let CTvaccineData = [];
//             let DCcaseData = [];
//             let DCvaccineData = [];
//             let DEcaseData = [];
//             let DEvaccineData = [];
//             let FLcaseData = [];
//             let FLvaccineData = [];
//             let GAcaseData = [];
//             let GAvaccineData = [];
//             let HIcaseData = [];
//             let HIvaccineData = [];
//             let IAcaseData = [];
//             let IAvaccineData = [];
//             let IDcaseData = [];
//             let IDvaccineData = [];
//             let ILcaseData = [];
//             let ILvaccineData = [];
//             let INcaseData = [];
//             let INvaccineData = [];
//             let KScaseData = [];
//             let KSvaccineData = [];
//             let KYcaseData = [];
//             let KYvaccineData = [];
//             let LAcaseData = [];
//             let LAvaccineData = [];
//             let MAcaseData = [];
//             let MAvaccineData = [];
//             let MEcaseData = [];
//             let MEvaccineData = [];
//             let MDcaseData = [];
//             let MDvaccineData = [];
//             let MNcaseData = [];
//             let MNvaccineData = [];
//             let MIcaseData = [];
//             let MIvaccineData = [];
//             let MOcaseData = [];
//             let MOvaccineData = [];
//             let MScaseData = [];
//             let MSvaccineData = [];
//             let MTcaseData = [];
//             let MTvaccineData = [];
//             let NCcaseData = [];
//             let NCvaccineData = [];
//             let NDcaseData = [];
//             let NDvaccineData = [];
//             let NEcaseData = [];
//             let NEvaccineData = [];
//             let NHcaseData = [];
//             let NHvaccineData = [];
//             let NJcaseData = [];
//             let NJvaccineData = [];
//             let NMcaseData = [];
//             let NMvaccineData = [];
//             let NVcaseData = [];
//             let NVvaccineData = [];
//             let NYcaseData = [];
//             let NYvaccineData = [];
//             let OHcaseData = [];
//             let OHvaccineData = [];
//             let OKcaseData = [];
//             let OKvaccineData = [];
//             let ORcaseData = [];
//             let ORvaccineData = [];
//             let PAcaseData = [];
//             let PAvaccineData = [];
//             let PRcaseData = [];
//             let PRvaccineData = [];
//             let RIcaseData = [];
//             let RIvaccineData = [];
//             let SCcaseData = [];
//             let SCvaccineData = [];
//             let SDcaseData = [];
//             let SDvaccineData = [];
//             let TNcaseData = [];
//             let TNvaccineData = [];
//             let TXcaseData = [];
//             let TXvaccineData = [];
//             let UTcaseData = [];
//             let UTvaccineData = [];
//             let VAcaseData = [];
//             let VAvaccineData = [];
//             let VTcaseData = [];
//             let VTvaccineData = [];
//             let WAcaseData = [];
//             let WAvaccineData = [];
//             let WIcaseData = [];
//             let WIvaccineData = [];
//             let WVcaseData = [];
//             let WVvaccineData = [];
//             let WYcaseData = [];
//             let WYvaccineData = [];


//             //Fills two dimensional arrays with the case, vaccine, and time data for inidividual state
//             for(let i = 0; i < dataArr.length; i++){
//                 if (dataArr[i].State == 'AK') {
//                     AKcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     AKvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'AL') {
//                     ALcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     ALvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'AR') {
//                     ARvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                     ARcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                 } else if (dataArr[i].State == 'CA') {
//                     CAcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     CAvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'CO') {
//                     COcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     COvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'CT') {
//                     CTvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                     CTcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                 } else if (dataArr[i].State == 'DC') {
//                     DCvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                     DCcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                 } else if (dataArr[i].State == 'DE') {
//                     DEcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     DEvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'FL') {
//                     FLcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     FLvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'GA') {
//                     GAcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     GAvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'HI') {
//                     HIcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     HIvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'IA') {
//                     IAcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     IAvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'ID') {
//                     IDcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     IDvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines]);
//                 } else if (dataArr[i].State == 'IL') {
//                     ILcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     ILvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'IN') {
//                     INcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     INvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'KS') {
//                     KScaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     KSvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'KY') {
//                     KYcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     KYvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'LA') {
//                     LAcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     LAvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'MA') {
//                     MAcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     MAvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'MD') {
//                     MDcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     MDvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'ME') {
//                     MEcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     MEvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'MI') {
//                     MIcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     MIvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'MN') {
//                     MNcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     MNvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'MO') {
//                     MOcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     MOvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'MS') {
//                     MScaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     MSvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'MT') {
//                     MTcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     MTvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'NC') {
//                     NCcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     NCvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'ND') {
//                     NDcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     NDvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'NE') {
//                     NEcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     NEvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'NH') {
//                     NHcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     NHvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'NJ') {
//                     NJcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     NJvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'NM') {
//                     NMcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     NMvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'NV') {
//                     NVcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     NVvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'NY') {
//                     NYcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     NYvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'OH') {
//                     OHcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     OHvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'OK') {
//                     OKcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     OKvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'OR') {
//                     ORcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     ORvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'PA') {
//                     PAcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     PAvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'PR') {
//                     PRcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     PRvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'RI') {
//                     RIcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     RIvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'SC') {
//                     SCcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     SCvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'SD') {
//                     SDcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     SDvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'TN') {
//                     TNcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     TNvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'TX') {
//                     TXcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     TXvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'UT') {
//                     UTcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     UTvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'VA') {
//                     VAcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     VAvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'VT') {
//                     VTcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     VTvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'WA') {
//                     WAcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     WAvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'WI') {
//                     WIcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     WIvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'WV') {
//                     WVcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     WVvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 } else if (dataArr[i].State == 'WY') {
//                     WYcaseData.push([dataArr[i].Date, dataArr[i].Cases]);
//                     WYvaccineData.push([dataArr[i].Date, dataArr[i].Vaccines])
//                 }
//             }

//             var xScale = d3.scaleTime().range([0, width]).domain(d3.extent(data, function(d) { return d.Date }));

//             display.append("g").attr("transform", "translate(" + margin.left*2 + "," + height + ")").call(d3.axisBottom(xScale));

//             var yScale = d3.scaleLinear().range([height, 0]).domain([0, scaleMax + margin.top]);

//             display.append("g").attr("transform", "translate(" + margin.left*2 + ",0)").call(d3.axisLeft(yScale));


//             display.append("path")
//                 .datum(vaccineData)
//                 .attr("fill", "none")
//                 .attr("stroke", "blue")
//                 .attr("transform", "translate(" + margin.left*2 + ", 0)")
//                 .attr("stroke-width", 1.5)
//                 .attr("d", d3.line()
//                     .x(function(d) { return xScale(d[0]) })
//                     .y(function(d) { return yScale(d[1]) })
//                 )
//             display.append("path")
//                 .datum(caseData)
//                 .attr("fill", "none")
//                 .attr("stroke", "red")
//                 .attr("transform", "translate(" + margin.left*2 + ", 0)")
//                 .attr("stroke-width", 1.5)
//                 .attr("d", d3.line()
//                     .x(function(d) { return xScale(d[0]) })
//                     .y(function(d) { return yScale(d[1]) })
//                 );
//             display.append("text").attr("transform", "rotate(-90)")
//                 .attr("y", 0 - margin.left)
//                 .attr("x", 0 - (height / 2))
//                 .attr("dy", "1em")
//                 .style("text-anchor", "middle")
//                 .text("Value");

//             display.append("text")
//                 .attr("y", height + margin.bottom)
//                 .attr("x", (width / 2))
//                 .attr("dy", "1em")
//                 .style("text-anchor", "middle")
//                 .text("Date");

//             display.append("text")
//                 .attr("y", margin.top - 10)
//                 .attr("x", (width / 3))
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text("Avg Number of  ");
//             display.append("text")
//                 .attr("y", margin.top - 10)
//                 .attr("x", (width / 3) + 70)
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text(" Cases ")
//                 .style("fill", 'red');
//             display.append("text")
//                 .attr("y", margin.top - 10)
//                 .attr("x", (width / 3) + 100)
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text(" vs. ");
//             display.append("text")
//                 .attr("y", margin.top - 10)
//                 .attr("x", (width / 2) + 25)
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text("Vaccines Administered")
//                 .style("fill", 'blue');

//             display.append("text")
//                 .attr("y", margin.top - 50)
//                 .attr("x", (width / 3))
//                 .attr("dy", "1em")
//                 .attr("text-anchor", "middle")
//                 .text("United States, D.C. and Puerto Rico");
// 		}
// 	)};
// plotLineChart();

