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

var priceline = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(normalized(d)); });

// Adds the svg canvas
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

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

// Get the data
d3.json("expand.json", function(error, data) {
    data.forEach(function(d) { d.year = parseDate(d.year); });
    var region = "Latin America & Caribbean";
    // var df = data.filter(fobj_filter);
    var df = data.filter(function(e) { return e.region === region; });

    var controls = d3.select('body').append('div');
    controls.append('div')
        .append('select')
        .on('change', function(c) {
            var index = this.options.selectedIndex;
            update_region(index);
        })
        .selectAll('option')
        .data(d3.nest().key(function(d) { return d.region; }).entries(data))
        .enter()
        .append('option')
        .attr('value',function (d) { return d.key; })
        .text(function (d) { return d.key; });

    var slidecontainer = controls.append('div')
        .attr('class', 'slidecontainer');

    var mx = d3.max(df, function(d) { return d.value; });
    slidecontainer.append('input')
        .on('change', function (c) { console.log(this.value); })
        .attr('type', 'range')
        .attr('min', '1')
        .attr('max', '' + mx)
        .attr('value', '' + mx / 2)
        .attr('class', 'slider')
        .attr('id', 'myRange');

    set_domain(x, y, df);

    var color = d3.scale.category10();   // set the colour scale
    write_lines(d3.nest().key(function(d) { return d.code; }).entries(df), color, 0);
    add_axes();
});

function update_region(index) {
    d3.json("expand.json", function(error, data) {
        data.forEach(function(d) { d.year = parseDate(d.year); });

        var region = d3.nest().key(function(d) { return d.region; }).entries(data)[index].key;
        var df = data.filter(function(e) { return e.region === region; });

        set_domain(x, y, df);

        var color = d3.scale.category10();   // set the colour scale

        svg.selectAll('.line').remove();
        write_lines(d3.nest().key(function(d) { return d.code; }).entries(df), color, index);

        svg.select('.x_axis').remove();
        svg.select('.y_axis').remove();
        add_axes();
    });
}
