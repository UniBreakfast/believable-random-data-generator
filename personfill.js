let rowsToMake = 100

// let [headers, rows] = persons(rowsToMake),
let [headers, rows] = persons(rowsToMake, {
  useId: 0,
  naming: {
    form: {
      playful: {
        nick1st:0,
        quote:'*'
      }
    },
    joined: 1
  },
  genders: 0,

}),
    footers = headers


tbl = document.querySelector('.sTable').children[0]


tbl.tHead.children[0].innerHTML =
  headers.reduce( (ths, word) => ths + `<th> ${ word } </th>` ,'' )

tbl.tFoot.children[0].innerHTML = cellsHTML(footers)

tbl.tBodies[0].innerHTML =
  rows.reduce( (trs, row) => trs + `<tr>${ cellsHTML(row) }</tr>`, '' )


function cellsHTML(row) {
  return row.reduce( (html, word, i) =>
    html + (i? `<td>${ word }</td>` : `<th>${ word }</th>`), '' )
}
