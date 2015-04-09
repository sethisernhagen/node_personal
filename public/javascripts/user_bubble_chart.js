var root;
var rootUpdated;
var pack = null;
var nodes;
var circle = null;
var node = null;
var raw;
var text = null
var chartIsFiltered = false;
var view;
var k;
var focus;
var firmTotal = null,
    userTotal = null,
    firmTotalActive = null,
    userTotalActive = null;

//change counts on zoom out
function showAdimCount() {
    var fTotal;
    var uTotal;
    
    if (chartIsFiltered) {
        fTotal = firmTotalActive;
        uTotal = userTotalActive;
    }
    else {
        fTotal = firmTotal;
        uTotal = userTotal;
    }
    
    document.getElementById("dyno-counts").innerHTML = "<div id='numFirms' class='adoption-count'>" + fTotal + "</div><div class='adoption-count-description'>FIRMS</div><div id='numUsers' class='adoption-count  adoption-users-count-margin'>" + uTotal + "</div><div class='adoption-count-description'>USERS</div>";
}

function chart(config) {
    
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .html(function (d) {
        
        var userText = "user";
        var numUsers;
        
        if (chartIsFiltered)
            numUsers = d.sizeLoggedIn;
        else
            numUsers = d.size;
        
        if (numUsers > 1) {
            userText = userText + "s";
        }
        
        return "<strong>" + d.name + "</strong><br />" + numUsers + " " + userText + ".";
    });
    
    var edges = null,
        rScale = null;
    
    
    var color = d3.scale.linear()
        .domain([-1, 5])
        .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
        .interpolate(d3.interpolateHcl);
    
    var opts = {
        lines: 13, // The number of lines to draw
        length: 40, // The length of each line
        width: 5, // The line thickness
        radius: 21, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        direction: 1, // 1: clockwise, -1: counterclockwise
        color: '#000', // #rgb or #rrggbb or array of colors
        speed: 1, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: false, // Whether to render a shadow
        hwaccel: false, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: '50%', // Top position relative to parent
        left: '50%' // Left position relative to parent
    };
    var target = document.getElementById('main');
    var spinner = new Spinner(opts).spin(target);
    
    function hasChildren(element) {
        return element.size > 0;
    }
    
    function getData() {
        d3.json(config.dataUrl, function (error, json) {
            if (error) return console.warn(error);
            
            //filter firms missing children
            json.children = json.children.filter(hasChildren);
            
            root = json;
            
            spinner.stop();
            
            visualizeit();
        });
    }
    
    function visualizeit() {
        
        pack = d3.layout.pack()
            .padding(5)
            .size([config.diameter - config.margin, config.diameter - config.margin])
            .value(function (d) { return d.size; });
        
        svg = d3.select("#chart")
            .append("svg")
            .attr("width", config.diameter)
            .attr("height", config.diameter)
            .append("g")
            .attr("transform", "translate(" + config.diameter / 2 + "," + config.diameter / 2 + ")")
            .call(tip);
        
        focus = root;
        
        firmTotal = d3.sum(pack.nodes(root), function (d) { return d.parent === root; }).toString();
        
        firmTotalActive = d3.sum(pack.nodes(root),
            function (d) {
            return d.parent === root && d.sizeLoggedIn > 0;
        }).toString();
        
        userTotal = d3.sum(root.children, function (d) { return d.size; });
        
        userTotalActive = d3.sum(root.children,
            function (d) {
            return d.sizeLoggedIn;
        });
        
        showAdimCount();
        
        circle = svg.selectAll("circle")
            .data(pack.nodes(root))
            .enter().append("circle")
            .attr("class", function (d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
            .on("click", function (d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); })
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);
        
        text = svg.selectAll("text")
            .data(pack.nodes(root))
            .enter().append("text")
            .attr("class", "label")
            .style("fill-opacity", 0)
            .style("display", "none")
            .text(function (d) {
                if (d.children === undefined)
                    return d.name;//text = name for users
                else
                    return null;
            });
        
        node = svg.selectAll("circle,text");
        
        d3.select("#chart")
                //.style("background", color(-1))
                .on("click", function () { zoom(root); });
        
        zoomTo([root.x, root.y, root.r * 2 + config.margin]);

    }
    
    getData();
    
    d3.select(self.frameElement).style("height", config.diameter + "px");

}

function zoomTo(v) {
    k = config.diameter / v[2];
    view = v;
    node.attr("transform", function (d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function (d) { return d.r * k; });
}

function endall(transition, callback) {
    var n = 0;
    transition
        .each(function () { ++n; })
        .each("end", function () { if (!--n) callback.apply(this, arguments); });
}

//change counts on zoom in
function showFirmCount(firm) {
    
    var userText = "USER";
    var firmSize;
    
    if (chartIsFiltered)
        firmSize = firm.sizeLoggedIn;
    else
        firmSize = firm.size;
    
    if (firmSize > 1) {
        userText = userText + "S";
    }
    
    document.getElementById("dyno-counts").innerHTML = "<div id='firm-name' class='firm-name'>" + firm.name.toUpperCase() + "</div><div id='firm-user-count' class='firm-count firm-count-margin'>" + firmSize.toString() + "</div><div class='adoption-count-description'>" + userText + "</div>";
}

function zoom(d) {
    
    //change counts on zoom in/out
    if (d.parent === root) {
        showFirmCount(d);
        d3.selectAll("node--leaf").style("pointer-events", "none");
        d3.select(".d3-tip").classed("hidden", true);
        d3.select(".node--root").classed({ "node--root-hide": true, "node--root-show": false });
        setTimeout(function () { d3.select("svg").classed({ "svg-show": true }) }, 500);

    }
    else {
        showAdimCount();
        d3.selectAll("node--leaf").style("pointer-events", "all");
        d3.select(".node--root").classed({ "node--root-hide": false, "node--root-show": true });
        d3.select("svg").classed({ "svg-show": false });
    }
    
    var focus0 = focus; focus = d;
    
    var transition = d3.transition()
        .duration(750)
        .tween("zoom", function (d) {
        var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + config.margin]);
        return function (t) { zoomTo(i(t)); };
    })
        .call(endall, function () {
        if (d.parent != root) {
            d3.select(".d3-tip").classed("hidden", false);
        }
    });
    
    
    transition.selectAll("text")
        .filter(function (d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function (d) { return d.parent === focus ? 1 : 0; })
        .each("start", function (d) { if (d.parent === focus) this.style.display = "inline"; })
        .each("end", function (d) { if (d.parent !== focus) this.style.display = "none"; });

}

function filterActive(filterActive) {
    
    //set global variable
    chartIsFiltered = filterActive;
    
    //change counts to reflect filtering
    showAdimCount();
    
    d3.select("svg").classed({ "svg-show": false });
    
    //some strange variables we need
    view = [root.x, root.y, root.r * 2 + config.margin];
    k = config.diameter / view[2];
    
    //change property for pack based on filter
    if (filterActive)
        pack.padding(5).value(function (d) { return d.sizeLoggedIn; });
    else
        pack.padding(5).value(function (d) { return d.size; });
    
    var newPack = pack.nodes(root);
    
    //transition circles
    circle.transition()
    .duration(1500)
    .attr("r", function (d) {
        return d.r * k;
    })
    .attr("class", function (d) {
        if (d.sizeLoggedIn === 0 && filterActive)
            return d.parent ? d.children ? "node hidden" : "node node--leaf hidden" : "node node--root node--root-show";
        else
            return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root node--root-show";
    })
    .attr("transform", function (d) { return "translate(" + (d.x - view[0]) * k + "," + (d.y - view[1]) * k + ")"; });
    
    //transition text
    text.transition()
    .style("fill-opacity", 0)
    .attr("class", function (d) {
        if (d.sizeLoggedIn === 0 && filterActive)
            return "label hidden";
        else
            return "label";
    });
    
    //make sure mouse events are not disabled
    d3.selectAll("node--leaf").style("pointer-events", "all");
    
    //make sure tooltips are visible
    d3.select(".d3-tip").classed("hidden", false);
}