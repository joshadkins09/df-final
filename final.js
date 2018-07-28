// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 100},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Parse the year / time
var parseDate = d3.time.format("%Y").parse;

// Set the ranges
var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(5);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5);

// Define the line
var priceline = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.value); });

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("expand.json", function(error, data) {
    data.forEach(function(d) { d.year = parseDate(d.year); });

    // Nest the entries by symbol
    var dataNest = get_nest(data);
    // var dataNest = data.filter(function(d) { return d.region === "North America"; });

    d3.select('body').append('div')
        .append('select')
        .on('change', function(c) {
            var index = this.options.selectedIndex;
            update_region(index);
        })
        .selectAll('option')
        .data(dataNest)
        .enter()
        .append('option')
        .attr('value',function (d) { return d.key; })
        .text(function (d) { return d.key; });

    var filtered = dataNest.filter(function(e) { return e.key === 'North America'; });
    // console.log(filtered[0].values);

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.year; }));
    // y.domain(d3.extent(data, function(d) { return d.value; }));
    // console.log(d3.extent(data, function(d) { return d.value; }));
    y.domain([0, 1000000]);

    var color = d3.scale.category10();   // set the colour scale
    write_lines(dataNest, color, 0);

    // Add the X Axis
    svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // Add the Y Axis
    svg.append("g")
        .attr("class", "y_axis")
        .call(yAxis);

});

function update_region(index) {
    d3.json("expand.json", function(error, data) {
        data.forEach(function(d) { d.year = parseDate(d.year); });

        // Nest the entries by symbol
        var dataNest = get_nest(data);
        dataNest.filter(function(e) { return e.key === dataNest[index].key; });
        console.log(dataNest);

        // Scale the range of the data
        // x.domain(d3.extent(data, function(d) { return d.year; }));
        // y.domain(d3.extent(data, function(d) { return d.value; }));

        var color = d3.scale.category10();   // set the colour scale

        svg.selectAll('.line').remove();
        write_lines(dataNest, color, index);

        // // Add the X Axis
        // svg.append("g")
        //     .attr("class", "x_axis")
        //     .attr("transform", "translate(0," + height + ")")
        //     .call(xAxis);

        // // Add the Y Axis
        // svg.append("g")
        //     .attr("class", "y_axis")
        //     .call(yAxis);
    });
}
