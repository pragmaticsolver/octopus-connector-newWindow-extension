browserify='./node_modules/browserify/bin/cmd.js'

all: \
	dist/ \
	dist/popup.js \
	dist/background.js \
	dist/content-script.js \
	dist/popup.html \
	dist/jquery-3.4.1.min.js \
	dist/manifest.json \
	dist/css dist/img

dist/:
	mkdir -p dist

clean:
	rm -rf dist 
	find . -type f | grep "~$$" | grep -v 'node_modules' | xargs rm -f

dist/popup.js: src/popup.js
	$(browserify) src/popup.js -o dist/popup.js

dist/background.js: src/background.js
	$(browserify) src/background.js -o dist/background.js

dist/content-script.js: src/content-script.js
	$(browserify) src/content-script.js -o dist/content-script.js

dist/popup.html: src/popup.html
	cp src/popup.html dist/popup.html

dist/jquery-3.4.1.min.js: src/jquery-3.4.1.min.js
	cp src/jquery-3.4.1.min.js dist/jquery-3.4.1.min.js

dist/manifest.json: manifest.json
	cp manifest.json dist/manifest.json

dist/css: src/css
	cp -r src/css dist/

dist/img: src/img
	cp -r src/img dist/

