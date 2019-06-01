let rowsToMake = 100

// let [headers, rows] = persons(rowsToMake),
let [headers, rows] = persons(rowsToMake, {
      /* omitRest: 1,
      useId: { preset: 0, chars: ['-',''] },
      naming: { form: 'playful', joined: 1 }, genders: 1,
      birthdays: 1, age: 1,
      origin: { joined: 1 },
      status: 1, colors: 1,
      creatures: { fantasy: 2, fauna: 1 },
      points: 3, quote: 1,
      scores: 3, sentence: 1,
      timestamp: 1 */
    } ),
    footers = headers,  // cause no special footers for now
    tbl = document.querySelector('.sTable').children[0]

// renderTable(tbl, headers, rows, footers)
renderTableWithColors(tbl, headers, rows, footers)


function renderTable(tbl, headers, rows, footers=headers) {

  tbl.tHead.children[0].innerHTML = !headers? '' :
    headers.reduce( (ths, header) => ths + `<th> ${ header } </th>` ,'' )

  tbl.tFoot.children[0].innerHTML = !footers? '' : cellsHTML(footers)

  tbl.tBodies[0].innerHTML = !rows? '' :
    rows.reduce( (trs, row) => trs + `<tr>${ cellsHTML(row) }</tr>`, '' )

  function cellsHTML(row) {
    return row.reduce( (html, str, i) =>
      html + (i? `<td>${ str }</td>` : `<th>${ str }</th>`), '' )
  }
}


// just for fun - with color samples (if color column present)
function renderTableWithColors(tbl, headers, rows, footers=headers) {
  const colorColumns = []

  tbl.tHead.children[0].innerHTML =
    headers.reduce( (ths, header, i) => ths + `<th> ${
      !header.includes('color')? header : colorColumns.push(i) && header
    } </th>` ,'' )

  tbl.tFoot.children[0].innerHTML = cellsHTML(footers)

  tbl.tBodies[0].innerHTML = rows.reduce( (trs, row) =>
      trs + `<tr>${ cellsHTML(row, colorColumns) }</tr>`, '' )

  function cellsHTML(row, colorColumns=[]) {
    return row.reduce( (html, str, i) =>
      html + (i? `<td>${ str } ${ colorColumns.includes(i)?
        `<b style=background:${str}>| |</b>`:'' }</td>`
          : `<th>${ str }</th>`), '' )
  }
}