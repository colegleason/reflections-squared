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

function load_speakers() {
    d3.json("data.json", function(error, json) {
        if (error) return console.warn(error);
        var data = json;
        var content = d3.select("#content");
        var year = get_param("year");
        var years = data.years;
        if (year != "") {
            console.log("Year: " + year);
            years = [data.years[year]];
        }
        top_affiliations(content, years, 5);
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
        if (affiliations.hasOwnProperty(speaker.affiliation)) {
            affiliations[speaker.affiliation]++;
        } else {
            affiliations[speaker.affiliation] = 1;
        }
    });

    var data = [];
    for (var key in affiliations) {
        var count = affiliations[key];
        data.push({name: key, count: count})
    }

    data.sort(function (a, b) { return b.count - a.count; });

    var graph = root.append("div")
        .attr("id", "affiliations")
        .append("ol");

    graph.selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .text(function(d) { return d.name + " " + d.count})
}
