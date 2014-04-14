BUILD_DIR=build
$(BUILD_DIR)/compo.js:
	mkdir -p $(BUILD_DIR)
	browserify -o $@ --standalone compo index.js

$(BUILD_DIR)/demo.js:
	mkdir -p $(BUILD_DIR)
	cat \
		demo/index.js \
		demo/constants.js \
		demo/data/*.js \
		demo/physics-components/collidable.js \
		demo/physics-components/physics-component.js \
		demo/physics-components/collision-grid.js \
		demo/physics-components/tile-physics.js \
		demo/graphics-components/frame.js \
		demo/graphics-components/graphic.js \
		demo/graphics-components/tile-graphic.js \
		demo/graphics-components/grid-graphic.js \
		demo/graphics-components/renderer.js \
		demo/engine-components/*.js \
		demo/components/*.js \
		demo/game-objects/decorators/*.js \
		demo/game-objects/game-object.js \
		demo/game-objects/player.js \
		demo/game-objects/npc.js \
		demo/game-objects/level.js \
		demo/world.js \
		demo/main.js \
		> $@

$(BUILD_DIR)/compo.min.js: $(BUILD_DIR)/compo.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

$(BUILD_DIR)/demo.min.js: $(BUILD_DIR)/demo.js
	node_modules/.bin/uglifyjs \
		-m \
		-c warnings=false,unsafe=true \
		$< > $@

$(BUILD_DIR)/compo.min.js.gz: $(BUILD_DIR)/compo.min.js
	gzip -c $< > $@

$(BUILD_DIR)/demo.min.js.gz: $(BUILD_DIR)/demo.min.js
	gzip -c $< > $@

.PHONY: build-compo
build-compo: $(BUILD_DIR)/compo.js $(BUILD_DIR)/compo.min.js \
	$(BUILD_DIR)/compo.min.js.gz

.PHONY: build-demo
build-demo: $(BUILD_DIR)/demo.js $(BUILD_DIR)/demo.min.js \
	$(BUILD_DIR)/demo.min.js.gz

.PHONY: build
build: build-compo build-demo

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

.PHONY: rebuild
rebuild: clean build
