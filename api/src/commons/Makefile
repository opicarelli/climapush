build-CommonsLayer:
	npm install
	npm run build
	mkdir -p "$(ARTIFACTS_DIR)/nodejs"
#Linux#########
	cp -R ./dist/* "$(ARTIFACTS_DIR)/nodejs/"
#Windows#######
#	xcopy /s .\dist\*.js "$(ARTIFACTS_DIR)\nodejs"