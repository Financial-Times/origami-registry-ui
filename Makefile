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
EXPECTED_COVERAGE = 85

