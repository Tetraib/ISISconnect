ISISconnect
===========

Curl
-------
To download fil with CURL with remote name forced
```
curl -O -J <host>
```

To Post cr formated text with curl. Use : '\"' to escape : '"'
```
curl -H "exam_infos":"\"20140219131841\",\"18774\",\"TEST\",\"Osiris\",\"19320416\",\"ECHOGRAPHIE ABDOMINALE\",\"20140219131841_000005955.pdf\",\"000000000\",\"20/02/2014\"" -F filedata=@<filename> <host>/postcr
```

```
curl -H "Content-Type: text/plain" --data-binary "@<file>" <host>/postprescriptionhl7
```

ISIS_HL7_SENDER
--------------
Requiere iconv and curl
Can be used with cygwin on windows