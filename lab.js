
// I use this to copy columns of date for pasting them into the spreadsheets
const quickTable = (data) => {
  if ( !Array.isArray(data) )  data = Object.entries(data)
  let trs = data.reduce( (trs, row)=>
          trs + `<tr> <th>${ row[0] }</th> <td>${ row[1] }</td> </tr>`, '')
  document.body.innerHTML = `<table border=1> ${ trs } </table>`
}