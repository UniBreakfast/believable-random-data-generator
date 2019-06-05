
// takes a nested array of rows and turns it into an array of columns
const flipNested = (arr) => arr.reduce( (newArr, row)=> {
  row.forEach( (value, i)=> newArr[i].push(value) )
  return newArr
}, Array(arr[0].length).fill(0).map( ()=>[] ) )

// transforms arrays of headers and rows into an array of objects
const objectifyRecords = (data) => {
  /* takes a nested array of headers and rows like
  [
    ['col1','col2'],    // headers
    [
      ['field1','field2'],  // row1
      ['field1','field2'],  // row2
      ...
    ]
  ]
  or an explicit object like
  {
    headers: ['col1','col2'],
    rows: [
      ['field1','field2'],  // row1
      ['field1','field2'],  // row2
      ...
    ]
  }
  and returns an array of objects like
  [
    {col1: field1, col2: field2},  // row1
    {col1: field1, col2: field2},  // row2
    ...
  ]
  which we can check with console.table */
  if (Array.isArray(data))  var [headers, rows] = data
  else                      var {headers, rows} = data

  return  rows.map( row =>
    row.reduce( (obj, value, i) => {
      obj[ headers[i] ] = value
      return obj
    }, {} )
  )
}

// transforms an array of objects into an array of headers and rows
const arrayifyRecords = (data, vary) => {
  /* takes an array of objects like
  [
    {col1: field1, col2: field2},  // row1
    {col1: field1, col2: field2},  // row2
    ...
  ]
  and returns a nested array of headers and rows like
  [
    ['col1','col2'],    // headers
    [
      ['field1','field2'],  // row1
      ['field1','field2'],  // row2
      ...
    ]
  ]
  which occupies less space in memory or JSON and takes less traffic */
  if (vary) {
    // if record objects may have different properties
    const headers = Array.from( data.reduce( (headers, row) => {
      Object.keys(row).forEach( k => headers.add(k) )
      return headers
    }, new Set() ) )
    return [ headers, data.map( row => headers.map( header=>row[header] ) ) ]
  }
  // if all objects have the same set of properties
  return [ Object.keys(data[0]), data.map( row => Object.values(row) ) ]
}

// changes between an object with headers,rows and an array with headers,rows
const recordsAsObject = (recArr) => ({ headers: recArr[0], rows: recArr[1] }),
      recordsAsArray = (recObj) => [recObj.headers, recObj.rows]
