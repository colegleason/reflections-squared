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
		sex_chart(content,years)
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

function sex_chart(root,years) {
	var sexes = {};
	var speakers = collapse_speakers(years);
	speakers.forEach(function(speaker) {
		if (sexes.hasOwnProperty(speaker.sex)) {
			sexes[speaker.sex]++;
		} else {
			sexes[speaker.sex] = 1;
		}
	});
	var data = [];
	for (var key in sexes) {
		var count = sexes[key];
		data.push({name: key, count: count})
	}

	var width = 200;
	var height = 200;
	var radius = 100;
	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {console.log(d.count); return d.count})
	var svg = root.append("svg")
		.attr("width", width)
		.attr("height", height)
		.append("g")
		.attr("transform", "translate(" + width/2 + "," + height/2 + ")");
	var g = svg.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class","arc");
	g.append("path")
		.attr("d",arc)
		.style("fill", function(d) {
			console.log(d);
			var color = "#6A5ACD";
			if (d.data.name == "F") {
				color =  "#ffffff";
			}
			return color;
		});
	g.append("text")
		.attr("transform", function(d) {
			return "translate(" + arc.centroid(d) + ")";})
		.attr("dy",".35em")
		.style("text-anchor", "middle")
		.text(function(d) {return d.data.name + " " + d.data.count;});
	console.log(data);
	data.forEach(function(d) {
		console.log(d.name + " " + d.count);
	});
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
