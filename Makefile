.PHONY: all install test serve clean

NPM := pnpm
ifeq (, $(shell which pnpm))
NPM = npm
endif

ifeq ($(shell test -f "$(HOME)/.nvm/nvm.sh"; echo $$?),0)
NVM := source $(HOME)/.nvm/nvm.sh && nvm use &> /dev/null
else
NVM := true
endif

all: serve

install: package-install.lock

package-install.lock: package.json
	$(NVM) && ${NPM} install
	touch package-install.lock

test: install
	$(NVM) && ${NPM} test

serve: install
	$(NVM) && ${NPM} run start:dev

clean:
	rm -rf dist/
	rm -rf node_modules/
	rm -f package-install.lock