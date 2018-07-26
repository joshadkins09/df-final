function filter_year(d, y)
{
    filtered = [];
    for (var i = 0; i < d.length; ++i)
    {
        filtered.push({"name": d[i].country_name, "value": d[i][y]});
    }
    return filtered;
}

function sum_regions(d)
{
    buf = {};
    for (var i = 0; i < d.length; ++i)
    {
        if (d[i].region == "") continue;
        if (buf[d[i].region] == undefined)
        {
            buf[d[i].region] = d[i]['1991'];
        }
        else
        {
            buf[d[i].region] += d[i]['1991'];
        }
    }
    summed = [];
    for (var key in buf)
    {
        summed.push({'name': key, 'value': buf[key]});
    }
    return summed;
}

function filter_region(d, r)
{
    filtered = [];
    for (var i = 0; i < d.length; ++i)
    {
        if (d[i].region == r)
        {
            filtered.push(d[i]);
        }
    }
    return filtered;
}

function filter_income(d, l)
{
    filtered = [];
    for (var i = 0; i < d.length; ++i)
    {
        if (d[i].income_group == l)
        {
            filtered.push(d[i]);
        }
    }
    return filtered;
}

function has_region(r)
{
    return r.region != "";
}

function in_region(r, region)
{
    return has_region(r) && r.region == region;
}

var foo = [];
d3.json('data.json', function(data) {
    foo = data;
    /* for (var i = 0; i < data.length; i++) {
     * console.log(data[i].tablename);
     * }*/
});
