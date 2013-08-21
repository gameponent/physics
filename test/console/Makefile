run: clean build
	@node app.js

build: components
	@component build --dev -n geom-console

components: component.json
	@component install --dev

clean:
	rm -fr build components

.PHONY: clean
