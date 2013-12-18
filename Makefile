#!/bin/bash

# modified from a superb post found on http://sergimansilla.com/blog/test-coverage-node/

# node executables locally installed
MOCHA=node_modules/.bin/mocha
ISTANBUL=node_modules/.bin/istanbul

# source directory or file
SOURCE="index.js"
# test file name pattern
TESTS_PATTERN="*.js"

# test files to be executed
TESTS=$(shell find test/ -name $(TESTS_PATTERN) | sort)
# directory where coverage report is stored once generated
REPORTS="coverage-report"
# the backup copy of original code
ORIGINAL=$(SOURCE)-original
# the instrumented version of the code
COVERAGE=$(SOURCE)-coverage

default:
	@echo "Specify an action."
	@exit 1

coverage:
	@echo "Ensuring all tests succeed..."
	@make test-once || (echo "Some test did not succeed. Abort" && exit 1)
	@echo "Ensuring lcov is present..."
	@type lcov >/dev/null 2>&1\
	 && echo "lcov present."\
	 || (echo "lcov not present.\nrun apg-get install lcov" && exit 1)
	@echo "Going to instrument code with istanbul..."
	@$(ISTANBUL) instrument --output $(COVERAGE) $(SOURCE)
	@echo "Generating coverage report with istanbul..."
	@mv $(SOURCE) $(ORIGINAL) && mv $(COVERAGE) $(SOURCE)
	@ISTANBUL_REPORTERS=lcovonly $(MOCHA) -R mocha-istanbul $(TESTS)
	@echo "Moving report to '$(REPORTS)' and removing instrumented code..."
	@test -d $(REPORTS) || mkdir $(REPORTS)
	@mv lcov.info $(REPORTS)/
	@rm -rf $(SOURCE) && mv $(ORIGINAL) $(SOURCE)
	@echo "Generating html report..."
	@genhtml $(REPORTS)/lcov.info --output-directory $(REPORTS)/
	@echo "Opening html report..."
	@google-chrome $(REPORTS)/index.html

clean:
	@echo "Deleting '$(REPORTS)' directory"
	@rm -rf $(REPORTS)

test:
	@$(MOCHA) -R min --bail --watch $(TESTS)

test-once:
	@$(MOCHA) -R progress --bail $(TESTS)

show-test-files:
	@echo $(TESTS) | tr " " "\n"

.PHONY: coverage clean test show-test-files
