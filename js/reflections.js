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
			sexes[speaker.sex].push(speaker);
		} else {
			sexes[speaker.sex] = [speaker];
		}
	});
	var data = [];
	for (var key in sexes) {
		var count = sexes[key].length;
		data.push({name: key, count: count, speakers: sexes[key]})
	}
	return data;
}

function sex_chart(root,years) {
	var data = sex_data(years);
	var mColor = "#6A5ACD";
	var wColor = "#FFFFFF";
	var width = 300;
	var height = 200 - 20;
	var radius = 100;
	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {return d.count})

	var graph = root.append("div")
		.attr("id", "sex");

	graph.append("h2")
		.text("Sex of Speakers");

	var graph = graph.append("svg")
		.attr("width", width)
		.attr("height", height)
	var svg =  graph.append("g")
		.attr("transform", "translate(" + width/3 + "," + height/2 + ")");

	var g = svg.selectAll(".arc")
		.data(pie(data))
		.enter().append("g")
		.attr("class","arc");

	g.append("path")
		.attr("d",arc)
		.style("fill", function(d) {
			var color = mColor;
			if (d.data.name == "F") {
				color =	 wColor;
			}
			return color;
		})
    .on("click", function(d) {
	if (d.data.name == "F")
	    info_panel_speakers("Women", d.data.speakers)
	else if (d.data.name == "M")
	    info_panel_speakers("Men", d.data.speakers)
    })

	graph.selectAll("text.labels")
		.data(data)
		.enter()
		.append("text")
		.attr("class", "labels")
		.attr("x", 200)
		.attr("y", function(d,i) { return i*20 + 15;})
		.attr("dy", ".35em")
		.style("fill", function(d) {
			var color = mColor;
			if (d.name == "F") {
				color =	 wColor;
			}
			return color;
		})
		.text(function(d) { 
			if (d.name == "F") {
				return d.count + " Women";
			} else {
				return d.count + " Men";
			}
			});
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
				affiliations[speaker.affiliation].push(speaker);
			} else {
				affiliations[speaker.affiliation] = [speaker];
			}
		}
	});

	var data = [];
	for (var key in affiliations) {
		var count = affiliations[key].length;
		data.push({name: key, count: count, speakers: affiliations[key]})
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
	.on("click", function(d) { return info_panel_speakers(d.name, d.speakers)})
}

function top_degrees_from(root, years, number) {
	var schools = {};
	var speakers = collapse_speakers(years);
	speakers.forEach(function(speaker) {
		if (speaker.degree_from != null) {
			if (schools.hasOwnProperty(speaker.degree_from)) {
				schools[speaker.degree_from].push(speaker);
			} else {
				schools[speaker.degree_from] = [speaker];
			}
		}
	});

	var data = [];
	for (var key in schools) {
		var count = schools[key].length;
		data.push({name: key, count: count, speakers: schools[key]})
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
    .on("click", function(d) { return info_panel_speakers(d.name, d.speakers)})
}

function topic_list(root, years) {
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

	var data = [];
	for (var key in topics) {
		var count = topics[key];
		data.push({topic: key, count: count})
	}

	data.sort(function (a,b) { return b.count - a.count});

	var scale = d3.scale.linear()
		.domain([1, d3.max(data, function(d) { return d.count;})])
		.range([12,24]);

	var topics_list = root.append("div")
		.attr("id", "topics")

	topics_list.append("h2")
		.text("Talk Topics");

	topics_list.selectAll("p")
		.data(data)
		.enter()
		.append("p")
		.style("padding-left", "20px")
		.style("font-size", function(d) {return scale(d.count) + "px"})
		.text(function(d) { return d.topic + " " + d.count; })
}

function degree_types(root, years) {
	var speakers = collapse_speakers(years);
	var degrees = {};
	speakers.forEach(function(speaker) {
		if (speaker.degree != null) {
			if (degrees.hasOwnProperty(speaker.degree)) {
				degrees[speaker.degree].push(speaker);
			} else {
				degrees[speaker.degree] = [speaker];
			}
		}
	});


	var data = [];
	for (var key in degrees) {
		var count = degrees[key].length;
		data.push({name: key, count: count, speakers: degrees[key]})
	}

	data.sort(function (a, b) { return b.count - a.count });

	var graph = root.append("div")
		.attr("id", "degrees");

	graph.append("h2")
		.text("Degree Types");

	var max_width = 300 // chart width (only for bars, not labels)
	var bar_height = 20;
	var text_padding = 80;
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
	.on("click", function(d) { return info_panel_speakers(d.name, d.speakers)})

	// Bar Chart Labels
	chart.selectAll("text.labels")
		.data(data)
		.enter()
		.append("text")
		.attr("class", "labels")
		.attr("x", 3)
		.attr("y", function(d, i) { return i*bar_height +  bar_height/2})
		.attr("dy", ".35em") // vertical-align: middle
		.text(function(d) { return d.name; })
	.on("click", function(d) { return info_panel_speakers(d.name, d.speakers)})

	// Bar Chart counts
	chart.selectAll("text.counts")
		.data(data)
		.enter()
		.append("text")
		.attr("class", "counts")
		.attr("x", text_padding + max_width + 5)
		.attr("y", function(d, i) { return i * bar_height + bar_height /2;})
		.attr("dy", ".35em") // vertical-align: middle
		.text(function(d) { return d.count; })
	.on("click", function(d) { return info_panel_speakers(d.name, d.speakers)})
}


function info_panel_speakers(title, speaker_list) {
    var info = d3.select("#info-panel");

    var speakers = speaker_list.sort(function(a, b) {
	if (a.name<b.name) return -1;
	if (a.name>b.name) return 1;
	return 0;
    })

    var dupes = {};
    for (var speaker in speakers) {
    if (!dupes.hasOwnProperty(speaker.name))
	dupes[speaker.name] = true;
	else speakers.splice(speaker, 1);
}

    info.select("h2").remove();
    info.append("h2").text(title);
    info.select("ul").remove();
    info = info.append("ul");

    info = info.selectAll("li")
	.data(speakers);

    info.enter()
	.append("li")
	.text(function(d) { return d.name})

	info.exit().remove();

}
