function normalized(d, b) {
    return 100 * (d.value - d.baseline)/d.baseline;
}

function get_nest(data) {
    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.region;})
        .key(function(d) {return d.code;})
        .entries(data);
    return dataNest;
}

function write_lines(nest, color, index) {
    // this is where we filter by 
    var d = nest[index];
    d.values.forEach(function(k, v) {
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() { // Add the colours dynamically
                return d.color = color(k.key); })
            .attr("id", 'tag'+k.key.replace(/\s+/g, '')) // assign ID
            .attr("d", priceline(k.values));
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
