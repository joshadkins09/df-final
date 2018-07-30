var margin = {top: 30, right: 20, bottom: 120, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var parse_date = d3.time.format("%Y").parse;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xaxis = d3.svg.axis().scale(x)
    .orient("bottom").ticks(25);

var yaxis = d3.svg.axis().scale(y)
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
        'income': 'All',
        'min': '0',
        'max': '10000000',
        'msg': 'Latin America and the Caribbean, all income levels</br></br>Here we see a fairly broad spectrum of change in forest area over the years in question, but overall a small number of countries increasing at a high rate and a high number of countries decreasing at a low rate.'
    },
    {
        'region': 'Latin America & Caribbean',
        'income': 'Lower middle income',
        'min': '0',
        'max': '10000000',
        'msg': 'Latin America and the Caribbean, lower middle income</br></br>When filtered to show only the lower middle income bracket, it is clear that many of the decreasing trends are from this income bracket. More specifically, it is notable that there are no lower middle income countries in this region that have increasing forest area and the rate of decrease is high.'
    },
    {
        'region': 'Latin America & Caribbean',
        'income': 'Lower middle income',
        'min': '10000',
        'max': '10000000',
        'msg': 'Latin America and the Caribbean, lower middle income, with min 10000 sq. km.</br></br>In the previous view, we noted that all lower middle income countries in Latin America and the Caribbean show decreasing forest area, but perhaps the percentage representation is skewed by small values... in this view, filtering out any countries with less than 10000 square kilometers of forest area in 1990 we see that this region/income combination does have significant reduction between 1990 and 2015.'
    },
    {
        'region': 'Latin America & Caribbean',
        'income': 'Upper middle income',
        'min': '0',
        'max': '10000000',
        'msg': 'Latin America and the Caribbean, upper middle income</br></br>Although we do see a high amount of decreasing forest area in the upper middle income countries, the mean rate appears to be less than lower middle income and at least a few increasing rapidly.'
    },
    {
        'region': 'Latin America & Caribbean',
        'income': 'Upper middle income',
        'min': '10000',
        'max': '10000000',
        'msg': 'Latin America and the Caribbean, upper middle income, with min 10000 sq. km.</br></br>As with the lower middle income, by filtering out countries with less than 10000 square kilometeres of forest area in 1990, we can see that the message of the data does not change dramatically... overall decreasing with a few increasing rapidly.'
    },
    {
        'region': 'South Asia',
        'income': 'All',
        'min': '0',
        'max': '10000000',
        'msg': 'South Asia</br></br>In South Asia we see mostly modest declines, with the exception of modest increases in India and Bhutan and more significant decreases in Pakistan and Nepal.'
    },
    {
        'region': 'Sub-Saharan Africa',
        'income': 'All',
        'min': '0',
        'max': '10000000',
        'msg': 'Sub-Saharan Africa</br></br>Here we see another broad spectrum, however more countries seem to be decreasing than increasing. This is a rather busy view and more robust conclusions can be made with a more targeted view.'
    },
    {
        'region': 'Sub-Saharan Africa',
        'income': 'All',
        'min': '100000',
        'max': '10000000',
        'msg': 'Sub-Sarahan Africa, min of 100000 sq. km.</br></br>When only viewing countries in Sub-Saharan Africa with a baseline forest area greater than 100000 square kilometers, it is plain to see that the overall trend is overwhelmingly decreasing, especially alarming for forests of such large size. Nigeria, for example has lost nearly 60% of its forested area over the last 25 years.'
    },
    {
        'region': 'Europe & Central Asia',
        'income': 'All',
        'min': '0',
        'max': '10000000',
        'msg': 'Europe and Central Asia</br></br>Countries in Europe and Central Asia seem mostly to have had modest increases in forest area between 1990 and 2015 with a few outliers above (Iceland, Ireland, Montenegro) and below (Kyrgyz Republic, Portugal).'
    },
    {
        'region': 'Middle East & North Africa',
        'income': 'All',
        'min': '0',
        'max': '10000000',
        'msg': 'Middle East and North Africa</br></br>This view suggests that most of the countries in the Middle East and North Africa have had increasing forest area between 1990 and 2015. Without looking at the nominal size it is hard to say if these increases are signficant.'
    },
    {
        'region': 'Middle East & North Africa',
        'income': 'All',
        'min': '10000',
        'max': '10000000',
        'msg': 'Middle East and North Africa, with min 10000 sq. km.</br></br>Looking at countries in the Middle East and North Africa that had greater than 10000 square kilometers of forest area in 1990 seems to verify that the relative increases shows in the previous view hold up with nominal values as well.'
    },
    {
        'region': 'East Asia & Pacific',
        'income': 'All',
        'min': '0',
        'max': '10000000',
        'msg': 'East Asia and the Pacific</br></br>East Asia and the Pacific has a bit of everything.'
    },
    {
        'region': 'North America',
        'income': 'All',
        'min': '0',
        'max': '10000000',
        'msg': 'North America</br></br>North America encompasses only three countries: USA, Candada, and Bermuda (which is tiny and static). The United States and Candada both have large forested areas, the former increasing by less than 3% and the latter decreasing by less than 0.4%.'
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
    d3.select('#blurb').html(slideparams[index].msg);
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
    .style('width', '550px')
    .style('height', '150px')
    .append('div')
    .attr("id", 'blurb')
    .style('margin-top', '10px')
    .style('margin-left', '10px')
    .style('margin-right', '10px')
    .style('text-align', 'left')
    .html(slideparams[0].msg)
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
    .text('About the Visualization')
    .on('click', function() {
        alert(essay);
    })
;

d3.json("expand.json", function(error, data) {
    data.forEach(function(d) { d.year = parse_date(d.year); });
    var region = slideparams[0].region;
    var income = slideparams[0].income;
    var df = data
        .filter(function(e) { return region == 'All' || e.region === region; })
        .filter(function(e) { return income == 'All' || e.income === income; })
    ;

    add_controls(data);
    set_domain(x, y, df);
    remove();
    add_axes();
    write_lines(df);
});

function update(update_restore) {
    d3.json("expand.json", function(error, data) {
        data.forEach(function(d) { d.year = parse_date(d.year); });

        filts = get_filts();
        var df = data
            .filter(function(e) { return filts.region == 'All' || e.region === filts.region; })
            .filter(function(e) { return filts.income == 'All' || e.income === filts.income; })
            .filter(function(e) { return e.baseline >= filts.min; })
            .filter(function(e) { return e.baseline <= filts.max; })
        ;

        if (d3.select('#region-select').property('value') == "All")
        {
            d3.select('#income-option-All').property('disabled', true);
        }
        else
        {
            d3.select('#income-option-All').property('disabled', false);
        }

        if (d3.select('#income-select').property('value') == "All")
        {
            d3.select('#region-option-All').property('disabled', true);
        }
        else
        {
            d3.select('#region-option-All').property('disabled', false);
        }

        d3.select('#toggler').text('remove all');
        set_domain(x, y, df);
        remove();
        add_axes();
        write_lines(df);
    });
}
