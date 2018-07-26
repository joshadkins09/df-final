// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 30, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the date / time
var parseDate = d3.time.format("%Y").parse; 

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.log().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var priceline = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var color = d3.scale.category10();

// Get the data
// d3.csv("stocks.csv", function(error, data) {
//     data.forEach(function(d) {
//         d.date = parseDate(d.date);
//         d.price = +d.price;
//     });

d3.json("data.json", function(error, d) {

    data = expand_data(d);
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.price = +d.price;
    });
    console.log(data);

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    y.domain(d3.extent(data, function(d) { return d.price; }));

    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.country_code;})
        .entries(data);

    // Loop through each symbol / key
    dataNest.forEach(function(d) {
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() {
                return d.color = color(d.key); })
            .attr("d", priceline(d.values)); 

    });

    // Add the X Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

});
