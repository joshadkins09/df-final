var margin = {top: 30, right: 20, bottom: 70, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(25);

var yAxis = d3.svg.axis().scale(y)
    .orient("left").ticks(5)
    .tickFormat(d3.format('.1%'));
;

var valueline = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(normalized(d)); });

var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

svg.append("text")
    .attr("class", "x label")
    .attr("id", "x_label")
    .attr("x", width /2)
    .attr("y", height + 50)
    .text("Year");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("x", -100)
    .attr("y", -60)
    .attr("transform", "rotate(-90)")
    .text("% change in forest area since 1990");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var rightside = d3.select("body")
    .append("div");

var blurb = rightside.append('div')
    .attr("class", "tooltip")
    .style("left", '1250')
    .style("top", '150px')
    .style('width', '500px')
    .style('height', '150px')
    .append('blockquote')
    .attr("id", 'blurb')
    .style('margin-left', '10px')
    .style('margin-right', '10px')
    .text('"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."')
    .style("opacity", 1);

rightside.append('div')
    .append('button')
    .attr('id', 'fast-back-button')
    .style("position", 'absolute')
    .style("left", '1350px')
    .style('top', '350px')
    .text('<<');

rightside.append('div')
    .append('button')
    .attr('id', 'back-button')
    .style("position", 'absolute')
    .style("left", '1450px')
    .style('top', '350px')
    .text('<');

rightside.append('div')
    .append('label')
    .attr('id', 'forward-button')
    .style("position", 'absolute')
    .style("left", '1550px')
    .style('top', '360px')
    .text('1');

rightside.append('div')
    .append('button')
    .attr('id', 'baz')
    .style("position", 'absolute')
    .style("left", '1600px')
    .style('top', '350px')
    .text('>');

// controls.append('div')
//     .append('button')
//     .attr('id', 'bar')
//     .style('margin-top', '25')
//     .style('margin-left', '25')
//     .style('float', 'left')
//     .text('>');

d3.json("expand.json", function(error, data) {
    data.forEach(function(d) { d.year = parseDate(d.year); });
    var region = "North America";
    var income = "High income";
    var df = data
        .filter(function(e) { return e.region === region; })
        .filter(function(e) { return e.income === income; })
    ;

    add_controls(data);
    set_domain(x, y, df);
    remove();
    add_axes();
    write_lines(df);
});

function update(update_restore) {
    d3.json("expand.json", function(error, data) {
        data.forEach(function(d) { d.year = parseDate(d.year); });

        filts = get_filts();
        var df = data
            .filter(function(e) { return e.region === filts.region; })
            .filter(function(e) { return e.income === filts.income; })
            .filter(function(e) { return e.baseline >= filts.min; })
            .filter(function(e) { return e.baseline <= filts.max; })
        ;

        d3.select('#toggler').text('remove all');
        set_domain(x, y, df);
        remove();
        add_axes();
        write_lines(df);
    });
}
