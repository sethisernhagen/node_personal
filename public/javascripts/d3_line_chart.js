// Set the dimensions of the canvas / graph
var margin = { top: 30, right: 20, bottom: 30, left: 120 },
    width = 1200 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%d-%b-%y").parse;

var quotes;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);
var yVolume = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5)
    .innerTickSize(-height)
    .outerTickSize(0)
    .tickPadding(10)
    .tickFormat(d3.time.format("%d-%b-%y"));

var yAxis = d3.svg.axis().scale(y)
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10)
    .orient("left").ticks(5);
var yAxisVolume = d3.svg.axis().scale(yVolume)
    .innerTickSize(-width)
    .outerTickSize(0)
    .tickPadding(10)
    .orient("left").ticks(5);

// Define the line
var valueline = d3.svg.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return y(d.adjClose); });

var valueline2 = d3.svg.line()
    .x(function (d) { return x(d.date); })
    .y(function (d) { return yVolume(d.volume); });

// Adds the svg canvas
var svg = d3.select("#line-chart-price")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#line-chart-volume")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("/getQuote/amzn", function (error, json) {
    if (error) return console.warn(error);
    data = json.data.quotes;

    data.forEach(function (d) {
        d.date = Date.parse(d.date);
        //d.volume = d.volume / 1000;
    }) ;
    
    // Scale the range of the data
    x.domain(d3.extent(data, function (d) { return d.date; }));
    y.domain([0, d3.max(data, function (d) { return d.adjClose; })]);
    
    yVolume.domain([0, d3.max(data, function (d) { return d.volume; })]);
    
    // Add the valueline path.
    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    svg2.append("path")
        .attr("class", "line")
        .attr("d", valueline2(data));
    
    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg2.append("g")
        .attr("class", "y axis")
        .call(yAxisVolume);

});

//update chart
function getData(symbol) {
    
    // Get the data again
    d3.json("/getQuote/" + symbol, function (error, json) {
        if (error) return console.warn(error);
        data = json.data.quotes;
        
        data.forEach(function (d) {
            d.date = Date.parse(d.date);
            //d.volume = d.volume / 1000;
        });
        
        // Scale the range of the data again 
        x.domain(d3.extent(data, function (d) { return d.date; }));
        y.domain([0, d3.max(data, function (d) { return d.adjClose; })]);
        yVolume.domain([0, d3.max(data, function (d) { return d.volume; })]);
        
        // Select the section we want to apply our changes to
        var svg = d3.select("#line-chart-price").transition();
        var svg2 = d3.select("#line-chart-volume").transition();
        
        // Make the changes
        svg.select(".line")// change the line
            .duration(250)
            .attr("d", valueline(data));
        svg.select(".x.axis")// change the x axis
            .duration(750)
            .call(xAxis);
        svg.select(".y.axis")// change the y axis
            .duration(750)
            .call(yAxis);

        svg2.select(".line")// change the line
            .duration(250)
            .attr("d", valueline2(data));
        svg2.select(".x.axis")// change the x axis
            .duration(750)
            .call(xAxis);
        svg2.select(".y.axis")// change the y axis
            .duration(750)
            .call(yAxisVolume);
    });
}