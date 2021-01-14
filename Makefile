.PHONY: help clean clean-pyc release dist

help:
	@echo "clean-build - remove build artifacts"
	@echo "clean-pyc - remove Python file artifacts"
	@echo "release - package and upload a release"
	@echo "dist - package"

clean: clean-build clean-pyc clean-plugin

clean-build:
	rm -fr build/
	rm -fr dist/
	rm -fr dist-packages-cache/
	rm -fr dist-packages-temp/
	rm -fr *.egg-info
	rm -fr .eggs
	rm -fr .cache

clean-pyc:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '*~' -exec rm -f {} +

clean-plugin:
	rm -fr kolibri_explore_plugin/static
	rm -fr kolibri_explore_plugin/build
	rm -fr kolibri_explore_plugin/__pycache__

dev:
	yarn run dev

assets:
	rm -f -r kolibri_explore_plugin/static
	mkdir kolibri_explore_plugin/static

	yarn run clean && yarn run build

dist: clean assets
	python setup.py bdist_wheel --universal

release:
	@ls -l dist/ || (echo "Nothing built, no dist/ so nothing to release" && exit 1)
	@echo "Documentation: See README.rst"
	@echo ""
	@echo ""
	@echo "Quick check list:"
	@echo ""
	@echo "1. Committed CrowdIn translations to repo?"
	@echo "2. Your git repo has no local changes?"
	@echo "3. Ensure that you have built the frontend files using Kolibri"
	@echo "4. Version info bumped in __init__.py"
	@echo "5. Ran 'make assets' to build everything"
	@echo "6. Running 'make dist' to generate a wheel file"
	@echo ""
	@echo "Do you want to upload everything in dist/*?"
	@echo ""
	@echo "CTRL+C to exit. ENTER to continue."
	@read __
	twine upload -s dist/*
