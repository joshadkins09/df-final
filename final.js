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

// var fobj = {
//     'region': {
//         'enable': true,
//         'value': 'Latin America & Caribbean',
//         'func': function (d) {
//             if (this.enable) return d.region === this.value;
//             else return true;
//         }
//     },
//     'range': {
//         'enable': false,
//         'max': '10000000',
//         'func': function (d) {
//             if (this.enable) return d.value < this.max;
//             else return true;
//         }
//     }
// };

// function fobj_filter(d) {
//     for (var key in fobj)
//         if (!fobj[key]['func']()) return false;
//     return true;
// }

d3.json("expand.json", function(error, data) {
    data.forEach(function(d) { d.year = parseDate(d.year); });
    var region = "North America";
    var df = data.filter(function(e) { return e.region === region; });

    add_controls(data, region);

    set_domain(x, y, df);
    remove();
    add_axes();
    write_lines(df);
});

function update_region(index) {
    d3.json("expand.json", function(error, data) {
        data.forEach(function(d) { d.year = parseDate(d.year); });

        var region = d3.nest().key(function(d) { return d.region; }).entries(data)[index].key;
        var df = data.filter(function(e) { return e.region === region; });

        set_domain(x, y, df);
        remove();
        add_axes();
        write_lines(df);
    });
}
