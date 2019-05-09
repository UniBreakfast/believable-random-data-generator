let [headers,rowsArr] = persons(rows)

tbl = document.querySelector('.sTable').children[0]
tbl.tHead.children[0].innerHTML=headers
  .reduce((ths,word)=>ths+`<th>${word}</th>`,'')
tbl.tFoot.children[0].innerHTML=headers
  .reduce((ths,word,i)=>ths+(i?`<td>${word}</td>`:`<th>${word}</th>`),'')
tbl.tBodies[0].innerHTML=rowsArr
  .reduce((trs,row)=>trs+`<tr>${row.reduce((tds,word,i)=>
     tds+(i?`<td>${word}</td>`:`<th>${word}</th>`),'')}</tr>`, '')