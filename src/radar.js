// The MIT License (MIT)

// Copyright (c) 2017 Zalando SE

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
import * as d3 from "d3";

export function radar_visualization(config) {
  // custom random number generator, to make random sequence reproducible
  // source: https://stackoverflow.com/questions/521295
  var seed = 42;
  function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function random_between(min, max) {
    return min + random() * (max - min);
  }

  function normal_between(min, max) {
    return min + (random() + random()) * 0.5 * (max - min);
  }

  // radial_min / radial_max are multiples of PI
  let quadrants = [];
  const quadrantSize = 2 / config.quadrants.length;
  for (var i = 0; i < config.quadrants.length; i++) {
    // multiply of pi start
    let radialMin = i * quadrantSize;
    // multiply of pi end
    let radialMax = (i + 1) * quadrantSize;

    // last half of quadrants are negative
    let factorY = i >= config.quadrants.length / 2 ? -1 : 1;
    let quarterSize = config.quadrants.length / 4;
    // first quarter and last quarter are positive
    let factorX =
      i < quarterSize || i >= config.quadrants.length - quarterSize ? 1 : -1;

    // radial values must be between -1 and 1, because they are multiples of pi.
    if (radialMax > 1) {
      radialMax = radialMax - 2;
    }

    if (radialMin >= 1) {
      radialMin = radialMin - 2;
    }

    quadrants.push({
      radial_min: radialMin,
      radial_max: radialMax,
      factor_x: factorX,
      factor_y: factorY,
    });
  }

  let rings = [];
  const maxRadius = 400;
  for (var i = 0; i < config.rings.length; i++) {
    rings.push({
      radius: (maxRadius / config.rings.length) * (i + 1), // cap rings at certain size
    });
  }

  const title_offset = { x: -675, y: -420 };

  const footer_offset = { x: -675, y: 420 };

  const legend_offset = [
    { x: 450, y: 90 },
    { x: -675, y: 90 },
    { x: -675, y: -310 },
    { x: 450, y: -310 },
  ];

  // filter out invalid entries (entries that do not match with the configuration)
  config.entries = config.entries.filter(
    (c) => c.quadrant < config.quadrants.length && c.ring < config.rings.length
  );

  function polar(cartesian) {
    var x = cartesian.x;
    var y = cartesian.y;
    return {
      t: Math.atan2(y, x),
      r: Math.sqrt(x * x + y * y),
    };
  }

  function cartesian(polar) {
    return {
      x: polar.r * Math.cos(polar.t),
      y: polar.r * Math.sin(polar.t),
    };
  }

  function bounded_interval(value, min, max) {
    var low = Math.min(min, max);
    var high = Math.max(min, max);
    return Math.min(Math.max(value, low), high);
  }

  function bounded_ring(polar, r_min, r_max) {
    return {
      t: polar.t,
      r: bounded_interval(polar.r, r_min, r_max),
    };
  }

  function bounded_box(point, min, max) {
    return {
      x: bounded_interval(point.x, min.x, max.x),
      y: bounded_interval(point.y, min.y, max.y),
    };
  }

  function segment(quadrant, ring) {
    var polar_min = {
      t: quadrants[quadrant]?.radial_min * Math.PI,
      r: ring === 0 ? 30 : rings[ring - 1]?.radius,
    };
    var polar_max = {
      t: quadrants[quadrant]?.radial_max * Math.PI,
      r: rings[ring]?.radius,
    };
    var cartesian_min = {
      x: 15 * quadrants[quadrant]?.factor_x,
      y: 15 * quadrants[quadrant]?.factor_y,
    };
    var cartesian_max = {
      x: rings[config.rings.length - 1]?.radius * quadrants[quadrant]?.factor_x,
      y: rings[config.rings.length - 1]?.radius * quadrants[quadrant]?.factor_y,
    };
    return {
      clipx: function(d) {
        var c = bounded_box(d, cartesian_min, cartesian_max);
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.x = cartesian(p).x; // adjust data too!
        return d.x;
      },
      clipy: function(d) {
        var c = bounded_box(d, cartesian_min, cartesian_max);
        var p = bounded_ring(polar(c), polar_min.r + 15, polar_max.r - 15);
        d.y = cartesian(p).y; // adjust data too!
        return d.y;
      },
      random: function() {
        return cartesian({
          t: random_between(polar_min.t, polar_max.t),
          r: normal_between(polar_min.r, polar_max.r),
        });
      },
    };
  }

  // position each entry randomly in its segment
  for (var i = 0; i < config.entries.length; i++) {
    var entry = config.entries[i];
    entry.segment = segment(entry.quadrant, entry.ring);
    var point = entry.segment.random();
    entry.x = point.x;
    entry.y = point.y;
    entry.color =
      entry.active || config.print_layout
        ? config.rings[entry.ring]?.color ?? "#000"
        : config.colors.inactive;
  }

  // partition entries according to segments
  var segmented = new Array(config.quadrants.length);
  for (var quadrant = 0; quadrant < config.quadrants.length; quadrant++) {
    segmented[quadrant] = new Array(config.rings.length);
    for (var ring = 0; ring < config.rings.length; ring++) {
      segmented[quadrant][ring] = [];
    }
  }
  for (var i = 0; i < config.entries.length; i++) {
    var entry = config.entries[i];
    try {
      segmented[entry.quadrant][entry.ring]?.push(entry);
    } catch (err) {
      console.log(
        "Failed to push an entry to the specified quadrant/ring.",
        entry
      );
    }
  }

  // assign unique sequential id to each entry
  var id = 1;
  for (var quadrant = 0; quadrant < config.quadrants.length; quadrant++) {
    for (var ring = 0; ring < config.rings.length; ring++) {
      var entries = segmented[quadrant][ring];
      entries.sort(function(a, b) {
        return a.label.localeCompare(b.label);
      });
      for (var i = 0; i < entries.length; i++) {
        entries[i].id = "" + id++;
      }
    }
  }

  function translate(x, y) {
    return "translate(" + x + "," + y + ")";
  }

  function viewbox(quadrant) {
    return [
      Math.max(0, quadrants[quadrant].factor_x * 400) - 420,
      Math.max(0, quadrants[quadrant].factor_y * 400) - 420,
      440,
      440,
    ].join(" ");
  }

  var svg = d3
    .select("svg#" + config.svg_id)
    .style("background-color", config.colors.background)
    .attr("width", config.width)
    .attr("height", config.height);

  var radar = svg.append("g");
  if ("zoomed_quadrant" in config) {
    svg.attr("viewBox", viewbox(config.zoomed_quadrant));
  } else {
    radar.attr("transform", translate(config.width / 2, config.height / 2));
  }

  var grid = radar.append("g");

  // draw grid lines 
  if (quadrants.length > 1) {
    for (var i = 0; i < quadrants.length; i++) {
      var angle = (360 / quadrants.length) * i;
      var rad = (angle * Math.PI) / 180;
      var r = maxRadius;
      var x = r * Math.cos(rad);
      var y = r * Math.sin(rad);

      grid
        .append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", 0)
        .attr("y2", 0)
        .style("stroke", config.colors.grid)
        .style("stroke-width", 1);
    }
  }

  // background color. Usage `.attr("filter", "url(#solid)")`
  // SOURCE: https://stackoverflow.com/a/31013492/2609980
  var defs = grid.append("defs");
  var filter = defs
    .append("filter")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 1)
    .attr("height", 1)
    .attr("id", "solid");
  filter.append("feFlood").attr("flood-color", "rgb(0, 0, 0, 0.8)");
  filter.append("feComposite").attr("in", "SourceGraphic");

  // draw rings
  for (var i = 0; i < rings.length; i++) {
    grid
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", rings[i].radius)
      .style("fill", "none")
      .style("stroke", config.colors.grid)
      .style("stroke-width", 1);
    if (config.print_layout) {
      grid
        .append("text")
        .text(config.rings[i]?.name)
        .attr("y", -rings[i].radius + 62)
        .attr("text-anchor", "middle")
        .style("fill", "#e5e5e5")
        .style("font-family", "Arial, Helvetica")
        .style("font-size", "42px")
        .style("font-weight", "bold")
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  }

  function legend_transform(quadrant, ring, index = null) {
    var dx = ring < 2 ? 0 : 120;
    var dy = index == null ? -16 : index * 12;
    try {
      if (ring % 2 === 1) {
        dy = dy + 36 + segmented[quadrant][ring - 1].length * 12;
      }
    } catch (err) {
      console.log("error transforming legend.", { segmented, quadrant, ring });
    }
    return translate(
      legend_offset[quadrant]?.x + dx,
      legend_offset[quadrant]?.y + dy
    );
  }

  // draw title and legend (only in print layout)
  if (config.print_layout) {
    // title
    radar
      .append("text")
      .attr("transform", translate(title_offset.x, title_offset.y))
      .text(config.title)
      .style("font-family", "Arial, Helvetica")
      .style("font-size", "34px");

    // footer
    radar
      .append("text")
      .attr("transform", translate(footer_offset.x, footer_offset.y))
      .text("??? moved up     ??? moved down")
      .attr("xml:space", "preserve")
      .style("font-family", "Arial, Helvetica")
      .style("font-size", "10px");

    // legend
    var legend = radar.append("g");
    for (var quadrant = 0; quadrant < config.quadrants.length; quadrant++) {
      legend
        .append("text")
        .attr(
          "transform",
          translate(legend_offset[quadrant]?.x, legend_offset[quadrant]?.y - 45)
        )
        .text(config.quadrants[quadrant].name)
        .style("font-family", "Arial, Helvetica")
        .style("font-size", "18px");
      for (var ring = 0; ring < config.rings.length; ring++) {
        legend
          .append("text")
          .attr("transform", legend_transform(quadrant, ring))
          .text(config.rings[ring].name)
          .style("font-family", "Arial, Helvetica")
          .style("font-size", "12px")
          .style("font-weight", "bold");
        legend
          .selectAll(".legend" + quadrant + ring)
          .data(segmented[quadrant][ring])
          .enter()
          .append("a")
          .attr("href", function(d, i) {
            return d.link ? d.link : "#"; // stay on same page if no link was provided
          })
          .append("text")
          .attr("transform", function(d, i) {
            return legend_transform(quadrant, ring, i);
          })
          .attr("class", "legend" + quadrant + ring)
          .attr("id", function(d, i) {
            return "legendItem" + d.id;
          })
          .text(function(d, i) {
            return d.id + ". " + d.label;
          })
          .style("font-family", "Arial, Helvetica")
          .style("font-size", "11px")
          .on("mouseover", function(d) {
            showBubble(d);
            highlightLegendItem(d);
          })
          .on("mouseout", function(d) {
            hideBubble(d);
            unhighlightLegendItem(d);
          });
      }
    }
  }

  // layer for entries
  var rink = radar.append("g").attr("id", "rink");

  // rollover bubble (on top of everything else)
  var bubble = radar
    .append("g")
    .attr("id", "bubble")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("pointer-events", "none")
    .style("user-select", "none");
  bubble
    .append("rect")
    .attr("rx", 4)
    .attr("ry", 4)
    .style("fill", "#333");
  bubble
    .append("text")
    .style("font-family", "sans-serif")
    .style("font-size", "10px")
    .style("fill", "#fff");
  bubble
    .append("path")
    .attr("d", "M 0,0 10,0 5,8 z")
    .style("fill", "#333");

  function showBubble(d) {
    if (d.active || config.print_layout) {
      var tooltip = d3.select("#bubble text").text(d.label);
      var bbox = tooltip.node().getBBox();
      d3.select("#bubble")
        .attr("transform", translate(d.x - bbox.width / 2, d.y - 16))
        .style("opacity", 0.8);
      d3.select("#bubble rect")
        .attr("x", -5)
        .attr("y", -bbox.height)
        .attr("width", bbox.width + 10)
        .attr("height", bbox.height + 4);
      d3.select("#bubble path").attr(
        "transform",
        translate(bbox.width / 2 - 5, 3)
      );
    }
  }

  function hideBubble(d) {
    var bubble = d3
      .select("#bubble")
      .attr("transform", translate(0, 0))
      .style("opacity", 0);
  }

  function highlightLegendItem(d) {
    var legendItem = document.getElementById("legendItem" + d.id);
    legendItem?.setAttribute("filter", "url(#solid)");
    legendItem?.setAttribute("fill", "white");
  }

  function unhighlightLegendItem(d) {
    var legendItem = document.getElementById("legendItem" + d.id);
    legendItem?.removeAttribute("filter");
    legendItem?.removeAttribute("fill");
  }

  // draw blips on radar
  var blips = rink
    .selectAll(".blip")
    .data(config.entries)
    .enter()
    .append("g")
    .attr("class", "blip")
    .attr("transform", function(d, i) {
      return legend_transform(d.quadrant, d.ring, i);
    })
    .on("mouseover", function(d) {
      showBubble(d);
      highlightLegendItem(d);
    })
    .on("mouseout", function(d) {
      hideBubble(d);
      unhighlightLegendItem(d);
    });

  // configure each blip
  blips.each(function(d) {
    var blip = d3.select(this);

    // blip link
    if (!config.print_layout && d.active && d.hasOwnProperty("link")) {
      blip = blip.append("a").attr("xlink:href", d.link);
    }

    // blip shape
    if (d.moved > 0) {
      blip
        .append("path")
        .attr("d", "M -11,5 11,5 0,-13 z") // triangle pointing up
        .style("fill", d.color);
    } else if (d.moved < 0) {
      blip
        .append("path")
        .attr("d", "M -11,-5 11,-5 0,13 z") // triangle pointing down
        .style("fill", d.color);
    } else {
      blip
        .append("circle")
        .attr("r", 9)
        .attr("fill", d.color);
    }

    // blip text
    if (d.active || config.print_layout) {
      var blip_text = config.print_layout ? d.id : d.label.match(/[a-z]/i);
      blip
        .append("text")
        .text(blip_text)
        .attr("y", 3)
        .attr("text-anchor", "middle")
        .style("fill", "#fff")
        .style("font-family", "Arial, Helvetica")
        .style("font-size", function(d) {
          return blip_text.length > 2 ? "8px" : "9px";
        })
        .style("pointer-events", "none")
        .style("user-select", "none");
    }
  });

  // make sure that blips stay inside their segment
  function ticked() {
    blips.attr("transform", function(d) {
      return translate(d.segment.clipx(d), d.segment.clipy(d));
    });
  }

  // distribute blips, while avoiding collisions
  d3.forceSimulation()
    .nodes(config.entries)
    .velocityDecay(0.19) // magic number (found by experimentation)
    .force(
      "collision",
      d3
        .forceCollide()
        .radius(12)
        .strength(0.85)
    )
    .on("tick", ticked);
}
