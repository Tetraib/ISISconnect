ISISconnect
===========

CURL
-------
To download fil with CURL
```
curl -O -J <host>
```

To Post cr formated text with curl, uses \" to escape : "
```
curl -H "exam_infos":"\"20140219131841\",\"18774\",\"TEST\",\"Osiris\",\"19320416\",\"ECHOGRAPHIE ABDOMINALE\",\"20140219131841_000005955.pdf\",\"000000000\",\"20/02/2014\"" -F filedata=@<filename> <host>/postcr
```
