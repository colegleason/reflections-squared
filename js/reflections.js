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
		var column1 = d3.select("#column1");
		var column2 = d3.select("#column2");
		top_affiliations(column2, years, 5);
		degree_types(column1, years);
	sex_chart(column1, years)
	top_degrees_from(column2,years,5);
	topic_list(column1,years);


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
function sex_data(years) {
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
	return data;
}

function sex_chart(root,years) {
	var data = sex_data(years);

	var width = 200;

	var height = 200 - 20;

	var radius = 100;

	var margin = 20;

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {return d.count})

	var graph = root.append("div")
		.attr("id", "sex");

	graph.append("h2")
		.text("Speaker Sex");

	var svg = graph.append("svg")
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
			var color = "#6A5ACD";
			if (d.data.name == "F") {
				color =	 "#ffffff";
			}
			return color;
		});

	g.append("text")
		.attr("transform", function(d) {
			return "translate(" + arc.centroid(d) + ")";})
		.attr("dy",".35em")
		.style("text-anchor", "middle")
		.text(function(d) {
			if (d.data.name == "M") {
				return d.data.count + " Men";
			} else {
				return d.data.count + " Women";
			}});
	}

function collapse_speakers(years) {
	var speakers = [];
	for (var year in years) {
		speakers = speakers.concat(years[year].speakers);
	}
	return speakers;
}

function collapse_events(years) {
	var events = [];
	for (var year in years) {
		events = events.concat(years[year].events);
	}
	return events;
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
		.text("Top Affiliated Organizations");

	graph = graph.append("ol");

	graph.selectAll("li")
		.data(data)
		.enter()
		.append("li")
		.text(function(d) { return d.name + " " + d.count})
}

function top_degrees_from(root, years, number) {
	var schools = {};
	var speakers = collapse_speakers(years);
	speakers.forEach(function(speaker) {
		if (speaker.degree_from != null) {
			if (schools.hasOwnProperty(speaker.degree_from)) {
				schools[speaker.degree_from]++;
			} else {
				schools[speaker.degree_from] = 1;
			}
		}
	});

	var data = [];
	for (var key in schools) {
		var count = schools[key];
		data.push({name: key, count: count})
	}

	data.sort(function (a, b) { return b.count - a.count; });
	data = data.slice(0, number);
	var graph = root.append("div")
		.attr("id", "degrees_from");

	graph.append("h2")
		.text("Most Degrees From");

	graph = graph.append("ol");

	graph.selectAll("li")
		.data(data)
		.enter()
		.append("li")
		.text(function(d) { return d.name + " " + d.count})
}

function topic_list(root, years) {
	console.log("topic list")
	var events = collapse_events(years);
	var topics = {};
	events.forEach(function(e) {
		if (e.topic != null) {
			e.topic.forEach(function(t) {
				if (topics.hasOwnProperty(t)) {
					topics[t]++;
				} else {
					topics[t] = 1;
				}
			});
		}
	});
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

	data.sort(function (a, b) { return b.count - a.count });

	var graph = root.append("div")
		.attr("id", "degrees");

	graph.append("h2")
		.text("Degree Types");

	var max_width = 300 // chart width (only for bars, not labels)
	var bar_height = 20;
	var text_padding = 50;
	var x = d3.scale.linear()
		.domain([0, d3.max(data, function(d) { return d.count; })])
		.range([0, max_width]);

	chart = graph.append("svg")
		.attr("width", max_width + text_padding + 20)
		.attr("height", data.length*bar_height);

	//Bars
	chart.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("y", function(d, i) { return i * bar_height})
		.attr("x", function(d) { return text_padding + max_width - x(d.count)})
		.attr("width", function(d) { return x(d.count);})
		.attr("height", bar_height)
		.text(function(d) { return d.name; });

	// Bar Chart Labels
	chart.selectAll("text.labels")
		.data(data)
		.enter()
		.append("text")
		.attr("class", "labels")
		.attr("x", 3)
		.attr("y", function(d, i) { return i*bar_height +  bar_height/2})
		.attr("dy", ".35em") // vertical-align: middle
		.text(function(d) { return d.name; });

	// Bar Chart counts
	chart.selectAll("text.counts")
		.data(data)
		.enter()
		.append("text")
		.attr("class", "counts")
		.attr("x", text_padding + max_width + 5)
		.attr("y", function(d, i) { return i * bar_height + bar_height /2;})
		.attr("dy", ".35em") // vertical-align: middle
		.text(function(d) { return d.count; });
}
