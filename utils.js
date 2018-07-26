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
            buf[d[i].region] = d[i][1991];
        }
        else
        {
            buf[d[i].region] += d[i][1991];
        }
    }
    summed = [];
    for (var key in buf)
    {
        summed.push({'name': key, 'value': buf[key]});
    }
    return summed;
}

function other(d) {
    out = {};
    for (var y = 1990; y < 2016; ++y)
    {
        out[y] = {
            // "Latin America & Caribbean": 0,
            // "South Asia": 0,
            // "Sub-Saharan Africa": 0,
            // "Europe & Central Asia": 0,
            // "Middle East & North Africa": 0,
            // "East Asia & Pacific": 0,
            "North America": 0
        };
    }
    for (var i = 0; i < d.length; ++i)
    {
        for (var y = 1990; y < 2016; ++y)
        {
            if ([d[i].region] != "")
            {
                out[y][d[i].region] += d[i][y];
            }
        }
    }

    foo = [];
    for (var key in out)
    {
        foo.push({
            "year": key,
            // "Latin America & Caribbean": out[key]["Latin America & Caribbean"],
            // "South Asia": out[key]["South Asia"],
            // "Sub-Saharan Africa": out[key]["Sub-Saharan Africa"],
            // "Europe & Central Asia": out[key]["Europe & Central Asia"],
            // "Middle East & North Africa": out[key]["Middle East & North Africa"],
            // "East Asia & Pacific": out[key]["East Asia & Pacific"],
            "value": out[key]["North America"]
        });
    }
    return foo;
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

// var foo = [];
// d3.json('data.json', function(data) {
// });

function expand_data(d) {
    out = [];
    for (var i = 0; i < d.length; ++i)
    {
        var e = d[i];
        for (var j = 1990; j < 2016; ++j)
        {
            if (e.region == "Europe & Central Asia") {
                // console.log(e.country_name + " " + j + " " + e[j]);
                out.push({
                    "country_code": e.country_code,
                    "date": '' + j,
                          "price": e[j]
                          // "income_group": e.income_group,
                          // "region": e.region,
                          // "country_name": e.country_name,
                         });
                }
        }
    }
    return out;
}
