
const visualize = (data, options={}) => {
  if ( !Array.isArray(data) )  data = Object.entries(data)
  try { data = data.sort( (a, b) => a[0] - b[0] ) } catch {}

  const { width=1080, namesWidth=80, barMaxWidth=1000, height=700,
          barHeight = Math.max(10, height/data.length-1) } = options,
        maxNum = Math.max( ...data.map(row => row[1]) ),
        unitSize = barMaxWidth / maxNum,
        calcWidth = (num) => Math.floor(num * unitSize),
        unitColor = 256 / maxNum,
        calcColor = (num) => Math.floor(256 - num * unitColor),
        style = `<style>
                   body>div {
                     display: grid;
                     width: ${ width }px;
                     grid-template-columns: ${ namesWidth }px auto;
                     gap: 1px;
                   }
                   body>div>span:nth-child(odd) {
                     text-align: right;
                     padding-right: 5px;
                     line-height: ${ barHeight }px;
                     font-weight: bold;
                   }
                   body>div>span:nth-child(even) {
                     height: ${ barHeight }px;
                     border-radius: 6px;
                   }
                 </style>`
  let html = data.reduce( (html, [valueName, number])=>
    html + `<span title=${ number }>${ valueName }</span><span title=${
      number } style=background:hsl(${ calcColor(number) },74%,45%);width:${
        calcWidth(number) }></span>`, '')

  document.body.innerHTML = style + `<div> ${ html } </div>`
}


const probe = (given, options={}) => {
  const { presenter=visualize, num=10000, noSort } = options

  if (typeof given == 'function') {
    if ( Array.isArray(given()) )  given = given()
    else  given = makeArr(num, given)
  }

  if ( Array.isArray(given) )  presenter(countUnique(given, noSort), options)
  else  presenter(given, options)
}


// I use this to copy columns of data for pasting them into the spreadsheets
const quickTable = (data) => {
  if ( !Array.isArray(data) )  data = Object.entries(data)
  try { data = data.sort( (a, b) => a[0] - b[0] ) } catch {}
  let trs = data.reduce( (trs, row)=>
          trs + `<tr> <th>${ row[0] }</th> <td>${ row[1] }</td> </tr>`, '')
  document.body.innerHTML = `<table border=1> ${ trs } </table>`
}


const probeTbl = (given) => probe(given, {presenter: quickTable})
