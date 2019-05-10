function concatBy(arr, lineLen) {
  let result='', line=''
  arr = arr.map(word=>word+',')
  for (i=0; i<arr.length; i++) {
    if ((line+arr[i]).length > lineLen) {
      result += '\n'+line
      line = arr[i]
    }
    else  line += arr[i]
  }
  result += '\n'+line
  return result.replace(/,$/,'')
}

function concatBy(arr, lineLen) {
  arr = arr.map(word=>word+',')
  let word, lines='', line='';
  while (word = arr.shift()) {
    if ( (line+word).length > lineLen ) {
      lines += '\n'+line
      line = word
    }
    else line += word
  }
  return lines+'\n'+line.replace(/,$/,'')
}

console.log(concatBy(["Aaron","Abdul","Abdullah","Abel","Abner","Abraham","Abram","Adam","Adan","Addison","Aden","Adolfo","Adonis","Adrian","Adrien","Agustin","Ahmad","Ahmed","Aidan","Aiden","Alan","Albert","Alberto","Alden","Aldo","Alec","Alejandro","Alek","Alessandro","Alex","Alexander","Alexandre","Alexandro","Alexis","Alexzander","Alfonso","Alfred","Alfredo","Ali","Alijah","Allan","Allen","Alonso","Alonzo","Alton","Alvaro","Alvin","Amari","Ameer","Amir","Ammon","Amos","Anders","Anderson","Andre","Andreas","Andres","Andrew","Andy","Angel","Angelo","Anthony","Antoine","Anton","Antonio","Antony","Antwan","Ari","Aric","Ariel","Arjun","Arman","Armand","Armando","Armani","Arnold","Aron","Arron","Arthur","Arturo","Asa","Asher","Ashton","Aubrey"],80))
