
// I use this to copy columns of date for pasting them into the spreadsheets
const quickTable = (data) => {
  if ( !Array.isArray(data) )  data = Object.entries(data)
  try { data = data.sort( (a, b) => a[0] - b[0] ) } catch {}
  let trs = data.reduce( (trs, row)=>
          trs + `<tr> <th>${ row[0] }</th> <td>${ row[1] }</td> </tr>`, '')
  document.body.innerHTML = `<table border=1> ${ trs } </table>`
}

const namesGend = (num, options={}) => {
  let { joined, form, gender, name1st } = options

  // decide on form of naming and the context of data generated
  const males = rnd(30, 70),
        { playful, formal, casual } = (typeof form == 'object')?
          form : { [form || rnd(['playful', 'formal', 'casual'], 'lower')]: 1 }
  // should the first/last names go together
  joined = (joined == undefined)? rnd(2) : joined
  gender = (gender == undefined)? rnd(2) : gender // should there be gender
  name1st = (playful && joined)? 1 : (name1st == undefined)? rnd(2) : name1st

  if (joined)  var nameAbbr = (joined.nameAbbr == undefined)?
    rnd(25,'%') : joined.nameAbbr
  else  var naming = rnd(3)

  if (gender)  var [f, m] = Array.isArray(gender)?
    gender : [['female', 'male'], ['F', 'M']][ rnd(35, '%') ]

  if (formal)  var [dr, mr, mrs, miss] =
    rnd( [['Dr.', 'Mr.', 'Mrs.', 'Miss'], ['dr.', 'mr.', 'mrs.', 'miss']] )

  if (playful) {
    var { nick1st, nickLast, nickIn, nickEnd, quote } = playful,
    nicksArr = makeArr(num, ()=> rnd(nicknames), 1, nicknames.length > num)

    if (!nick1st && !nickLast && !nickIn && !nickEnd)
      ({ nick1st, nickLast, nickIn, nickEnd } = { [['nick1st', 'nickLast',
        'nickIn', 'nickEnd'][joined? rnd(4) : rnd(2)]]:1 })
    quote = quote || rnd( ['"', "'", "~", '`', ':', '-', '='] )

    if (joined && nickIn)  nameAbbr = 0
  }

  const headers = []

  if (nick1st) headers.push(rnd(['nick','nickname','nickname','alias','callsign']))
  if (joined) headers.push(rnd(['name','fullname','full name']))
  else {
    if (formal) headers.push('title')
    if (name1st) headers.push(['firstname','first name','name'][naming])
    headers.push(['lastname','last name','surname'][naming])
    if (!name1st) headers.push(['firstname','first name','name'][naming])
  }
  if (nickLast)
    headers.push(rnd(['nick','nickname','nickname','alias','callsign']))
  if (gender) headers.push('gender')

  const rows = makeArr(num,_=>{
    const row=[],
          male=rnd(males,'%'),
          married=rnd(60,'%'),
          firstname=rnd([femaleNames,maleNames][male]),
          first=nameAbbr? firstname[0]+'.':firstname,
          last=rnd(lastNames),
          nick=nicksArr? nicksArr.pop() :'',
          _nick_=quote+nick+quote,
          title=formal? (rnd(5,'%')? dr:(male?mr:[mrs,miss][married])):''

    if (nick1st) row.push(nick)
    if (joined) row.push((title? title+' ':'')+
      (name1st? (first)+' ':'')+(nickIn? _nick_+' ':'')+(last)+
      (!name1st? ', '+(first):'')+(nickEnd? ' aka '+_nick_:''))
    else {
      if (formal) row.push(title)
      if (name1st) row.push(first)
      row.push(last)
      if (!name1st) row.push(first)
    }
    if (nickLast) row.push(nick)
    if (gender) row.push([f, m][male])

    return row
  })
  return [headers, rows]
}



function probe(func) {
  quickTable(countUnique(makeArr(100000, func)))
}