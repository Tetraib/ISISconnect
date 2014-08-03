#!/bin/bash
FILES=FILES/*.hl7
for f in $FILES
	do 
		#Convert from ANSI to UTF-8
		iconv -f CP1252 -t UTF-8 $f > UTF8/${f##*/}
		#Send HL7 file content to webservice
		response=$(./curl https://isisconnect-c9-tetraib.c9.io/postprescriptionhl7 -H 'Content-Type: text/plain' --data-binary @UTF8/${f##*/})
		rm UTF8/${f##*/}
		#If sending is successfull move file to log directory
		if [ $response = "OK" ]; then
			mv $f SENT_FILES/
		fi
done