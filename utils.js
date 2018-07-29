function normalized(d, b) {
    return  (d.value - d.baseline)/d.baseline;
}

function flip(i) {
    return (i == 1) ? 0 : 1;
}

function remove() {
    svg.selectAll('.data_line').remove();
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
        .attr("class", "data_line")
        .style("stroke", function(k) {
            return color(k.key); })
        .style('stroke-width', '4')
        .attr("id", function (k) {return 'line_'+k.key; })
        .attr("d", function(k) { return valueline(k.values); });
    // ................................................................................

    circles = svg.selectAll('.circle')
        .data(df);

    circles.enter()
        .append("circle")
        .attr("class", "circle")
        .attr('id', function(k) { return 'circle_'+k.code; })
        .style("stroke", function(k) {
            return color(k.key); })
        .attr("r", "6")
        .attr("cx", function (d) { return x(d.year); })
        .attr("cy", function (d) { return y(normalized(d)); })
        .style('opacity', 0)
        .on("mouseover", function(d) {
            if (d3.select('#legend_item_'+d.code).style('opacity') == 1)
            {
                this.style.opacity = 1;
                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html('<p>' + d.name + '</p>' +
                             '<p>' + d.year.getFullYear() + '</p>' +
                             '<p>' + d.value + ' sq. km. </p>' +
                             '<p>' + (100 * normalized(d)).toFixed(2) + '% </p>')
                    .style("left", (d3.event.pageX - 50) + "px")
                    .style("top", (d3.event.pageY - 28) + "px")
                ;
            }
        })
        .on("mouseout", function(d) {
            if (d3.select('#legend_item_'+d.code).style('opacity') == 1)
            {
                this.style.opacity = 0;
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            }
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
            return height + margin.top + 20 + mult*20; })
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

function add_controls(data) {
    var controls = d3.select('body').append('div');

    controls.append('div')
        .append('button')
        .attr('id', 'toggler')
        .style('margin-top', '25')
        .style('margin-left', '75')
        .style('float', 'left')
        .on('click', function(d) {
            button = d3.select('#toggler');
            if (button.text() == "remove all")
            {
                svg.selectAll('.data_line').style('opacity', 0);
                svg.selectAll('.legend').style('opacity', 0.5);
                button.text('restore all');
            }
            else
            {
                svg.selectAll('.data_line').style('opacity', 1);
                svg.selectAll('.legend').style('opacity', 1);
                button.text('remove all');
            }
        })
        .text('remove all');

    controls.append('div')
        .append('select')
        .attr('id', 'region_select')
        .style('margin-top', '25')
        .style('margin-left', '25')
        .style('float', 'left')
        .on('change', function(c) {
            update();
        })
        .selectAll('option')
        .data(d3.nest().key(function(d) { return d.region; }).entries(data))
        .enter()
        .append('option')
        .attr('value',function (d) { return d.key; })
        .text(function (d) { return d.key; });

    controls.select('#region_select').property('value', "North America");

    controls.append('div')
        .append('select')
        .attr('id', 'income_select')
        .style('margin-top', '25')
        .style('margin-left', '25')
        .style('float', 'left')
        .on('change', function(c) {
            var index = this.options.selectedIndex;
            update();
        })
        .selectAll('option')
        .data(d3.nest().key(function(d) { return d.income; }).entries(data))
        .enter()
        .append('option')
        .attr('value',function (d) { return d.key; })
        .text(function (d) { return d.key; });

    controls.select('#income_select').property('value', "High income");

    controls.append('div')
        .append('select')
        .attr('id', 'min_select')
        .style('margin-top', '25')
        .style('margin-left', '25')
        .style('float', 'left')
        .on('change', function(c) {
            update();
        })
        .selectAll('option')
        .data([0, 1000, 10000, 100000])
        .enter()
        .append('option')
        .attr('value', function (d) { return d; })
        .text(function (d) { return 'min area of ' + d + ' sq. km.'; });

    controls.select('#min_select').property('value', "0");

    controls.append('div')
        .append('select')
        .attr('id', 'max_select')
        .style('margin-top', '25')
        .style('margin-left', '25')
        .style('float', 'left')
        .on('change', function(c) {
            update();
        })
        .selectAll('option')
        .data([1000, 10000, 100000, 1000000, 10000000])
        .enter()
        .append('option')
        .attr('value', function (d) { return d; })
        .text(function (d) { return 'max area of ' + d + ' sq. km.'; });

    controls.select('#max_select').property('value', "10000000");
}

function get_filts() {
    return {
        'region': d3.select('#region_select').node().value,
        'income': d3.select('#income_select').node().value,
        'min': d3.select('#min_select').node().value,
        'max': d3.select('#max_select').node().value
    };
}
