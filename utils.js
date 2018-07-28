function normalized(d, b) {
    return 100 * (d.value - d.baseline)/d.baseline;
}

function flip(i) {
    return (i == 1) ? 0 : 1;
}

function remove() {
    svg.selectAll('.line').remove();
    svg.selectAll('.circle').remove();
    svg.selectAll('.legend').remove();
    svg.select('.x_axis').remove();
    svg.select('.y_axis').remove();
}

function write_lines(df) {
    nest = d3.nest().key(function(d) { return d.code; }).entries(df);
    var color = d3.scale.category10();
    lines = svg.selectAll('.line')
        .data(nest);

    lines.enter()
        .append("path")
        .attr("class", "line")
        .style("stroke", function(k) {
            return color(k.key); })
        .style('stroke-width', '3')
        .attr("id", function (k) {
            return 'line_'+k.key; })
        .attr("d", function(k) { return priceline(k.values); });
// ................................................................................

    circles = svg.selectAll('.circle')
        .data(df);

    circles.enter()
        .append("circle")
        .attr("class", "circle")
        .style("stroke", function(k) {
            return color(k.key); })
        // .style('stroke-width', '3')
        // .attr("id", function (k) {
        //     return 'line_'+k.key; })
        // .attr("d", function(k) { return priceline(k.values); })
        .attr("r", "5")
        .attr("cx", function (d) { return x(d.year); })
        .attr("cy", function (d) { return y(normalized(d)); })
        .style('opacity', 0)
        .on("mouseover", function(d) {
            console.log(d);
            this.style.opacity = 1;
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html('<p>' + d.value + '</p>')
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            this.style.opacity = 0;
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });

// ................................................................................
    legends = svg.selectAll('.legend').data(nest);
    legends.enter().append("text")
        .text(function(k) { return k.key; })
        .attr("x", function(d, i) {
            mult = Math.floor(i * 50 / width);
            return i*49.1 - width*mult;
        })
        .attr("y", function(d, i) {
            mult = Math.floor(i * 51 / width) + 1;
            return height + margin.top + mult*20; })
        .attr("class", "legend")
        .attr("id", function(k) { return "legend_item_"+k.key; })
        .style("fill", function(k) { return color(k.key); })
        .on("click", function(k){
            var line = svg.select('#line_'+k.key);
            var op = flip(line.style('opacity'));
            line.style('opacity', op);
            this.style.opacity = (op == 1) ? 1 : 0.5;
	      });
}

function set_domain(x, y, df) {
    x.domain(d3.extent(df, function(d) { return d.year; }));
    y.domain(d3.extent(df, function(d) { return normalized(d); }));
}

function add_axes() {
    svg.append("g")
        .attr("class", "x_axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y_axis")
        .call(yAxis);
}

function add_controls(data, region) {
    var controls = d3.select('body').append('div');
    controls.append('div')
        .append('select')
        .attr('id', 'region_select')
        .style('margin-top', '50')
        .style('margin-left', '75')
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

    controls.select('#region_select').property('value', region);


    // var slidecontainer = controls.append('div')
    //     .attr('class', 'slidecontainer');

    // var mx = d3.max(df, function(d) { return d.value; });
    // slidecontainer.append('input')
    //     .on('change', function (c) { console.log(this.value); })
    //     .attr('type', 'range')
    //     .attr('min', '1')
    //     .attr('max', '' + mx)
    //     .attr('value', '' + mx / 2)
    //     .attr('class', 'slider')
    //     .attr('id', 'myRange');
}
