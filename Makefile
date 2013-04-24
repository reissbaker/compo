build/seine.js:
	mkdir -p build/
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

build/seine.min.js: build/seine.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

build/seine.min.js.gz: build/seine.min.js
	gzip -c $< > $@

.PHONY: build
build: build/seine.js build/seine.min.js build/seine.min.js.gz

.PHONY: clean
clean:
	rm -rf build/

.PHONY: rebuild
rebuild: clean build
