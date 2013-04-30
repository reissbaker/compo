public/build/seine.js:
	mkdir -p public/build/
	cat index.js > $@
	cat \
		lib/containers/runqueue.js \
		lib/component.js \
		lib/containers/componentlist.js \
		lib/scenenode.js \
		lib/runloop/runner.js \
		lib/runloop/loop.js \
		lib/engine.js \
		>> $@

public/build/seine.min.js: public/build/seine.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

public/build/seine.min.js.gz: public/build/seine.min.js
	gzip -c $< > $@

.PHONY: build
build: public/build/seine.js public/build/seine.min.js public/build/seine.min.js.gz

.PHONY: clean
clean:
	rm -rf build/

.PHONY: rebuild
rebuild: clean build
