# Origami Service Makefile
# ------------------------
# This section of the Makefile should not be modified, it includes
# commands from the Origami service Makefile.
# https://github.com/Financial-Times/origami-service-makefile
-include node_modules/@financial-times/origami-service-makefile/index.mk
# [edit below this line]
# ------------------------

# Configuration
# -------------

INTEGRATION_TIMEOUT = 10000
INTEGRATION_SLOW = 2000

SERVICE_NAME = Origami Registry UI
SERVICE_SYSTEM_CODE = origami-registry-ui
SERVICE_SALESFORCE_ID = $(SERVICE_NAME)

HEROKU_APP_QA = $(SERVICE_SYSTEM_CODE)-qa
HEROKU_APP_EU = $(SERVICE_SYSTEM_CODE)-eu
HEROKU_APP_US = $(SERVICE_SYSTEM_CODE)-us
GRAFANA_DASHBOARD = $(SERVICE_SYSTEM_CODE)

export GITHUB_RELEASE_REPO := Financial-Times/$(SERVICE_SYSTEM_CODE)

build: check-for-bower-components
ifeq ($(NODE_ENV), production)
	@npx origami-build-tools build --build-folder="./public/" --sass="./src/main.scss" --js="./src/main.js" --production
else
	@npx origami-build-tools build --build-folder="./public/" --sass="./src/main.scss" --js="./src/main.js"
endif

check-for-bower-components:
ifeq (,$(wildcard ./bower_components))
	@echo "now bower_components found, installing..."
	@npx origami-build-tools install
else
	@echo "bower_components found, no need to install"
endif

clean-bower-components:
	@rm -rf bower_components/
