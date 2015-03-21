

var width = window.innerWidth
    height = window.innerHeight - 55;

var maxNodes = 100;

var color = d3.scale.category20();

var sizeScale = d3.scale.linear()
    .domain([0, 1])
    .range([1, 100]);

var strokeWidthScale = d3.scale.linear()
    .domain([0, 1])
    .range([1, 50]);

var alphaScale = d3.scale.linear()
    .domain([0, 1])
    .range([.01, 1]);

var counter = 0;

var force = d3.layout.force()
    .size([width, height])
    .nodes([{}])
    .charge(-60)
    .gravity(0)
    .on("tick", tick);

var svg = d3.select("#chart").append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .on("mousemove", mousemove)
    .on("mousedown", mousedown)
    .on("mouseup", mouseup);

var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node");

//default node position to canvas center
var pos = [width / 2, height /2];

function mousemove() {
    pos = d3.mouse(this);
}

function mousedown() {

    // Restart the force layout.
    force.charge(1)
        .gravity(.2)
        .friction(.9)
        .start();
}


function mouseup() {

    // Restart the force layout.
    force.charge(-60)
        .gravity(0)
        .friction(.9)
        .start();
}

setInterval(function () {
    
    var node = {
        x: pos[0] + Math.random(), //randomize pos a tiny amount to keep things calm 
        y: pos[1] + Math.random(),
        r: [sizeScale(Math.random())],
        alpha: [alphaScale(Math.random())],
        strokeWidth: [strokeWidthScale(Math.random())],
        strokeAlpha: [alphaScale(Math.random())]
    };
    nodes[counter % maxNodes] = node;

    counter = counter + 1;
    
    restart();
}, 275);

function tick() {

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}

function restart() {

    node = node.data(nodes);

    node.enter().insert("circle", ".cursor")
        .attr("class", "node")
        .attr("r", function (d, i) { return d.r; })
        .attr("fill", function (d, i) { return color(i); })
        .attr("stroke", function (d, i) { return color(i); })
        .attr("stroke-width", function (d, i) { return d.strokeWidth })
        .attr("stroke-opacity", function (d, i) { return d.strokeAlpha; })
        .attr("fill-opacity", function (d, i) { return d.alpha; })
        .call(force.drag);

    force.start();
}