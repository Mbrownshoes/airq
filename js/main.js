var trace = "aqhi"

trace = ['AQHI', 'PM2.5', 'PM10', 'O3', 'NO2', 'SO2', 'All Stations'];

trace.forEach(function (d) {
  d3.select('.char-select')
    .append('button')
    .attr('id', d)
    .attr('class', 'btn btn-default btn-s')
    .text(d);
});


var test
var width = 660,
    height = 800,
    active = d3.select(null);
var dataMonth;

var formatNumber = d3.format(",.0f");

var projection = d3.geoAlbers()
    .rotate([126, 0])
    .center([9, 55.5])
    .parallels([50, 58.5])
    .scale(3200)
    .translate([960 / 2, 600 / 2]);


var path = d3.geoPath()
    .projection(projection);

// var initialTransform = d3.zoomIdentity
//     .translate(0, 0)
//     .scale(1);


// var zoom = d3.zoom()
//     // .scaleExtent([1, 8])
//     .on("zoom", zoomed);

var svg = d3.select(".map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", stopped, true);

var radius = d3.scaleSqrt()
    .domain([0, 1e6])
    .range([0, 4]);

var tooltip = d3.select(".map")
    .append("div")
    .attr("class", "tooltip");


svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50
};

var g = svg.append("g")

// svg
//     .call(zoom)
//     .call(zoom.transform, initialTransform);

d3.select("#distid").style("visibility", "hidden")
d3.select("#chart_container").style("visibility", "hidden")


queue()
    .defer(d3.json, "bc_no_proj.json")
    .defer(d3.json, "ocean.json")
    // .defer(d3.json, "pacific.json")
    .await(ready);


function ready(error, bc_no_proj, ocean) {
    "use strict";
    if (error) {
        return console.error(error);
    }

// d3.json("bc_no_proj.json", function(error, BC) {
//     if (error) return console.error(error);

    g.append("g")
        .attr("id", "provinces")
        .selectAll("path")
        .data(topojson.feature(bc_no_proj, bc_no_proj.objects.airzones).features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("id", "prov-borders")
        // .on("click", clicked);

    var today = new Date();

    var date = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)) + '-' + (today.getDate() - 1);
    var time = "12:00";
    var dateTime = date + '%20' + time;
    // console.log(dateTime)

    // Get data- for a particular trace

    // 90 day live data_loc="https://csv-parser.api.gov.bc.ca/?source=ftp://ftp.env.gov.bc.ca/pub/outgoing/AIR/Hourly_Raw_Air_Data/Air_Quality/aqhi.csv&format=json"
    var curr_stations = []
    var stn = []

    var tooltip = d3.select(".map")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "#222")
        .style("padding", "8px")
        .style("background-color", "#fff")
        .style("border-radius", "6px")
        .style("font", "12 px sans-serif")
        .text("tooltip");

    var parseTime = d3.timeParse("%Y-%m-%d %H:%M");
    var formatTime = d3.timeFormat("%Y-%m-%d");


var ocean = g.selectAll("path2") // only using to mask tiles that spill over boarder. Could clip tiles instead...
        .data(topojson.feature(ocean, ocean.objects.ocean).features)
        .enter().append("path")
        .attr("id", "ocean");

        ocean.attr("d", path)
            .style("fill", "white");


    // g.append("g")
    //     .attr("id", "ocean")
    //     .selectAll("path")
    //     .data(topojson.feature(oceanTopo, oceanTopo.objects.ocean).features)
    //     .enter()
    //     .append("path")
    //     .attr("d", path)
    //     // .attr("id", "prov-borders")


    // function getStationData(station,currHour){
    //     // display current hour values //
    //     console.log(dataMonth)
    //     // load 30 day data
    //     d3.csv('augAqhi'+'.csv',function(err, dat30){
    //         console.log(data30)

    //     })
    // };


    // plot30DayData();
    //     var filteredData = _(currHour).filter(function(d){
    //         return d.EMS_ID === station['station'];
    //     });
    //     return filteredData;
    // };

    // d3.json(data_loc, function(err, traceData) { //use for 90 live data
    // d3.csv('augAqhi.csv', function(err, traceData) {
    //         // console.log(traceData)
    //     // gather unique stations used to measure this trace
    //     $.each( traceData, function( key, value ) {
    //         // console.log(value)
    //         value.DATE_PST = (parseTime(value.DATE_PST))
    //         if(!curr_stations.includes(value['EMS_ID']) && value['EMS_ID']!=undefined){
    //             curr_stations.push(value['EMS_ID'])
    //         }
    //     });

    // Load current hour AQHI values, which also has station info
    // all non AQHI values
    // d3.json("https://jsonpdataproxy.api.gov.bc.ca/?url=http://www.env.gov.bc.ca/epd/bcairquality/aqo/csv/bc_air_monitoring_stations.csv&format=json", function(err, raw)

    //start by loading the aqhi data 
    d3.json("https://jsonpdataproxy.api.gov.bc.ca/?url=http://www.env.gov.bc.ca/epd/bcairquality/aqo/csv/AQHIWeb.csv&format=json", function(err, raw) {
        console.log(raw)
        test = raw
        var currHour = []
        //jsonpdataproxy seperates the fields and data so put back together
        for (var i = 0; i < raw['data'].length; i += 1) {
            var obj = {}
            for (var j = 0; j < raw['fields'].length; j += 1) {
                var field = raw['fields'][j];
                obj[field] = raw['data'][i][j];
            }
            currHour.push(obj)
        }
        console.log(currHour)


        // if (curr_stations.includes(raw[i]['EMS_ID'])){
        //     stn.push({
        //         station:raw[i]['EMS_ID'],
        //         name:raw[i]['STATION_NAME'],
        //         location:raw[i]['LOCATION'],
        //         lat:raw[i]['LATITUDE'],
        //         long:raw[i]['LONGITUDE']
        //     })
        // }                
        // }

        g.append("g")
            .attr("class", "bubble")
            .selectAll("circle")
            .data(currHour)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                // console.log(d)
                return projection([Number(d.LONGITUDE), Number(d.LATITUDE)])[0];
            })
            .attr("cy", function(d) {
                return projection([Number(d.LONGITUDE), Number(d.LATITUDE)])[1];
            })
            .attr("r", 6)
            // })
            .on("mouseover", function(d) {
                console.log(d3.select(this).select("circle"))

                d3.select(this).transition()
                    .duration(250)
                    .attr("r", 15)
                    .attr('fill', '#ff0000');

                tooltip.text(d.STATION_NAME);
                tooltip.style("visibility", "visible");
            })
            .on("mousemove", function() {
                return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX - 300) + "px");
            })
            .on("mouseout", function() {
                d3.select(this).transition()
                    .duration(250)
                    .attr("r", 6)
                    .attr('fill', 'steelblue');
                return tooltip.style("visibility", "hidden");
            })
            .on("click", function(d) {
                console.log(d)

                d3.select("#chart")
                    .append("h4")
                    .html(d.STATION_NAME)
                    .attr("class", "g-summary");
                // .append("p")
                // .html("Energy East is a proposed pipeline that would transport crude oil from the Alberta oil sands to refineries and ports in Eastern Canada.")
                // .attr("class","g-summary")
                // d3.select("#distid").style("visibility", "visible")
                //     .transition()
                //     .delay(200)
                //     .text(d.name);


                d3.select("#chart_container").style("visibility", "visible")
                currentStation = d;
                // if first time make if second update chart
                if (counter == 0) {
                    // lineData = getStationData(d,currHour)
                    var lineData = dataMonth;
                    // console.log(currentStation,lineData)

                    makeChart(currentStation['EMS_ID'],lineData);
                    counter += 1;
                    console.log(counter)
                } else {
                    console.log('this is the grade: ' + grade)
                    updatechart(d, grade);
                }
            });

        // load 30 data while no one is watching
        d3.csv('augAqhi' + '.csv', function(err, dat) {
            dataMonth = dat;
            $.each(dataMonth, function(key, value) {
                // console.log(value)
                value.DATE_PST = (parseTime(value.DATE_PST))

            });

        });

    })
}
//      d3.csv('augAqhi.csv', function(err, traceData) {
//     // console.log(traceData)
// // gather unique stations used to measure this trace
// $.each( traceData, function( key, value ) {
//     // console.log(value)
//     value.DATE_PST = (parseTime(value.DATE_PST))
//     if(!curr_stations.includes(value['EMS_ID']) && value['EMS_ID']!=undefined){
//         curr_stations.push(value['EMS_ID'])
//     }
// });

// });

var counter = 0;
var currentStation, grade, currentDist;

function clicked(d) {
    console.log(d)


    currentDist = d;
    // console.log(currentDist)

    // g.selectAll([".bubble"]).remove();
    // d3.select("h3").style("visibility", "hidden")

    console.log(d.properties.zone)
    dist_num = d.properties.zoneNum;
    dist_name = d.properties.zone;

    if (active.node() === this) return reset();
    active.classed("active", false);
    active = d3.select(this).classed("active", true);


    var bounds = path.bounds(d),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .6 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];

    // var transform = d3.zoomIdentity
    //     .translate(translate[0], translate[1])
    //     .scale(scale);

    // svg.transition()
    //     .duration(750)
    //     .call(zoom.transform, transform);

    var tooltip = d3.select(".map")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "#222")
        .style("padding", "8px")
        .style("background-color", "#fff")
        .style("border-radius", "6px")
        .style("font", "12 px sans-serif")
        .text("tooltip");

};


function updateTrace(currentDist, trace) {

    g.selectAll([".bubble"]).remove();
    console.log(currentDist)
    dist_num = currentDist.properties.zoneNum;

    // if (active.node() === this) return reset();
    // active.classed("active", false);
    // active = d3.select(this).classed("active", true);


    var bounds = path.bounds(currentDist),
        dx = bounds[1][0] - bounds[0][0],
        dy = bounds[1][1] - bounds[0][1],
        x = (bounds[0][0] + bounds[1][0]) / 2,
        y = (bounds[0][1] + bounds[1][1]) / 2,
        scale = .6 / Math.max(dx / width, dy / height),
        translate = [width / 2 - scale * x, height / 2 - scale * y];


    svg.transition()
        .duration(750)
        .call(zoom.transform, initialTransform);


    var tooltip = d3.select(".map")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("color", "#222")
        .style("padding", "8px")
        .style("background-color", "#fff")
        .style("border-radius", "6px")
        .style("font", "12 px sans-serif")
        .text("tooltip");

    var data = {
        resource_id: 'e58d2735-6d56-4223-8051-f59924ae5fd9', // the resource id
        limit: 10000, // get 5 results
        q: '2012/2013',
        filters: '{"DISTRICT_NUMBER":' + dist_num + ',"ORGANIZATION_EDUCATION_trace":"' + trace + '"}'
    };



    $.ajax({
        url: 'https://catalogue.data.gov.bc.ca/api/3/action/datastore_search',
        data: data,
        success: function(data) {
            scholLoc = data.result.records
            console.log(scholLoc)

            var projection = d3.geo.albers()
                .rotate([126, -10])
                .center([7, 44])
                .parallels([50, 58])
                .scale(1970)
                .translate([960 / 2, 600 / 2]);

            g.append("g")
                .attr("class", "bubble")
                .selectAll("circle")
                .data(scholLoc)
                .enter()
                .append("circle")
                .attr("cx", function(d) {
                    return projection([Number(d.SCHOOL_LONGITUDE), Number(d.SCHOOL_LATITUDE)])[0];
                })
                .attr("cy", function(d) {
                    return projection([Number(d.SCHOOL_LONGITUDE), Number(d.SCHOOL_LATITUDE)])[1];
                })
                .attr("r", 10)
                // })
                .on("mouseover", function(d) {
                    console.log(d.SCHOOL_NAME)
                    tooltip.text(d.SCHOOL_NAME);
                    tooltip.style("visibility", "visible");
                })
                .on("mousemove", function() {
                    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX - 300) + "px");
                })
                .on("mouseout", function() {
                    return tooltip.style("visibility", "hidden");
                })
                .on("click", function(d) {
                    console.log(d)

                    var disttext = svg.append("text")
                        .transition()
                        .delay(200)
                        .attr("x", (width / 4))
                        .attr("y", 0 - (margin.top / 2))
                        .attr("text-anchor", "middle")
                        .style("font-size", "16px")
                        .text(d.STATION_NAME);

                    currentStation = d;
                    // if first time make if second update chart
                    if (counter == 0) {
                        grade = "Avg Class Size 1 3"
                        makeChart(d, grade);
                        counter += 1;
                        console.log(counter)
                    } else {
                        console.log('this is the grade: ' + grade)
                        updatechart(d, grade);
                    }
                });

        }
    })

}

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    // svg.transition()
    //     .duration(750)
    //     .call(zoom.transform, initialTransform);

    d3.select("h3")
        .transition()
        .delay(750)
        .style("visibility", "visible");
}

function zoomed() {
    g.style("stroke-width", 1 / d3.event.scale + "px");
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

}


// function zoomed() {
//     g.style("stroke-width", 1 / d3.event.scale + "px");
//     g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");

//     g.selectAll("circle")
//         .attr("r", 10 / d3.event.scale);
// }

// function zoomed() {
//     var transform = d3.event.transform;

//     g.style("stroke-width", 1.5 / transform.k + "px");
//     g.attr("transform", transform);
// }

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
    if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

// Chart stuff

function makeChart(currentStation,lineData) {
    // get data for this station
    stnDat=[];

    lineData.forEach(function(d){
        if (d.EMS_ID == currentStation){
            stnDat.push(d)
        }
    })
        console.log(stnDat)


    var widthG = 560 - margin.left - margin.right,
        heightG = 250 - margin.top - margin.bottom;


    var y = d3.scaleLinear()
        .rangeRound([heightG, 0]);


    var meanLine;

    svg1 = d3.select("#chart").append("svg")
        .attr("width", widthG + margin.left + margin.right)
        .attr("height", heightG + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    stnDat.sort(function(a, b) {
        return a.DATE_PST - b.DATE_PST;
    });

    console.log(stnDat)

    var dataSum = d3.sum(stnDat, function(d) {
        // console.log(d.sz)
        return d.VALUE;
    });

    var x = d3.scaleTime()
        .rangeRound([0, widthG]);


    var line = d3.line()
        .x(function(d) {
            return x(d.DATE_PST)
        })
        .y(function(d) {
            return y(d.VALUE)
        });

    y.domain([d3.min(stnDat, function(d) {
        return d.VALUE;
    }), 10]);
    x.domain(d3.extent(stnDat, function(d) {
        return d.DATE_PST;
    }));

    console.log(lineData)

    svg1.append("g") //x axis group
        .attr("class", "x axis")
        .attr("transform", "translate(0," + heightG + ")")
        .call(d3.axisBottom(x)
            .ticks(d3.timeDay.every(7))
            .tickFormat(d3.timeFormat("%Y-%m-%d")))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)")
        .select(".domain")
        .remove();

    svg1.append("g")
        .call(d3.axisLeft(y))
        .attr("class", "y axis")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -48)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Air Quality");

    svg1.append("path")
        .datum(stnDat)
        .attr("class", "line")
        .attr("d", line);



}


$('.btn-info').bind("click", function(event) {
    // $('#oneThree').removeClass("active")
    // $(this).prev().removeClass("active")
    event.preventDefault();
    $(this).addClass('active').siblings().removeClass('active');
    grade = $(this).attr("value")
    // $(this).css("background","red");
    console.log($(this).prev())
    updatechart(currentStation, grade)
})

function updatechart(d, grade) {
    console.log(d.SCHOOL_NAME)
    console.log(grade)
    "use strict";
    var data = {
        resource_id: '68106e98-99f4-49f2-bcfb-d8093d77602d', // 
        limit: 1000, // get 5 results
        filters: '{"School Name":' + '"' + d.SCHOOL_NAME + '"' + '}'
    };

    $.ajax({
        url: 'https://catalogue.data.gov.bc.ca/api/3/action/datastore_search',
        data: data,
        success: function(data) {
            console.log(data)
            var chartData = []

            for (i = 0; i < data.result.records.length; i++) {

                chartData.push({
                    date: parseDate(data.result.records[i]["School Year"].slice(2, 4) + " 06"),
                    sz: Number(data.result.records[i][grade])
                })

            }

            chartData.sort(function(a, b) {
                return a.date - b.date;
            });

            y.domain(d3.extent(chartData, function(d) {
                return d.sz;
            }));
            console.log(chartData)

            x.domain(d3.extent(chartData, function(d) {
                // console.log(d.date)
                return d.date;
            }));

            var dataSum = d3.sum(chartData, function(d) {
                // console.log(d.sz)
                return d.sz;
            });

            meanLine = d3.svg.line()
                .x(function(d) {
                    console.log(d.date)
                    return x(d.date);
                })
                .y(function(d) {
                    console.log(y(dataSum / chartData.length))
                    return y(dataSum / chartData.length);
                });

            //transitions
            svg.select(".line")
                .transition()
                .duration(1000)
                .attr("d", line(chartData));

            AvgLine.selectAll("path")
                .transition()
                .duration(1000)
                .attr("d", meanLine(chartData));

            // svg.selectAll("circle")
            //     .data(chartData)
            //     .transition()
            //     .duration(1000)
            //     .attr("r", 3.5)
            //     .attr("cx", function (d) {
            //         // console.log(d)
            //         return x(d.date);
            //     })
            //     .attr("cy", function (d) {
            //         return y(d.sz);
            //     })
            //     .style("fill", "rgb(214,39,40)");


            // Update X axis
            svg.select(".y.axis")
                .transition()
                .duration(1000)
                .call(yAxis);

            d3.select("text")
                .attr("x", (width / 4))
                .attr("y", 0 - (margin.top / 2.5))
                .attr("text-anchor", "middle")
                .style("font-size", "16px")
                .text(d.SCHOOL_NAME);
        }

    })

}