.PHONY: clean help

#DATE = $(shell date +"%Y%m%d")
DATE = "20150301"

BUILDHOST=http://localhost:8000

help:
	@echo "make a-colour.pdf       Generate colour pdf, model A"
	@echo "make b-colour.pdf       Generate colour pdf, model B"
	@echo "make c-colour.pdf       Generate colour pdf, model C"
	@echo "make a-bw.pdf           Generate black and white pdf, model A"
	@echo "make b-bw.pdf           Generate black and white pdf, model B"
	@echo "make c-bw.pdf           Generate black and white pdf, model C"
	@echo "make posters            Create all posters"
	@echo "make www-deploy         Deploy the website to S3"
	@echo "make all                Do everything"

a-colour.pdf:
	phantomjs rasterize.js $(BUILDHOST)/a.html?style=colour-wheel\&start=$(DATE) site/a-colour.pdf A0

b-colour.pdf:
	phantomjs rasterize.js $(BUILDHOST)/b.html?style=colour-wheel\&start=$(DATE) site/b-colour.pdf A0

c-colour.pdf:
	phantomjs rasterize.js $(BUILDHOST)/c.html?style=colour-wheel\&start=$(DATE) site/c-colour.pdf A0

a-bw.pdf:
	phantomjs rasterize.js $(BUILDHOST)/a.html?start=$(DATE) site/a-bw.pdf A0

b-bw.pdf:
	phantomjs rasterize.js $(BUILDHOST)/b.html?start=$(DATE) site/b-bw.pdf A0

c-bw.pdf:
	phantomjs rasterize.js $(BUILDHOST)/c.html?start=$(DATE) site/c-bw.pdf A0

posters: a-colour.pdf b-colour.pdf c-colour.pdf a-bw.pdf b-bw.pdf c-bw.pdf

all: posters

clean:
	rm -f *.pdf
	rm -f site/*.pdf
