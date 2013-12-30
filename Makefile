BUILD_DIR=build
$(BUILD_DIR)/seine.js:
	mkdir -p $(BUILD_DIR)
	cat \
		index.js \
		lib/base/runqueue.js \
		lib/base/dftlist.js \
		lib/base/component.js \
		lib/engine/runloop/runner.js \
		lib/engine/runloop/loop.js \
		lib/engine/kernel.js \
		lib/engine/engine.js \
		> $@

$(BUILD_DIR)/demo.js:
	mkdir -p $(BUILD_DIR)
	cat \
		demo/index.js \
		demo/constants.js \
		demo/data/*.js \
		demo/physics-components/tile-physics.js \
		demo/physics-components/physics-component.js \
		demo/graphics-components/renderer.js \
		demo/graphics-components/graphics.js \
		demo/engine-components/*.js \
		demo/components/*.js \
		demo/game-objects/decorators/*.js \
		demo/game-objects/game-object.js \
		demo/game-objects/player.js \
		demo/game-objects/npc.js \
		demo/game-objects/tile.js \
		demo/world.js \
		demo/main.js \
		> $@

$(BUILD_DIR)/seine.min.js: $(BUILD_DIR)/seine.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

$(BUILD_DIR)/demo.min.js: $(BUILD_DIR)/demo.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

$(BUILD_DIR)/seine.min.js.gz: $(BUILD_DIR)/seine.min.js
	gzip -c $< > $@

$(BUILD_DIR)/demo.min.js.gz: $(BUILD_DIR)/demo.min.js
	gzip -c $< > $@

.PHONY: build-seine
build-seine: $(BUILD_DIR)/seine.js $(BUILD_DIR)/seine.min.js $(BUILD_DIR)/seine.min.js.gz

.PHONY: build-demo
build-demo: $(BUILD_DIR)/demo.js $(BUILD_DIR)/demo.min.js $(BUILD_DIR)/demo.min.js.gz

.PHONY: build
build: build-seine build-demo

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

.PHONY: rebuild
rebuild: clean build
