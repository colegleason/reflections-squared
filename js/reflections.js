var data; // a global

function load_speakers() {
    d3.json("speakers.json", function(error, json) {
        if (error) return console.warn(error);
        data = json;

});
}
