var slider = document.getElementById('myRange');
let dateChosen = slider.value;
console.log(dateChosen);
// slider.oninput = function() {
//     document.getElementById('demo').innerHTML = this.value;
// };


var width1 = 960;
var height1 = 500;
let popArray = [];


// D3 Projection
// scale things down so see entire US
var projection = d3.geoAlbersUsa()
    .translate([width1 / 2, height1 / 2]) // translate to center of screen
    .scale([1000]);
// Define path generator
// tell path generator to use albersUsa projection
var path = d3.geoPath() // path generator that will convert GeoJSON to SVG paths
    .projection(projection);

//Create SVG element and append map to the SVG
var svgMap = d3.select("#map")
    .append("svg")
    .attr("width", width1)
    .attr("height", height1);


//Function to dynamically load the chosen data
d3.csv("./StatePopData.csv", function(data) {
    for (let d = 0; d < data.length; d++) {
        popArray.push(parseInt(data[d].Population));
    }
    var lowPopColor = 'rgb(255, 0, 0)';
    var highPopColor = 'rgb(0, 255, 255)';
    // Load GeoJSON data and merge with states data


    d3.json("./us-states.json", function(json) {
        // Loop through each state data value in the .csv file
        for (var i = 0; i < data.length; i++) {
            // Grab State Name
            var dataState = data[i].State;
            for (let j = 0; j < json.features.length; j++) {
                let jsonState = json.features[j].properties.name;
                if (dataState == jsonState) {
                    // Copy the data value into the JSON
                    json.features[j].properties.popNum = parseInt(data[i].Population);
                    json.features[j].properties.vax12Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month12) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case12Percent = Math.floor(parseInt(data[i].Total_Cases_Month12) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case12Number = parseInt(data[i].Total_Cases_Month12);
                    json.features[j].properties.vax12Number = parseInt(data[i].Fully_Vaccinated_Month12);

                    json.features[j].properties.vax11Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month11) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case11Percent = Math.floor(parseInt(data[i].Total_Cases_Month11) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case11Number = parseInt(data[i].Total_Cases_Month11);
                    json.features[j].properties.vax11Number = parseInt(data[i].Fully_Vaccinated_Month11);

                    json.features[j].properties.vax10Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month10) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case10Percent = Math.floor(parseInt(data[i].Total_Cases_Month10) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case10Number = parseInt(data[i].Total_Cases_Month10);
                    json.features[j].properties.vax10Number = parseInt(data[i].Fully_Vaccinated_Month10);

                    json.features[j].properties.vax09Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month09) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case09Percent = Math.floor(parseInt(data[i].Total_Cases_Month09) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case09Number = parseInt(data[i].Total_Cases_Month09);
                    json.features[j].properties.vax09Number = parseInt(data[i].Fully_Vaccinated_Month09);

                    json.features[j].properties.vax08Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month08) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case08Percent = Math.floor(parseInt(data[i].Total_Cases_Month08) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case08Number = parseInt(data[i].Total_Cases_Month08);
                    json.features[j].properties.vax08Number = parseInt(data[i].Fully_Vaccinated_Month08);

                    json.features[j].properties.vax07Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month07) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case07Percent = Math.floor(parseInt(data[i].Total_Cases_Month07) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case07Number = parseInt(data[i].Total_Cases_Month07);
                    json.features[j].properties.vax07Number = parseInt(data[i].Fully_Vaccinated_Month07);

                    json.features[j].properties.vax06Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month06) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case06Percent = Math.floor(parseInt(data[i].Total_Cases_Month06) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case06Number = parseInt(data[i].Total_Cases_Month06);
                    json.features[j].properties.vax06Number = parseInt(data[i].Fully_Vaccinated_Month06);

                    json.features[j].properties.vax05Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month05) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case05Percent = Math.floor(parseInt(data[i].Total_Cases_Month05) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case05Number = parseInt(data[i].Total_Cases_Month05);
                    json.features[j].properties.vax05Number = parseInt(data[i].Fully_Vaccinated_Month05);

                    json.features[j].properties.vax04Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month04) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case04Percent = Math.floor(parseInt(data[i].Total_Cases_Month04) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case04Number = parseInt(data[i].Total_Cases_Month04);
                    json.features[j].properties.vax04Number = parseInt(data[i].Fully_Vaccinated_Month04);

                    json.features[j].properties.vax03Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month03) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case03Percent = Math.floor(parseInt(data[i].Total_Cases_Month03) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case03Number = parseInt(data[i].Total_Cases_Month03);
                    json.features[j].properties.vax03Number = parseInt(data[i].Fully_Vaccinated_Month03);

                    json.features[j].properties.vax02Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month02) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case02Percent = Math.floor(parseInt(data[i].Total_Cases_Month02) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case02Number = parseInt(data[i].Total_Cases_Month02);
                    json.features[j].properties.vax02Number = parseInt(data[i].Fully_Vaccinated_Month02);

                    json.features[j].properties.vax01Percent = Math.floor(parseInt(data[i].Fully_Vaccinated_Month01) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case01Percent = Math.floor(parseInt(data[i].Total_Cases_Month01) / parseInt(data[i].Population) * 100);
                    json.features[j].properties.case01Number = parseInt(data[i].Total_Cases_Month01);
                    json.features[j].properties.vax01Number = parseInt(data[i].Fully_Vaccinated_Month01);
                    // Stop looking through the JSON
                    break;
                }
            }
        }


        var ramp = d3.scaleLinear().domain([0, 100]).range([lowPopColor, highPopColor])

        slider.oninput = function() {

            if (this.value == 1) {
                document.getElementById('weekDisplay').innerHTML = 'Week 1';
                displayData()
            } else if (this.value == 2) {
                document.getElementById('weekDisplay').innerHTML = 'Week 2'
            } else if (this.value == 3) {
                document.getElementById('weekDisplay').innerHTML = 'Week 3'
            } else if (this.value == 4) {
                document.getElementById('weekDisplay').innerHTML = 'Week 4'
            } else if (this.value == 5) {
                document.getElementById('weekDisplay').innerHTML = 'Week 5'
            } else if (this.value == 6) {
                document.getElementById('weekDisplay').innerHTML = 'Week 6'
            } else if (this.value == 7) {
                document.getElementById('weekDisplay').innerHTML = 'Week 7'
            } else if (this.value == 8) {
                document.getElementById('weekDisplay').innerHTML = 'Week 8'
            } else if (this.value == 9) {
                document.getElementById('weekDisplay').innerHTML = 'Week 9'
            } else if (this.value == 10) {
                document.getElementById('weekDisplay').innerHTML = 'Week 10'
            } else if (this.value == 11) {
                document.getElementById('weekDisplay').innerHTML = 'Week 11'
            } else if (this.value == 12) {
                document.getElementById('weekDisplay').innerHTML = 'Week 12'
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
            .style("fill", function(d) { return ramp(d.properties.vax09Percent) })
            .on("mouseover", function(d) {
                d3.selectAll("." + d.id).style("fill", "#ff0")
                d3.selectAll('#' + d.id + 'caseNumber').style('fill', '#000')
                document.getElementById('dataDisplay').innerHTML = d.properties.name + ": Number of Fully Vaccinated: " + d.properties.vax09Number + ", No. Cases: " + d.properties.case09Number;
            })
            .on("mouseout", function(d) {
                d3.selectAll("#" + d.id + 'stateVacc').style("fill", function(d) { return ramp(d.properties.vax09Percent) })
                d3.selectAll('#' + d.id + 'barVacc').style('fill', '#00f')
                d3.selectAll('#' + d.id + 'caseNumber').style('fill', '#fff')
            });
        svgMap.append("g").attr("class", "stateId").selectAll("text").data(json.features).enter().append("svg:text").text(function(d) { return d.id })
            .attr("x", function(d) {
                return path.centroid(d)[0];
            })
            .attr("y", function(d) {
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
            .style("stop-opacity", .5);

        key.append("rect")
            .attr("width", 40)
            .attr("height", 112)
            .style("fill", "url(#gradient)")
            .attr("transform", "translate(0,75)");

        var y = d3.scaleLinear().range([120, 10]).domain([0, 100]);
        var yAxis = d3.axisRight(y).ticks(5);

        key.append("g").attr("class", "y axis").attr("transform", "translate(41,65)").call(yAxis);

        // console.log(json.features.sort((a, b) => b.properties.vax12Percent - a.properties.vax12Percent));


        const barDisplayWidth = 1000;
        const barDisplayHeight = 1000;
        const barMargin = { top: 20, left: 30, right: 30, bottom: 30 };

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
            .data(json.features.sort((a, b) => d3.descending(a.properties.vax09Percent, b.properties.vax09Percent)))
            .enter()
            .append("rect")
            .attr("x", (d, i) => barX(i))
            .attr("y", (d) => barY(d.properties.vax09Percent))
            .attr("height", (d) => barY(0) - barY(d.properties.vax09Percent))
            .attr("width", barX.bandwidth())
            .attr("class", function(d) { return d.id })
            .attr('id', (d) => d.id + 'barVacc')
            .on("mouseover", function(d) {
                d3.selectAll("." + d.id).style("fill", "#ff0")
                d3.selectAll('#' + d.id + 'caseNumber').style('fill', '#000')
                document.getElementById('dataDisplay').innerHTML = d.properties.name + ": No. Fully Vaccinated: " + d.properties.vax09Number + ", No. Cases: " + d.properties.case09Number;
                d3.selectAll("#" + d.id + 'caseNumber').style('fill', "#000")
            })
            .on("mouseout", function(d) {
                d3.selectAll("#" + d.id + 'barVacc').style("fill", "#00f")
                d3.selectAll('#' + d.id + 'stateVacc').style('fill', function(d) { return ramp(d.properties.vax09Percent) })
                d3.selectAll("#" + d.id + 'caseNumber').style('fill', "#fff")
            });

        barOneDisplay.append('g').selectAll("text")
            .data(json.features.sort((a, b) => d3.descending((a.properties.vax09Percent, b.properties.vax09Percent))))
            .enter()
            .append("text")
            .attr("x", (d, i) => barX(i))
            .attr("y", (d) => (barY(d.properties.vax09Percent) - 3))
            .text((d) => parseInt((d.properties.vax09Percent)));

        barOneDisplay.append("g").attr("fill", "rgba(255, 0, 0)")
            .selectAll("rect")
            .data(json.features.sort((a, b) => d3.descending(a.properties.vax09Percent, b.properties.vax09Percent)))
            .enter()
            .append("rect")
            .attr("x", (d, i) => barX(i))
            .attr("y", (d) => barY((d.properties.case09Percent)))
            .attr("height", d => barY(0) - barY((d.properties.case09Percent)))
            .attr("width", barX.bandwidth())
            .attr("class", function(d) { return d.id + 'barCase' })
            .attr('id', (d) => d.id + 'barCase')
            .on("mouseover", function(d) {
                d3.selectAll("#" + d.id + 'stateVacc').style('fill', '#ff0')
                d3.selectAll("." + d.id + 'barCase').style("fill", "#ff0")
                document.getElementById('dataDisplay').innerHTML = d.properties.name + ": No. Fully Vaccinated: " + d.properties.vax09Number + ", No. Cases: " + d.properties.case09Number;
            })
            .on("mouseout", function(d) {
                d3.selectAll("." + d.id + 'barCase').style("fill", "#f00")
                d3.selectAll('#' + d.id + 'stateVacc').style('fill', function(d) { return ramp(d.properties.vax09Percent) })
                d3.selectAll("." + d.id + 'barVacc').style('fill', '#00f')
            });

        barOneDisplay.append('g').selectAll("text")
            .data(json.features.sort((a, b) => d3.descending((a.properties.vax09Percent, b.properties.vax09Percent))))
            .enter()
            .append("text")
            .attr("x", (d, i) => barX(i))
            .attr("y", (d) => barY(d.properties.case09Percent) - 3)
            .attr('id', (d) => d.id + 'caseNumber')
            .text((d) => parseInt((d.properties.case09Percent)))
            .style('fill', '#fff');

        barOneDisplay.append("g").attr("transform", `translate(0, ${barDisplayHeight - barMargin.bottom + 10})`)
            .call(d3.axisBottom(barX).tickFormat(i => json.features[i].properties.name))
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