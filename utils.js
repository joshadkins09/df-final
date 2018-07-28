function normalized(d, b) {
    return 100 * (d.value - d.baseline)/d.baseline;
}

function flip(i) {
    return (i == 1) ? 0 : 1;
}

function remove() {
    svg.selectAll('.line').remove();
    svg.selectAll('.legend').remove();
    svg.select('.x_axis').remove();
    svg.select('.y_axis').remove();
}

function write_lines(nest, color, index) {
    nest.forEach(function(k, v) {
        svg.append("path")
            .attr("class", "line")
            .style("stroke", function() {
                return nest.color = color(k.key); })
            .attr("id", 'line_'+k.key)
            .attr("d", priceline(k.values));

        svg.append("text")
            .text(k.key)
            .attr("x", function(d) {
                mult = Math.floor(v * 50 / width);
                return v*49.1 - width*mult;
            })
            .attr("y", function(d) {
                mult = Math.floor(v * 51 / width) + 1;
                return height + margin.top + mult*20; })
            .attr("class", "legend")
            .attr("id", "legend_item_"+k.key)
            .style("fill", color(k.key))
            .on("click", function(){
                var line = svg.select('#line_'+k.key);
                var op = flip(line.style('opacity'));
                line.style('opacity', op);
                this.style.opacity = (op == 1) ? 1 : 0.5;
	          });
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
