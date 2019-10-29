var page = require('webpage').create(),
    system = require('system'),
    address, output, size;

if (system.args.length < 3 || system.args.length > 5) {
    console.log('Usage: rasterize.js URL filename [paperwidth*paperheight|paperformat] [zoom]');
    console.log('  paper (pdf output) examples: "5in*7.5in", "10cm*20cm", "A4", "Letter"');
    phantom.exit(1);
} else {
    address = system.args[1];
    output = system.args[2];

    if (system.args.length > 3 && system.args[2].substr(-4) === ".pdf") {
        size = system.args[3].split('*');
        page.paperSize = size.length === 2 ? { width: size[0], height: size[1], margin: '0px' }
                                           : { format: system.args[3], orientation: 'portrait', margin: '0px' };

                var QTSizes = new QTPaperSize();
                if (QTSizes[size[0]]) {
                        // We have a paper size that QT knows; translate string name into 
                        // dimensions in mm, and then into px
                        var paperSizeMM = QTSizes[size[0]]

                        console.log('Found QT paper size ' + size[0]  + ' width (mm): ' + paperSizeMM.x + '; height (mm): ' + paperSizeMM.y);

                        // Comment next to this const in webpage.cpp says it should be different
                        // on different OS', but I don't see any code to actually do that...
                        var PHANTOMJS_PDF_DPI = 72;
                        //var PHANTOMJS_PDF_DPI = 300;

                        // Convert to px
                        var paperSizePX = new PaperSize(
                                mm2px(paperSizeMM.x, PHANTOMJS_PDF_DPI), 
                                mm2px(paperSizeMM.y, PHANTOMJS_PDF_DPI)
                                );

                        console.log('Converted to pixels width: ' + paperSizePX.x + '; height: ' + paperSizePX.y);

                        page.viewportSize = { width: paperSizePX.x, height: paperSizePX.y };
                }
                else
                {
                        console.log('Could not find QT paper size');
                        page.viewportSize = { width: 600, height: 600 };
                }
    }

    if (system.args.length > 4) {
        page.zoomFactor = system.args[4];
    }
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        } else {
            window.setTimeout(function () {
                page.render(output);
                phantom.exit();
            }, 200);
        }
    });
}

// "Enum" of paper sizes, in mm; transcribed from qprinter.h/qprinter.cpp
function QTPaperSize()
{
        this.A4 = new PaperSize(210, 297);
        this.B5 = new PaperSize(176, 250);
        this.Letter = new PaperSize(215.9, 279.4);
        this.Legal = new PaperSize(215.9, 355.6);
        this.Executive = new PaperSize(190.5, 254);
        this.A0 = new PaperSize(841, 1189);
        this.A1 = new PaperSize(594, 841);
        this.A2 = new PaperSize(420, 594);
        this.A3 = new PaperSize(297, 420);
        this.A5 = new PaperSize(148, 210);
        this.A6 = new PaperSize(105, 148);
        this.A7 = new PaperSize(74, 105);
        this.A8 = new PaperSize(52, 74);
        this.A9 = new PaperSize(37, 52);
        this.B0 = new PaperSize(1000, 1414);
        this.B1 = new PaperSize(707, 1000);
        this.B10 = new PaperSize(31, 44);
        this.B2 = new PaperSize(500, 707);
        this.B3 = new PaperSize(353, 500);
        this.B4 = new PaperSize(250, 353);
        this.B6 = new PaperSize(125, 176);
        this.B7 = new PaperSize(88, 125);
        this.B8 = new PaperSize(62, 88);
        this.B9 = new PaperSize(33, 62);
        this.C5E = new PaperSize(163, 229);
        this.Comm10E = new PaperSize(105, 241);
    this.DLE = new PaperSize(110, 220);
        this.Folio = new PaperSize(210, 330);
        this.Ledger = new PaperSize(431.8, 279.4);
        this.Tabloid = new PaperSize(279.4, 431.8);
}

// Helper function
function PaperSize(x, y)
{
        this.x = x;
        this.y = y;
}

function mm2px(mm, DPI)
{
        // Dots per mm
        var DPMM = DPI / 2.54 / 10;
        return mm * DPMM;
}
