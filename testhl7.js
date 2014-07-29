var parser = require('L7');

var hl7 = "MSH|^~\\&|OSI^Osiris|Interface|ISI^ISISPHINX|ISISPHINX|20140701122920||ORM^O01^ORM_O01|_43S0QRAKM|P|2.3.1||||||\nPID|||31235^^^^||VALLET^Paul^^^^^D~VALLET^Paul^^^^^L||19290505|M|||11 RUE D ARTOIS ^^EMMERIN^^59320^^^^^^^^^||0320079749^^^|^^||||^^^|||||||||||||||||||||\nPV1||I|ETA2^211^^Etage 2||||^&^^^^^^^^^^^||||||||||||56941^^^^^|||||||||||||||||||||||||20140613140000||||||0^^^^||\nORC|NW|13331^OSI|^|568401215017348^OSI|||1^^^20140702000000^||20140701000000|||3438^DELEPORTE^Georges^^^Dr^^^CORWIN~10003796462^DELEPORTE^Georges^^^Dr^^^RPPS|||20140702000000|^ECHOGRAPHIE des voies urinaires<br><br>INCIDENCES PARTICULIERES :<br>- <br>- <br>- <br><br>INDICATION : retention urinaire désondée.Bilan à la demande du Dr BALLEREAU<br>- <br>- <br>- <br><br>ANTECEDENTS UTILES : CPIschemique sévére avec FEVG abaissée.<br>- <br>-<br>-<br><br>CIRCONSTANCES PARTICULIERES : <br>- <br>-<br>- <br><br>|^|||||195 rue Adolphe Defrenne ^^LOMME^^59160^^^^^^^^^|0826300700|N° Tel service : 03 20 22 64 82 ^^^^^^^^^^^^^||||||\nOBR|1|13331^OSI|^|51^ECHOGRAPHIE^OSIRIS^^^||||||||||||3438^DELEPORTE^Georges^^^Dr^^^CORWIN~10003796462^DELEPORTE^Georges^^^Dr^^^RPPS|||||||||||1^^^20140702000000^|";

var message = parser.parse(hl7);
console.log(hl7);
console.log(message.query('PID|5[0]'));
console.log(message.query('PID|5[1]'));