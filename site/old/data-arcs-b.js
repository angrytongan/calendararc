/*
 * TODO
 * - inner and outer radius calculations - need to pass offsets to each generator.
 * - Add inner chains
 * - add inner chains between month and week
 * - Multiple outer chains
 * - don't display labels that don't fit
 * - styles:
 *   - effective black and white
 */

var degreesToRadians = function(degs) {
    return degs * 3.14159 / 180.0;
};
var radiansToDegrees = function(rads) {
    return 180 * rads / 3.14159;
};
var angle = function(d) {
    return radiansToDegrees((d.startAngle + d.endAngle) / 2);
};

/*
 * http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
 */
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var chartSettings = {
    startAngle: 5,
    endAngle: 355,
    flipAngle: 90, /* angle to flip text around */

    /*
     *     page size      | 300dpi       |  75dpi      | 72dpi (phantomjs pdf renderer?)
     *     ---------------|--------------|-------------|-------------------------------
     * A0: 841mm x 1189mm | 9933 x 14043 | 2483 x 3510 | 2383 x 3370
     * A1: 594mm x 841mm  | 7016 x  9933 | 1754 x 2483 | 1683 x 2383
     * A2: 420mm x 594mm  | 4961 x  7016 | 1240 x 1754 | 1190 x 1683
     * A3: 297mm x 420mm  | 3508 x  4961 |  877 x 1240 |  841 x 1190
     * A4: 210mm x 297mm  | 2480 x  3508 |  620 x  877 |  595 x  841
     */

    /*
     * A4 at 300dpi - generates good A1 print.
     */
    /*
    width: 2480,
    height: 3500,
    innerOffset: 800,
    */

    /*
     * A3 at 300dpi - generates good A0 print.
     */
     /*
    width: 3508,
    height: 4950,
    innerOffset: 0,
    */

    /*
     * This is for square prints.
     */
     width: 3000,
     height: 3000,
     innerOffset: 0,

    title: 'circle calendar test',
    desc: 'Testing the circle calendar generator, built entirely with d3.'
};

/*
 * Generate a year ring.
 */
var generateYears = function(range, innerRadius, outerRadius) {
    var segments = [];
    var dates = range.toDate();
    var startDate = moment(range.toDate()[0]);

    range.by('days', function(moment) {
        var y = moment.year() - startDate.year();
        if (segments[y] === undefined) {
            segments[y] = {
                size: 0,
                text: moment.year()
            };
        }

        segments[y].size++;
    });

    return {
        dx: function(d) { return 0; },
        dy: function(d) { return "1.2em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            var a = angle(d);
            return a < chartSettings.flipAngle || a > (360 - chartSettings.flipAngle) ? "25%" : "75.7%";
        },
        classes: function(d, i, j) {
            return "year year_" + (i == 0 ? "first" : "second");
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments,
    };
};

/*
 * Generate quarter ring.
 */
var generateQuarters = function(range, innerRadius, outerRadius) {
    var segments = [];
    var dates = range.toDate();
    var startDate = moment(range.toDate()[0]);
    var lastQuarter = 0;

    range.by('days', function(moment) {
        if (lastQuarter !== moment.quarter()) {
            segments.push({
                size: 0,
                text: 'QUARTER ' + moment.quarter()
            });
        }
        lastQuarter = moment.quarter();

        segments[segments.length - 1].size++;
    });

    return {
        dx: function(d) { return 0; },
        dy: function(d) { return "1.4em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            var a = angle(d);
            return a < chartSettings.flipAngle || a > (360 - chartSettings.flipAngle) ? "24%" : "74%";
        },
        classes: function(d) {
            return d.data.text.toLowerCase().replace(" ", "_");
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments,
    };
};

var generateMonths = function(range, innerRadius, outerRadius) {
    var segments = [];
    var dates = range.toDate();
    var startDate = moment(range.toDate()[0]);
    var lastMonth = -1;

    range.by('days', function(moment) {
        if (lastMonth !== moment.month()) {
            segments.push({
                size: 0,
                text: moment.format('MMMM')
            });
        }
        lastMonth = moment.month();

        segments[segments.length - 1].size++;
    });

    return {
        dx: function(d) { return 0; },
        dy: function(d) { return "1.3em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            var a = angle(d);
            return a < chartSettings.flipAngle || a > (360 - chartSettings.flipAngle) ? "24%" : "74%";
        },
        classes: function(d) {
            return d.data.text.toLowerCase();
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments,
    };
};

var generateWeeks = function(range, innerRadius, outerRadius) {
    var segments = [];
    var dates = range.toDate();
    var startDate = moment(range.toDate()[0]);
    var lastWeek = 0;

    range.by('days', function(moment) {
        if (lastWeek !== moment.isoWeek()) {
            segments.push({
                size: 0,
                text: 'Week ' + moment.format('W')
            });
        }
        lastWeek = moment.isoWeek();

        segments[segments.length - 1].size++;
    });

    return {
        dx: function(d) { return 0; },
        dy: function(d) { return "1.3em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            var a = angle(d);
            return a < chartSettings.flipAngle || a > (360 - chartSettings.flipAngle) ? "20%" : "70%";
        },
        classes: function(d) {
            return d.data.text.toLowerCase().replace(" ", "_");
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments,
    };
};

var generateDays = function(range, innerRadius, outerRadius) {
    var segments = [];
    var dates = range.toDate();
    var startDate = moment(range.toDate()[0]);
    var lastDay = -1;

    range.by('days', function(moment) {
        if (lastDay !== moment.date()) {
            segments.push({
                size: 0,
                text: moment.format('D')
            });
        }
        lastDay = moment.date();

        segments[segments.length - 1].size++;
    });

    /*
     * startOffset = 85% for facing "right", 35% for facing "left"
     */
    return {
        dx: function(d) { return "0.05em"; },
        dy: function(d) { return "1.0em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return angle(d) < 180 ? "85%" : "35%";
        },
        classes: function(d) {
            return "day_" + d.data.text;
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments,
    };
};

var generateDayOfWeek = function(range, innerRadius, outerRadius) {
    var segments = [];
    var dates = range.toDate();
    var startDate = moment(range.toDate()[0]);
    var lastDay = -1;

    range.by('days', function(moment) {
        if (lastDay !== moment.day()) {
            segments.push({
                size: 0,
                text: moment.format('dd')
            });
        }
        lastDay = moment.day();

        segments[segments.length - 1].size++;
    });

    return {
        dx: function(d) { return "0.05em"; },
        dy: function(d) { return "1.0em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return angle(d) < 180 ? "84%" : "35%";
        },
        classes: function(d) {
            return d.data.text.toLowerCase();
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments,
    };
};

var chain = function(range, innerRadius, outerRadius, chainId) {
    var segments = [];

    range.by('days', function(moment) {
        segments.push({
            size: 1,
            text: chainId
        });
    });

    return {
        dx: function(d) { return "0.05em"; },
        dy: function(d) { return "0.9em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return angle(d) < 180 ? "84%" : "35%";
        },
        classes: function(d) {
            return "chain";
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments
    };
};
var outerChain = function(range, innerRadius, outerRadius, chainId) {
    var segments = [];

    range.by('days', function(moment) {
        segments.push({
            size: 1,
            text: chainId
        });
    });

    return {
        dx: function(d) { return "0.05em"; },
        dy: function(d) { return "1.2em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return angle(d) < 180 ? "88%" : "39%";
        },
        classes: function(d) {
            return "chain";
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments
    };
};
var chainBig = function(range, innerRadius, outerRadius) {
    var segments = [];
    var dates = range.toDate();
    var startDate = moment(range.toDate()[0]);
    var lastDay = -1;

    range.by('days', function(moment) {
        if (lastDay !== moment.day()) {
            segments.push({
                size: 0,
                text: moment.format('dddd LL')
            });
        }
        lastDay = moment.day();

        segments[segments.length - 1].size++;
    });

    return {
        dx: function(d) { return "0em"; },
        dy: function(d) { return "1.1em"; },
        text_anchor: function(d) {
            return angle(d) < 180 ? "start" : "end";
        },
        startOffset: function(d) {
            return angle(d) < 180 ? "53%" : "49.5%";
        },
        classes: function(d) {
            return "chain"
        },
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        segments: segments
    };
};


var generateDaysOfYear = function(range, innerRadius, outerRadius) {
    var segments = [];

    range.by('days', function(moment) {
        segments.push({
            size: 1,
            text: moment.dayOfYear()
        });
    });

    /*
     * startOffset = 85% for facing "right", 35% for facing "left"
     */
    return {
        dx: function(d) { return "0.4em"; },
        dy: function(d) { return "1.5em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return angle(d) < 0 ? "33%" : "82%";
        },
        classes: function(d) {
            return "dayofyear_" + d.data.text;
        },
        innerRadius: 1600,
        outerRadius: 1630,
        segments: segments,
    };
};

var generateDataset = function(start, end, innerRadius, outerRadius) {
    start = start === "" ? moment() : moment(start, "YYYYMMDD");
    end = end === "" ? moment(start).add(1, 'y').subtract(1, 'days') : moment(end, "YYYYMMDD");

    if (end.isBefore(start)) {                  /* order correctly */
        var tmp = end;
        end = start;
        start = tmp;
    }

    var range = moment().range(start, end);     /* restrict maximum number of days */
    if (range.diff('days') > 366) {
        end = moment(start).add(1, 'y').subtract(1, 'days');
        range = moment().range(start, end);
    }

    console.log("start: " + start.format());
    console.log("end: " + end.format());
    console.log("range (days): " + range.diff('days'));

    var numdays = 0;
    range.by('days', function(moment) {
        numdays++;
    });
    console.log("day count: " + numdays);

    return {
        years:      generateYears(range, 600, 650),
        quarters:   generateQuarters(range, 650, 700),
        chain9:     chain(range, 700, 715, 9),
        chain8:     chain(range, 715, 730, 8),
        chain7:     chain(range, 730, 745, 7),
        chain6:     chain(range, 745, 760, 6),
        chain5:     chain(range, 760, 775, 5),
        chain4:     chain(range, 775, 790, 4),
        chain3:     chain(range, 790, 805, 3),
        chain2:     chain(range, 805, 820, 2),
        chain1:     chain(range, 820, 835, 1),
        chain0:     chain(range, 835, 850, 0),
        innerdays:  generateDays(range, 850, 875),
        months:     generateMonths(range, 875, 925),
        weeks:      generateWeeks(range, 925, 950),
        days:       generateDays(range, 950, 975),
        daysOfWeek: generateDayOfWeek(range, 975, 1000),
        chainBig:     chainBig(range, 1000, 1390),
        /* daysOfYear: generateDaysOfYear(range), */
        /*
        outerChain0: outerChain(range, 1000, 1015, 'a'),
        outerChain1: outerChain(range, 1015, 1030, 'b'),
        outerChain2: outerChain(range, 1030, 1045, 'c'),
        outerChain3: outerChain(range, 1045, 1060, 'd'),
        outerChain4: outerChain(range, 1060, 1075, 'e'),
        outerChain5: outerChain(range, 1075, 1090, 'f'),
        outerChain6: outerChain(range, 1090, 1105, 'g'),
        outerChain7: outerChain(range, 1105, 1120, 'h'),
        outerChain8: outerChain(range, 1120, 1135, 'i'),
        outerChain9: outerChain(range, 1135, 1150, 'j'),
        outerChain10: outerChain(range, 1150, 1165, 'k'),
        outerChain11: outerChain(range, 1165, 1180, 'l'),
        outerChain12: outerChain(range, 1180, 1195, 'm'),
        outerChain13: outerChain(range, 1195, 1210, 'n'),
        outerChain14: outerChain(range, 1210, 1225, 'o'),
        outerChain15: outerChain(range, 1225, 1240, 'p'),
        outerChain16: outerChain(range, 1240, 1255, 'q'),
        outerChain17: outerChain(range, 1255, 1270, 'r'),
        outerChain18: outerChain(range, 1270, 1285, 's'),
        outerChain19: outerChain(range, 1285, 1300, 't'),
        outerChain20: outerChain(range, 1300, 1315, 'u'),
        outerChain21: outerChain(range, 1315, 1330, 'v'),
        outerChain22: outerChain(range, 1330, 1345, 'w'),
        outerChain23: outerChain(range, 1345, 1360, 'x'),
        outerChain24: outerChain(range, 1360, 1375, 'y'),
        outerChain25: outerChain(range, 1375, 1390, 'z'),
        */
    };
};

d3.select('head')
    .append('link')
    .attr("rel", "stylesheet")
    .attr("type", "text/css")
    .attr("href", "style/" + (getParameterByName('style') ? getParameterByName('style') : "basic") + ".css");

var dataset = generateDataset(getParameterByName('start'), getParameterByName('end'));

var svg = d3.select('body')
    .append('svg')
    .attr('id', 'calendar')
    .attr('width', chartSettings.width)
    .attr('height', chartSettings.height);

svg.append('title').text(chartSettings.title);
svg.append('description').text(chartSettings.desc);
d3.select('head')
    .append('title')
        .text(chartSettings.title);

svg = svg.append('g')
        .attr('transform', 'translate(' + chartSettings.width / 2 + ', ' + chartSettings.height / 2 + ')');

/*
 * Create a group for each tuple in dataset - these are our rings.
 */
var gs = svg.selectAll("g")
    .data(d3.values(dataset))
    .enter()
        .append("g")
        .attr("class", function(d, i) {
            return "ring " + d3.keys(dataset)[i];
        });
/*
gs.attr("transform", function(d) {
    return "rotate(90)";
});
*/

/*
 * Setup the arc generator and the layout.
 */
var arc = d3.svg.arc();
var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.size })
    .startAngle(degreesToRadians(chartSettings.startAngle))
    .endAngle(degreesToRadians(chartSettings.endAngle));

/*
 * Create groups for containing each segment and text.
 */
var g = gs.selectAll("g")
    .data(function(d) { return pie(d.segments); })
    .enter()
        .append("g")
            .attr("class", "segments");

/*
 * Setup the segments...
 */
var path = g.append("path")
    .attr("d", function(d, i, j) {
        var ring = dataset[d3.keys(dataset)[j]];

        return arc
            .innerRadius(chartSettings.innerOffset + ring.innerRadius)
            .outerRadius(chartSettings.innerOffset + ring.outerRadius)
            (d);
    })
    .attr("id", function(d, i, j) {
        return "segment_" + i + "_" + j;
    })
    .attr("class", function(d, i, j) {
        var ring = dataset[d3.keys(dataset)[j]];
        return "segment " + ring.classes(d, i, j);
    });

/*
 * ... and the text for each segment.
 */
var groupText = g.append("text")
    .attr("text-anchor", function(d, i, j) {
        var ring = dataset[d3.keys(dataset)[j]];
        return ring.text_anchor(d);
    })
    .attr("dx", function(d, i, j) {
        var ring = dataset[d3.keys(dataset)[j]];
        return ring.dx(d);
    })
    .attr("dy", function(d, i, j) {
        var ring = dataset[d3.keys(dataset)[j]];
        return ring.dy(d);
    });

groupText.append("textPath")
        .attr("startOffset", function(d, i, j) {
            var ring = dataset[d3.keys(dataset)[j]];
            return ring.startOffset(d);
        })
        .attr("xlink:href", function(d, i, j) {
            return "#segment_" + i + "_" + j;
        })
        .text(function(d) {
            return d.data.text;
        });

/*
 * Dump labels that are too long to fit the arc.
 */
groupText.filter(function(d, i, j) {
    return path[j][i].getTotalLength() / 2 - 16 < this.getComputedTextLength();
}).remove();

/*
 * Create the legend. FIXME This is garbage, fix this.
 */
if (1) {
var legend_dataset = {
    year: {
        segments: [{ size: 1, text: 'year' }],
        innerRadius: 600,
        outerRadius: 650,
        dx: function(d) { return 0; },
        dy: function(d) { return "2.0em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "17%";
        },
    },
    quarters: {
        segments: [{ size: 1, text: 'quarters' }],
        innerRadius: 650,
        outerRadius: 700,
        dx: function(d) { return 0; },
        dy: function(d) { return "2.0em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "18%";
        },
    },
    chain9: {
        segments: [{ size: 1, text: '9' }],
        innerRadius: 700,
        outerRadius: 715,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain8: {
        segments: [{ size: 1, text: '8' }],
        innerRadius: 715,
        outerRadius: 730,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain7: {
        segments: [{ size: 1, text: '7' }],
        innerRadius: 730,
        outerRadius: 745,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain6: {
        segments: [{ size: 1, text: '6' }],
        innerRadius: 745,
        outerRadius: 760,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain5: {
        segments: [{ size: 1, text: '5' }],
        innerRadius: 760,
        outerRadius: 775,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain4: {
        segments: [{ size: 1, text: '4' }],
        innerRadius: 775,
        outerRadius: 790,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain3: {
        segments: [{ size: 1, text: '3' }],
        innerRadius: 790,
        outerRadius: 805,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain2: {
        segments: [{ size: 1, text: '2' }],
        innerRadius: 805,
        outerRadius: 820,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain1: {
        segments: [{ size: 1, text: '1' }],
        innerRadius: 820,
        outerRadius: 835,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    chain0: {
        segments: [{ size: 1, text: '0' }],
        innerRadius: 835,
        outerRadius: 850,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "end"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    innerdays: {
        segments: [{ size: 1, text: 'date' }],
        innerRadius: 850,
        outerRadius: 875,
        dx: function(d) { return 0; },
        dy: function(d) { return "1.2em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "22%";
        },
    },

    months: {
        segments: [{ size: 1, text: 'months' }],
        innerRadius: 875,
        outerRadius: 925,
        dx: function(d) { return 0; },
        dy: function(d) { return "2.0em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "20%";
        },
    },
    weeks: {
        segments: [{ size: 1, text: 'weeks' }],
        innerRadius: 925,
        outerRadius: 950,
        dx: function(d) { return 0; },
        dy: function(d) { return "1.2em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "22%";
        },
    },
    days: {
        segments: [{ size: 1, text: 'date' }],
        innerRadius: 950,
        outerRadius: 975,
        dx: function(d) { return 0; },
        dy: function(d) { return "1.2em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "22%";
        },
    },
    daysOfWeek: {
        segments: [{ size: 1, text: 'day of week' }],
        innerRadius: 975,
        outerRadius: 1000,
        dx: function(d) { return 0; },
        dy: function(d) { return "1.2em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "22%";
        },
    },
    chainBig: {
        segments: [{ size: 1, text: '' }],
        innerRadius: 1000,
        outerRadius: 1390,
        dx: function(d) { return 0; },
        dy: function(d) { return 0; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "11.5%";
        },
    }
    /*
    outerChain0: {
        segments: [{ size: 1, text: 'a' }],
        innerRadius: 1000,
        outerRadius: 1015,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain1: {
        segments: [{ size: 1, text: 'b' }],
        innerRadius: 1015,
        outerRadius: 1030,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain2: {
        segments: [{ size: 1, text: 'c' }],
        innerRadius: 1030,
        outerRadius: 1045,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain3: {
        segments: [{ size: 1, text: 'd' }],
        innerRadius: 1045,
        outerRadius: 1060,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain4: {
        segments: [{ size: 1, text: 'e' }],
        innerRadius: 1060,
        outerRadius: 1075,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain5: {
        segments: [{ size: 1, text: 'f' }],
        innerRadius: 1075,
        outerRadius: 1090,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain6: {
        segments: [{ size: 1, text: 'g' }],
        innerRadius: 1090,
        outerRadius: 1105,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain7: {
        segments: [{ size: 1, text: 'h' }],
        innerRadius: 1105,
        outerRadius: 1120,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain8: {
        segments: [{ size: 1, text: 'i' }],
        innerRadius: 1120,
        outerRadius: 1135,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain9: {
        segments: [{ size: 1, text: 'j' }],
        innerRadius: 1135,
        outerRadius: 1150,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain10: {
        segments: [{ size: 1, text: 'k' }],
        innerRadius: 1150,
        outerRadius: 1165,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain11: {
        segments: [{ size: 1, text: 'l' }],
        innerRadius: 1165,
        outerRadius: 1180,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain12: {
        segments: [{ size: 1, text: 'm' }],
        innerRadius: 1180,
        outerRadius: 1195,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain13: {
        segments: [{ size: 1, text: 'n' }],
        innerRadius: 1195,
        outerRadius: 1210,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain14: {
        segments: [{ size: 1, text: 'o' }],
        innerRadius: 1210,
        outerRadius: 1225,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain15: {
        segments: [{ size: 1, text: 'p' }],
        innerRadius: 1225,
        outerRadius: 1240,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain16: {
        segments: [{ size: 1, text: 'q' }],
        innerRadius: 1240,
        outerRadius: 1255,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain17: {
        segments: [{ size: 1, text: 'r' }],
        innerRadius: 1255,
        outerRadius: 1270,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain18: {
        segments: [{ size: 1, text: 's' }],
        innerRadius: 1270,
        outerRadius: 1285,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain19: {
        segments: [{ size: 1, text: 't' }],
        innerRadius: 1285,
        outerRadius: 1300,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain20: {
        segments: [{ size: 1, text: 'u' }],
        innerRadius: 1300,
        outerRadius: 1315,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain21: {
        segments: [{ size: 1, text: 'v' }],
        innerRadius: 1315,
        outerRadius: 1330,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain22: {
        segments: [{ size: 1, text: 'w' }],
        innerRadius: 1330,
        outerRadius: 1345,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain23: {
        segments: [{ size: 1, text: 'x' }],
        innerRadius: 1345,
        outerRadius: 1360,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain24: {
        segments: [{ size: 1, text: 'y' }],
        innerRadius: 1360,
        outerRadius: 1375,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    outerChain25: {
        segments: [{ size: 1, text: 'z' }],
        innerRadius: 1375,
        outerRadius: 1390,
        dx: function(d) { return 0; },
        dy: function(d) { return "0.85em"; },
        text_anchor: function(d) { return "middle"; },
        startOffset: function(d) {
            return "44%";
        },
    },
    */
};

/*
 * Setup the pie layout.
 */
var legend_pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.size; })
    .startAngle(degreesToRadians(-chartSettings.startAngle))
    .endAngle(degreesToRadians(360 - chartSettings.endAngle));

/*
 * Create groups for the path and text.
 */
var legend_gs = svg.selectAll('.legend')
    .data(d3.values(legend_dataset))
    .enter()
        .append('g')
        .attr('class', function(d, i) {
            return "legend " + d3.keys(legend_dataset)[i]
        });

var legend_g = legend_gs.selectAll("g")
    .data(function(d) { return legend_pie(d.segments); })
    .enter()
        .append("g")
        .attr('class', 'segments');

/*
 * Setup the segments.
 */
var legend_path = legend_g.append('path')
    .attr("d", function(d, i, j) {
        var ring = legend_dataset[d3.keys(legend_dataset)[j]];

        return arc
            .innerRadius(chartSettings.innerOffset + ring.innerRadius)
            .outerRadius(chartSettings.innerOffset + ring.outerRadius)
            (d);
    })
    .attr("id", function(d, i, j) {
        return "legend_" + i + "_" + j;
    })
    .attr("class", function(d, i, j) {
        return "legend segment " + d.data.text.toLowerCase().replace(" ", "_");
    });

var legend_groupText = legend_g.append("text")
    .attr("text-anchor", function(d, i, j) {
        var ring = legend_dataset[d3.keys(legend_dataset)[j]];
        return ring.text_anchor(d);
    })
    .attr("dx", function(d, i, j) {
        var ring = legend_dataset[d3.keys(legend_dataset)[j]];
        return ring.dx(d);
    })
    .attr("dy", function(d, i, j) {
        var ring = legend_dataset[d3.keys(legend_dataset)[j]];
        return ring.dy(d);
    });

legend_groupText.append("textPath")
    .attr("startOffset", function(d, i, j) {
        var ring = legend_dataset[d3.keys(legend_dataset)[j]];
        return ring.startOffset(d);
    })
    .attr("xlink:href", function(d, i, j) {
        return "#legend_" + i + "_" + j;
    })
    .text(function(d) {
        return d.data.text;
    });
}
