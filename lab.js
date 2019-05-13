
// I use this to copy columns of date for pasting them into the spreadsheets
const quickTable = (data) => {
  if ( !Array.isArray(data) )  data = Object.entries(data)
  let trs = data.reduce( (trs, row)=>
          trs + `<tr> <th>${ row[0] }</th> <td>${ row[1] }</td> </tr>`, '')
  document.body.innerHTML = `<table border=1> ${ trs } </table>`
}

const namesGend =num=> {
  const males = rnd(30,70),
        joined = rnd(40,'%'),
        titleNick = rnd(3),   //?? w nick, w title, without any
        titles = titleNick==1,   //??
        [dr,mr,mrs,miss] = !titles? []:
          rnd([['Dr.','Mr.','Mrs.','Miss'],['dr.','mr.','mrs.','miss']]),
        nicks = titleNick==2,
        name1st = nicks&&joined? 1 : rnd(2),
        nickPlace = joined? rnd(4):rnd(2),
        nick1st  = nicks? nickPlace==0 :0,
        nickLast = nicks? nickPlace==1 :0,
        nickIn   = nicks? nickPlace==2 :0,
        nickEnd  = nicks? nickPlace==3 :0,
        quote    = nicks? rnd(['"',"'","~",'`',':','-','=']) :0,
        nicksArr = nicks? makeArr(num,_=>rnd(nicknames),1,nicknames.length>num) :0,
        nameAbbr = joined&&!nickIn? rnd(25,'%') :0,
        gender = rnd(2),
        gend = rnd(35,'%'),
        naming = rnd(3),
        headers = []

  if (nick1st) headers.push(rnd(['nick','nickname','nickname','alias','callsign']))
  if (joined) headers.push(rnd(['name','fullname','full name']))
  else {
    if (titles) headers.push('title')
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
          title=titles? (rnd(5,'%')? dr:(male?mr:[mrs,miss][married])):'',
          fe_male=[['female','male'],['F','M']][gend]

    if (nick1st) row.push(nick)
    if (joined) row.push((title? title+' ':'')+
      (name1st? (first)+' ':'')+(nickIn? _nick_+' ':'')+(last)+
      (!name1st? ', '+(first):'')+(nickEnd? ' aka '+_nick_:''))
    else {
      if (titles) row.push(title)
      if (name1st) row.push(first)
      row.push(last)
      if (!name1st) row.push(first)
      if (nickLast) row.push(nick)
    }
    if (gender) row.push(fe_male[male])

    return row
  })]
}
