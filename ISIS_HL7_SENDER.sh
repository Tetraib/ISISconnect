#!/bin/bash
FILES=FILES/*.hl7
for f in $FILES
	do 
		iconv -f CP1252 -t UTF-8 $f > UTF8/${f##*/}
		response=$(./curl https://isisconnect-c9-tetraib.c9.io/postprescriptionhl7 -H 'Content-Type: text/plain' --data-binary @UTF8/${f##*/})
		rm UTF8/${f##*/}
		if [ $response = "OK" ]; then
			mv $f SENT_FILES/
		fi
done