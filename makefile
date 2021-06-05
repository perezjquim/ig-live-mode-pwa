MANIFEST_FILE=webapp/manifest.appcache

main: regen-manifest

regen-manifest:
	echo "CACHE MANIFEST" > $(MANIFEST_FILE)
	echo "#$(shell date)\n" >> $(MANIFEST_FILE)	
	find webapp ! '(' -name '*.appcache' ')' ! '(' -name '*.html' ')' -type f | sed 's/webapp\///g' >> $(MANIFEST_FILE)
	echo "https://openui5.hana.ondemand.com/resources/sap-ui-core.js" >> $(MANIFEST_FILE)
	echo "https://openui5.hana.ondemand.com/resources/sap/ui/core/library-preload.js" >> $(MANIFEST_FILE)
	echo "https://openui5.hana.ondemand.com/resources/sap/ui/layout/library-preload.js" >> $(MANIFEST_FILE)
	echo "https://openui5.hana.ondemand.com/resources/sap/ui/core/messagebundle.properties" >> $(MANIFEST_FILE)
	echo "https://openui5.hana.ondemand.com/resources/sap-ui-version.json" >> $(MANIFEST_FILE)
	echo "https://openui5.hana.ondemand.com/resources/sap/ui/core/messagebundle.properties" >> $(MANIFEST_FILE)
	printf "\nNETWORK:\n*\n\nFALLBACK:\n\n" >> $(MANIFEST_FILE)
	cat webapp/manifest.appcache

run-local:
	FLASK_APP=main.py flask run