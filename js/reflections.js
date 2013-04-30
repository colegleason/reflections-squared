// Citation: http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values
function get_param(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.search);
  if(results == null)
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

function load_data() {
    d3.json("/data.json", function(error, json) {
        if (error) return console.warn(error);
        var data = json;

        // Construct Sidebar
        var sidebar = d3.select("#sidebar")
        year_list(sidebar, data.years);

        // Set the years to be those specified in the GET request
        var years = data.years;
        var year = get_param("year");
        if (year != "") {
            console.log("Year: " + year);
            years = [data.years[year]];
        }
        // Construct content
        var content = d3.select("#content");
        top_affiliations(content, years, 5);
        degree_types(content, years);
});
}

function year_list(root, data) {
    var graph = root.append("div").append("ul");
    graph.selectAll("li")
	.data(d3.keys(data))
	.enter()
	.append("li")
	.append("a")
	.attr("href", function(d) {return "/index.html/?year="+d})
	.text(function(d) {return d});
}

function collapse_speakers(years) {
    var speakers = [];
    for (var year in years) {
        speakers = speakers.concat(years[year].speakers);
    }
    return speakers;
}

function top_affiliations(root, years, number) {
    var affiliations = {};
    var speakers = collapse_speakers(years);
    speakers.forEach(function(speaker) {
        if (speaker.affiliation != null) {
            if (affiliations.hasOwnProperty(speaker.affiliation)) {
                affiliations[speaker.affiliation]++;
            } else {
                affiliations[speaker.affiliation] = 1;
            }
        }
    });

    var data = [];
    for (var key in affiliations) {
        var count = affiliations[key];
        data.push({name: key, count: count})
    }

    data.sort(function (a, b) { return b.count - a.count; });
    data = data.slice(0, number);
    var graph = root.append("div")
        .attr("id", "affiliations");

    graph.append("h2")
        .text("Top Affiliated Companies");

    graph = graph.append("ol");

    graph.selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .text(function(d) { return d.name + " " + d.count})
}


function degree_types(root, years) {
    var speakers = collapse_speakers(years);
    var degrees = {};
    speakers.forEach(function(speaker) {
        if (speaker.degree != null) {
            if (degrees.hasOwnProperty(speaker.degree)) {
                degrees[speaker.degree]++;
            } else {
                degrees[speaker.degree] = 1;
            }
        }
    });

    var data = [];
    for (var key in degrees) {
        var count = degrees[key];
        data.push({name: key, count: count})
    }
    console.log(data);

    data.sort(function (a, b) { return b.count - a.count });

    var graph = root.append("div")
        .attr("id", "degrees");

    graph.append("h2")
        .text("Degree Types");

    chart = graph.append("svg");

    var max_width = 300 // chart width (only for bars, not labels)
    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d.count; })])
        .range([0, max_width]);

    var y = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeBands([0, 250]);

    //Bars
    chart.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("y", function(d, i) { return y(i);})
        .attr("x", function(d) { return 50 + max_width - x(d.count)})
        .attr("width", function(d) { return x(d.count);})
        .attr("height", y.rangeBand())
        .text(function(d) { return d.name; });

    // Bar Chart Labels
    chart.selectAll("text.labels")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "labels")
        .attr("x", 3)
        .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
        .attr("dy", ".35em") // vertical-align: middle
        .text(function(d) { return d.name; });

    // Bar Chart counts
    chart.selectAll("text.counts")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "counts")
        .attr("x", 50 + max_width + 5)
        .attr("y", function(d, i) { return y(i) + y.rangeBand() / 2; })
        .attr("dy", ".35em") // vertical-align: middle
        .text(function(d) { return d.count; });
}
