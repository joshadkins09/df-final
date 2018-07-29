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

var priceline = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(normalized(d)); });

var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Define the div for the tooltip
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

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

function update() {
    d3.json("expand.json", function(error, data) {
        data.forEach(function(d) { d.year = parseDate(d.year); });

        filts = get_filts();
        var df = data
            .filter(function(e) { return e.region === filts.region; })
            .filter(function(e) { return e.income === filts.income; })
            .filter(function(e) { return e.baseline >= filts.min; })
            .filter(function(e) { return e.baseline <= filts.max; })
        ;

        set_domain(x, y, df);
        remove();
        add_axes();
        write_lines(df);
    });
}
