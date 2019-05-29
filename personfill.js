let rowsToMake = 100

// let [headers, rows] = persons(rowsToMake),
let [headers, rows] = persons(rowsToMake, {
  useId: 1,
  naming: {
    form: {
      playful: {
        nickLast: 1,
        quote:' ~ '
      }
    },
    joined: 0
  },
  genders: 1,
  birthdays: 1,
  age: 1,
  origin: 1,
  status: 1,
  colors: 2,
  creatures: {
    fauna: 2,
    fantasy: 2
  },
  points: 3,
  quote: 1,
  account: 4,
  scores: 3,
  sentence: 1,
  paragraph: 1,
  timestamp: 1

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
