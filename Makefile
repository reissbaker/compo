public/build/seine.js:
	mkdir -p public/build/
	cat \
		index.js \
		lib/base/runqueue.js \
		lib/base/component.js \
		lib/engine/runloop/runner.js \
		lib/engine/runloop/loop.js \
		lib/engine/kernel.js \
		lib/engine/engine.js \
		> $@

public/build/demo.js:
	mkdir -p public/build/
	cat \
		demo/index.js \
		demo/engine-components/*.js \
		demo/graphics-components/renderer.js \
		demo/graphics-components/graphics.js \
		demo/components/*.js \
		demo/npc.js \
		demo/player.js \
		demo/world.js \
		demo/main.js \
		> $@

public/build/seine.min.js: public/build/seine.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

public/build/demo.min.js: public/build/demo.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

public/build/seine.min.js.gz: public/build/seine.min.js
	gzip -c $< > $@

public/build/demo.min.js.gz: public/build/demo.min.js
	gzip -c $< > $@

.PHONY: build-seine
build-seine: public/build/seine.js public/build/seine.min.js public/build/seine.min.js.gz

.PHONY: build-demo
build-demo: public/build/demo.js public/build/demo.min.js public/build/demo.min.js.gz

.PHONY: build
build: build-seine build-demo

.PHONY: clean
clean:
	rm -rf public/build/

.PHONY: rebuild
rebuild: clean build
