function load_speakers() {
    d3.json("data.json", function(error, json) {
        if (error) return console.warn(error);
        var data = json;
        var content = d3.select("#content");
        top_affiliations(content, data.years, 5);
});
}

function load_data() {
	d3.json("data.json", function(error,json)
		if (error) return console.warn(error);
		var data = json;
		var content = d3.select("#years");
		year_list(content, data.years)
);
}

function year_list(root, data) {
	var graph = root.append("div").append("ol");
	graph.selectAll("li")
		.data(data)
		.enter()
		.append("li")
		.text(function(d) {return d});
}

function collapse_speakers(years) {
    var speakers = [];
    for (var year in years) {
        speakers.concat(year.events);
    }
}

function top_affiliations(root, years, number) {
    var affiliations = {};
    for (var year in years) {
        for (var speaker in year) {
            if (affiliations.hasOwnPropery(speaker.affiliation)) {
                affiliations[speaker.affiliation]++;
            } else {
                affiliations[speaker.affiliation] = 1;
            }
        }
    }

    var data = [];
    for (var key in affiliations) {
        var count = affiliations[key];
        data.push({name:key, count: count})
    }
    // this funciton is not complete

    console.log(data);
    var graph = root.append("div").append("ol");

    graph.selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .text(function(d) { return d.name + d.count})

}
