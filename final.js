var margin = {top: 30, right: 20, bottom: 120, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

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

var slideindex = 0;
var slideparams = [
    {
        'region': 'Latin America & Caribbean',
        'income': 'Lower middle income',
        'min': '0',
        'max': '10000000',
        'msg': 'this is the first slide'
    },
    {
        'region': 'Latin America & Caribbean',
        'income': 'Upper middle income',
        'min': '0',
        'max': '10000000',
        'msg': 'a second slide there is also'
    },
    {
        'region': 'North America',
        'income': 'High income',
        'min': '1000',
        'max': '10000000',
        'msg': 'yay three'
    }
];
var slidemax = slideparams.length;
function set_from_slideindex(index) {
    if (index == 0) d3.select('#about').style('opacity', '1');
    else d3.select('#about').style('opacity', '0');
    d3.select('#region-select').property('value', slideparams[index].region);
    d3.select('#income-select').property('value', slideparams[index].income);
    d3.select('#min-select').property('value', slideparams[index].min);
    d3.select('#max-select').property('value', slideparams[index].max);
    d3.select('#blurb').text(slideparams[index].msg);
    update();
}

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
    .text(slideparams[0].msg)
    .style("opacity", 1);

rightside.append('div')
    .append('button')
    .attr('id', 'fast-back-button')
    .style("position", 'absolute')
    .style("left", '1350px')
    .style('top', '350px')
    .text('<<')
    .on('click', function(d) {
        slideindex = 0;
        rightside.select('#slide-label').text(slideindex + 1);
        set_from_slideindex(slideindex);
    })
;

rightside.append('div')
    .append('button')
    .attr('id', 'back-button')
    .style("position", 'absolute')
    .style("left", '1450px')
    .style('top', '350px')
    .text('<')
    .on('click', function(d) {
        if (slideindex > 0)
        {
            --slideindex;
            rightside.select('#slide-label').text(slideindex + 1);
            set_from_slideindex(slideindex);
        }
    })
;

rightside.append('div')
    .append('label')
    .attr('id', 'slide-label')
    .style("position", 'absolute')
    .style("left", '1550px')
    .style('top', '360px')
    .text('' + (slideindex + 1))
;

rightside.append('div')
    .append('button')
    .attr('id', 'baz')
    .style("position", 'absolute')
    .style("left", '1600px')
    .style('top', '350px')
    .text('>')
    .on('click', function(d) {
        if (slideindex < (slidemax - 1))
        {
            ++slideindex;
            rightside.select('#slide-label').text(slideindex + 1);
            set_from_slideindex(slideindex);
        }
    })
;

rightside.append('div')
    .append('button')
    .attr('id', 'about')
    .style("position", 'absolute')
    .style("left", '1400px')
    .style('top', '400px')
    .text('About the Visualization');

d3.json("expand.json", function(error, data) {
    data.forEach(function(d) { d.year = parseDate(d.year); });
    var region = slideparams[0].region;
    var income = slideparams[0].income;
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
            .filter(function(e) { return filts.region == 'All' || e.region === filts.region; })
            .filter(function(e) { return filts.income == 'All' || e.income === filts.income; })
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
