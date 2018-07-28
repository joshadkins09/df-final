// function get_select(data) {
// }

function get_nest(data) {
    // Nest the entries by symbol
    var dataNest = d3.nest()
        .key(function(d) {return d.region;})
        .key(function(d) {return d.code;})
        .entries(data)
    ;
    return dataNest;
}

function write_lines(nest, color, index) {
    // console.log(nest);
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
