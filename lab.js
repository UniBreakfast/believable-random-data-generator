
// I use this to copy columns of date for pasting them into the spreadsheets
const quickTable = (data) => {
  if ( !Array.isArray(data) )  data = Object.entries(data)
  try { data = data.sort( (a, b) => a[0] - b[0] ) } catch {}
  let trs = data.reduce( (trs, row)=>
          trs + `<tr> <th>${ row[0] }</th> <td>${ row[1] }</td> </tr>`, '')
  document.body.innerHTML = `<table border=1> ${ trs } </table>`
}

const namesGend = (num, options={}) => {
  let { joined, form } = options
  const { playful, formal, casual } =  // decide on context and form of naming
    { [form || rnd(['playful', 'formal', 'casual'], 'lower')]: 1 }
  joined = joined || rnd(2) // decide should the first/last names go together
  const males = rnd(30,70),
        [dr,mr,mrs,miss] = !formal? []:
          rnd([['Dr.','Mr.','Mrs.','Miss'],['dr.','mr.','mrs.','miss']]),
        name1st = playful&&joined? 1 : rnd(2),
        nickPlace = joined? rnd(4):rnd(2),
        nick1st  = playful? nickPlace==0 :0,
        nickLast = playful? nickPlace==1 :0,
        nickIn   = playful? nickPlace==2 :0,
        nickEnd  = playful? nickPlace==3 :0,
        quote    = playful? rnd(['"',"'","~",'`',':','-','=']) :0,
        nicksArr = playful? makeArr(num,_=>rnd(nicknames),1,nicknames.length>num) :0,
        nameAbbr = joined&&!nickIn? rnd(25,'%') :0,
        gender = rnd(2),
        gend = rnd(35,'%'),
        naming = rnd(3),
        headers = []

  if (nick1st) headers.push(rnd(['nick','nickname','nickname','alias','callsign']))
  if (joined) headers.push(rnd(['name','fullname','full name']))
  else {
    if (formal) headers.push('title')
    if (name1st) headers.push(['firstname','first name','name'][naming])
    headers.push(['lastname','last name','surname'][naming])
    if (!name1st) headers.push(['firstname','first name','name'][naming])
    if (nickLast)
      headers.push(rnd(['nick','nickname','nickname','alias','callsign']))
  }
  if (gender) headers.push('gender')

  return [headers, makeArr(num,_=>{
    const row=[],
          male=rnd(males,'%'),
          married=rnd(60,'%'),
          firstname=rnd([femaleNames,maleNames][male]),
          first=nameAbbr? firstname[0]+'.':firstname,
          last=rnd(lastNames),
          nick=nicksArr? nicksArr.pop() :'',
          _nick_=quote+nick+quote,
          title=formal? (rnd(5,'%')? dr:(male?mr:[mrs,miss][married])):'',
          fe_male=[['female','male'],['F','M']][gend]

    if (nick1st) row.push(nick)
    if (joined) row.push((title? title+' ':'')+
      (name1st? (first)+' ':'')+(nickIn? _nick_+' ':'')+(last)+
      (!name1st? ', '+(first):'')+(nickEnd? ' aka '+_nick_:''))
    else {
      if (formal) row.push(title)
      if (name1st) row.push(first)
      row.push(last)
      if (!name1st) row.push(first)
      if (nickLast) row.push(nick)
    }
    if (gender) row.push(fe_male[male])

    return row
  })]
}



function probe(func) {
  quickTable(countUnique(makeArr(100000, func)))
}