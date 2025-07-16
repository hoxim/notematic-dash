# Makefile for Notematic Dash - common commands

# Build the dashboard (TypeScript + Vite)
build:
	npm run build

# Clean build artifacts
clean:
	rm -rf dist

# Generate version.js with version, date, time, and git hash
generate-version:
	@VERSION=$$(node -p "require('./package.json').version") && \
	DATE=$$(date +"%Y.%m.%d") && \
	TIME=$$(date +"%H:%M:%S") && \
	HASH=$$(git rev-parse --short HEAD) && \
	echo "export const version = 'v$${VERSION} | $${DATE} | $${TIME} | $${HASH}';" > src/version.js

# Preview the built dashboard
preview:
	npm run preview

# Bump patch version, then generate version.js
bump-patch:
	npm version patch --no-git-tag-version
	$(MAKE) generate-version

# Bump minor version, then generate version.js
bump-minor:
	npm version minor --no-git-tag-version
	$(MAKE) generate-version

# Bump major version, then generate version.js
bump-major:
	npm version major --no-git-tag-version
	$(MAKE) generate-version

.PHONY: build clean generate-version preview 