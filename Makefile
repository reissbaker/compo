#
# Vars
# ------------------------------------------------------------------------------

REPORTER = dot
SLOW = 300
TIMEOUT = 600

BUILD_DIR=build
ASSET_DIR=assets
ASSET_BUILD_DIR=$(BUILD_DIR)/assets
LIB_DIR=$(BUILD_DIR)/lib


#
# Files
# ------------------------------------------------------------------------------

$(LIB_DIR)/index.js:
	mkdir -p $(LIB_DIR)
	./node_modules/.bin/tsc  \
		-m commonjs \
		--declaration \
		--outDir $(LIB_DIR) \
		--noImplicitAny \
		-t ES5 \
		typescript/index.ts

$(BUILD_DIR)/compo.js: $(LIB_DIR)/index.js
	mkdir -p $(BUILD_DIR)
	./node_modules/.bin/browserify \
		-o $@ \
		-r ./$(LIB_DIR)/index.js:compo \
		$(LIB_DIR)/index.js

$(BUILD_DIR)/demo.js:
	mkdir -p $(BUILD_DIR)
	./node_modules/.bin/browserify \
		-x compo \
		-o $@ \
		demo/index.js

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

$(ASSET_BUILD_DIR)/level1.png: $(ASSET_DIR)/level1.png
	mkdir -p $(ASSET_BUILD_DIR)
	pngcrush -rem gAMA -rem cHRM -rem iCCP -rem sRGB $< $@




#
# Commands
# ------------------------------------------------------------------------------

.PHONY: build-test
build-test:
	@rm -f $(find test/ -name '*.js')
	@node_modules/.bin/coffee -c test/

.PHONY: run-test
run-test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--recursive \
		--reporter $(REPORTER) \
		--slow $(SLOW) \
		--timeout $(TIMEOUT) \
		test/

.PHONY: build-compo
build-compo: $(BUILD_DIR)/compo.js \
	$(BUILD_DIR)/compo.min.js \
	$(BUILD_DIR)/compo.min.js.gz

.PHONY: build-demo
build-demo: $(BUILD_DIR)/demo.js \
	$(BUILD_DIR)/demo.min.js \
	$(BUILD_DIR)/demo.min.js.gz \
	$(ASSET_BUILD_DIR)/level1.png

.PHONY: build
build: build-compo build-demo

.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

.PHONY: rebuild
rebuild: clean build

.PHONY: test
test: rebuild build-test run-test
