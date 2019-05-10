const renest =arr=> arr.reduce((arr,el)=>{
  el.forEach((el,i)=>arr[i].push(el))
  return arr
}, Array(arr[0].length).fill(0).map(_=>[])),
recordsFrom =data=> {
  try   { var [headers, rows] = data }
  catch { var {headers, rows} = data }
  return rows.map(row => {
    let obj = {}
    row.forEach((value,i) => obj[headers[i]] = value)
    return obj
  })
},
contbl =data=> {
  if (!Array.isArray(data) && typeof data=='object') console.table(data)
  if (typeof data[0][0]=='string' && Array.isArray(data[1][0]))
    console.table(recordsFrom(data))
  else console.table(recordsFrom([Array(data[0].length).fill(0).map((_,i)=>`column${i+1}`),data]))
},
quickTable =data=> {
  if (!Array.isArray(data)) data = Object.entries(data)
  let trs = data.reduce((trs,row)=>
    trs+`<tr><th>${row[0]}</th><td>${row[1]}</td></tr>`,'')
  document.body.innerHTML = `<table border=1>${trs}</table>`
},
makeArr =(length, func, distinct, persist)=> {
  if (distinct) {
    for (var set = new Set(), i=0, max = persist? Infinity:100000;
         set.size<length && i<max; i++)
      { if (set.size<set.add(func()).size) i=0 }
    return Array.from(set)
  }
  return Array(length).fill(0).map(func)
},
nth =day=> {
  if (day>3 && day<21) return +day+'th'
  switch (day%10) {
    case 1: return +day+'st'
    case 2: return +day+'nd'
    case 3: return +day+'rd'
    default: return +day+'th'
  }
},
csNum =num=> (num+'').replace(/\B(?=(\d{3})+(?!\d))/g, ","),
dtStd =date=> new Date(date.getTime()-(date.getTimezoneOffset()*60000))
  .toISOString().replace('T',' ').slice(0,-5),
dtForm =(datetime,format)=> {
  const [YYYY,MM,DD,HH,mm,ss] = datetime.split(/[- :]/)
  return format.replace('YYYY',YYYY).replace('YY',YYYY.substring(2))
    .replace('DDth', nth(DD))
    .replace('Month', months[MM-1]).replace('MM',MM)
    .replace('month', monthShorts[MM-1]).replace('DD',DD)
    .replace('HH',HH).replace('mm',mm).replace('ss',ss)
},

rnd =(...args)=> {
  rnd.counter = rnd.counter? rnd.counter+1 : 1
  const [arg1,arg2,arg3] = args

  if (args.length==1) {
    if (typeof arg1 == 'number')
      return Math.floor(Math.random()*arg1)
    if (Array.isArray(arg1)) return arg1[rnd(arg1.length)]
    if (arg1==Date) return dtStd(new Date(rnd(Date.now())))
    if (arg1 instanceof Date)
      return dtStd(new Date(rnd(arg1.getTime(), Date.now())))
    if (typeof arg1 == 'string') {
      if (arg1.match(/^.-.$/))
        return String.fromCharCode(rnd(arg1.charCodeAt(0),arg1.charCodeAt(2)))
      return dtForm(rnd(Date), arg1)
    }
    if (typeof arg1 == 'object') {
      const max = Object.values(arg1).reduce((sum,num)=>sum+num),
            entries = Object.entries(arg1)
      let value;
      for (let num=rnd(max), i=0; num>=0; i++) {
        value=entries[i][0]
        num-=entries[i][1]
      }
      return value
    }
  }

  if (args.length==2) {
    if (typeof arg1=='number' && typeof arg2=='number')
      return Math.floor(arg1+(arg2-arg1+1)*Math.random())
    if (typeof arg2=='number') return makeArr(arg2,_=>rnd(arg1))
    if (Array.isArray(arg2)) return rnd(arg1)+' '+rnd(arg2)
    if (arg2 instanceof Date)
      return dtStd(new Date(rnd(arg1.getTime(), arg2.getTime())))
  }
  if (args.length==3) {
    if (arg3=='lower') {
      const min = arg1-1, max = arg2+1,
            num = min + Math.abs(rnd(-max,-min) + rnd(min, max))
      return  (min<num && num<max)? num : rnd(arg1,arg2,arg3)
    }
    if (arg3=='higher') {
      const min = arg1-1, max = arg2+1,
            num = max - Math.abs(rnd(-max,-min) + rnd(min, max))
      return  (min<num && num<max)? num : rnd(arg1,arg2,arg3)
    }
    if (arg3=='center') {
      const min1 = Math.floor(arg1/2), min2 = arg1-min1,
            max1 = Math.floor(arg2/2), max2 = arg2-max1
      return  rnd(min1, max1) + rnd(min2, max2)
    }
    return makeArr(arg3, _=>rnd(arg1,arg2))
  }
  return Math.random()
},

// rnd() == random decimal from 0 to 1
// rnd(num) == random integer from 0 to num-1
// rnd(num1, num2) == random ineger from num1 to num2
// rnd(arr) == random el from arr
// rnd(Date) == random ISO-datetime from 1970 to now
// rnd('DD.MM.YYYY') == random date/time from 1970 to now in provided format
// rnd(new Date(1234567890)) == random datetime between that date and now
// rnd(arr, num) == array of num random els from arr
// rnd(arr1, arr2) == string of random combination of some el from arr1 w el from arr2
// rnd(Date, num) == array of num random datetimes from 1970 to now
// rnd('DD.MM.YYYY', num) == array of num random dates/times from 1970 to now in provided format
countDistinct =arr=>
  arr.reduce((obj,el)=>{obj[el]=obj[el]? obj[el]+1:1; return obj},{})
probably =percentage=> +(rnd(1,100)<=percentage),
integers =(start, length, density=100)=> {
  for (var arr=[]; arr.length<length; start++) {
    if (probably(density)) arr.push(start) }
  return arr
},
ids =num=> {
  let pad = rnd(2), more = rnd(2)
  switch (rnd(4)) {
    case 1: return integers(1,num)
    case 2: pad = 0
    case 3: return integers(1,num,rnd(10,100))
      .map((int,_,arr)=>(int+'').padStart(pad? (arr[num-1]+'').length:1,'0'))
    default:
      const letterSet = rnd(['a-z','A-Z','a-'+rnd('b-z'),'A-'+rnd('B-Z')]),
      letters = rnd(letterSet,num).sort().reduce((obj,l)=>
        { obj[l] = 1+(obj[l]||0); return obj }, {}),
      chars = rnd([['-',''],['.',''],['(',')'],['[',']'],['','']])
      return Object.entries(letters)
        .map(([key,value])=>integers(1,value,rnd(10,100))
        .map(int=>key+chars[0]+(pad
          ? (int+'').padStart((num+'').length+more,'0'):int)+chars[1])).flat()
  }
},
namesGend =num=> {
  const males = rnd(30,70),
        joined = probably(40),
        titleNick = rnd(3),
        titles = titleNick==1,
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
        nameAbbr = joined&&!nickIn? probably(25) :0,
        gender = rnd(2),
        gend = probably(35),
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
          male=probably(males),
          married=probably(60),
          firstname=rnd([femaleNames,maleNames][male]),
          first=nameAbbr? firstname[0]+'.':firstname,
          last=rnd(lastNames),
          nick=nicksArr? nicksArr.pop() :'',
          _nick_=quote+nick+quote,
          title=titles? (probably(5)? dr:(male?mr:[mrs,miss][married])):'',
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
},
birthAge =num=> {
  let birthdays = makeArr(num,_=>
    rnd(new Date(rnd(['1960','1985'])),new Date('2000')))
  const needAge = rnd(6),
        year = 365.25*864e5
        needBD  = needAge? rnd(3) :1,
        dtFormat = needBD? rnd(['YYYY-MM-DD','DD.MM.YYYY','DD.MM.YY',
                          'MM/DD/YY',"DD month 'YY",'DDth of Month, YYYY',
                          'Month DDth, YYYY']) :0,
        ages = needAge? birthdays.map(dt=>
          Math.floor((Date.now()-(new Date(dt)).getTime())/year)) :0
  birthdays = needBD? birthdays.map(dt=>dtForm(dt,dtFormat)) :0
  return [[needAge? 'age':0, needBD? rnd(['born','date of birth','born on',
    'd.o.b.','birthday']):0].filter(s=>s),
    renest([needAge? ages:0, needBD? birthdays:0].filter(s=>s))]
},
origins =num=> {
  const preset=rnd(4), city=preset, country=3-preset, joined=preset==1,
        both=city&&country, city1st=both?rnd(2):0
  if (joined) return [[rnd(['origin','residence','where from','city, country',
    'from'])], makeArr(num,_=>
      { const pair=rnd(cities); return [`${pair[0]}, ${pair[1]}`]})]
  if (city1st) return [['city','country'], rnd(cities,num)]
  if (both) return [['country','city'], makeArr(num,_=>rnd(cities).reverse())]
  if (city) return [[rnd(['city','from'])], makeArr(num,_=>[rnd(cities)[0]])]
  else return [[rnd(['country','from'])], makeArr(num,_=>[rnd(cities)[1]])]
}
colouring =num=> {
  if (rnd(3)) return [[rnd(['color','favorite color','selected color',
    'preferred color','color preference','color key'])],
    renest([rnd(colors,num)])]
  else return [rnd([['primary color','secondary color'],['main color',
    'accent color'],['1st color','2nd color'],['first color','second color'],
    ['color 1','color 2']]), renest([rnd(colors,num),rnd(colors,num)])]
},
makePoints =()=> {
  const max=rnd(1,12)*10
  return Math.min(rnd(1,max*1.7),max)+'/'+max
},
familiars =(num,distinct)=>
  makeArr(num,_=> rnd(features,creatures),distinct)
hitsManaStamina =num=> {
  const hp = rnd(['life','hitpoints']), mana = rnd(['mana','magicka']),
        preset = rnd(5), headers = [], columns = []
  if (preset) headers.push(hp) && columns.push(makeArr(num,makePoints))
  if (preset==2 || preset==3)
    headers.push(mana) && columns.push(makeArr(num,makePoints))
  if ([0,1,2].includes(preset))
    headers.push('stamina') && columns.push(makeArr(num,makePoints))
  return [headers,renest(columns)]
},
quoting =num=> [[rnd(['motto','creed','code phrase','quote'])],
  makeArr(num,_=>['"'+rnd(rnd(sonnets))
    .replace(/[,?;:!\.]$|\.\.\.$|--$/,'')+rnd({'.':12,'!':3,'?':1})+'"'])]
makeAmount =max=> csNum(rnd(1000)* 10**rnd(((max||1000)/100+'').length)+''),
scoring =num=> {
  const score = rnd(['score','points total']),
        games = rnd(['rounds won','battles won']),
        preset = rnd(5), headers = [], columns = []
  if (preset)
    headers.push(score) && columns.push(makeArr(num,_=>makeAmount(1e7)))
  if ([0,1,2].includes(preset)) headers.push(games) &&
    columns.push(makeArr(num,_=>rnd([rnd(1),rnd(50),rnd(300),rnd(1000)])))
  if (preset==2 || preset==3) headers.push('tries before quitting') &&
    columns.push(makeArr(num,_=>rnd([1,2,3,rnd(4,70),rnd(4,400)])))
  return [headers,renest(columns)]
},
accounting =num=> {
  const preset = rnd(5), headers = [], columns = []
  if (preset) headers.push('balance') &&
    columns.push(makeArr(num,_=>'$'+[0,makeAmount(1e5)][probably(92)]+'.00'))
  if ([0,1,2].includes(preset)) headers.push('income','spendings') &&
    columns.push(makeArr(num,_=>'+$'+[0,makeAmount(1e2)][probably(83)]+'.00'),
                 makeArr(num,_=>'-$'+[0,makeAmount(1e2)][probably(83)]+'.00'))
  if (preset==2 || preset==3) headers.push('debt') &&
    columns.push(makeArr(num,_=>'$'+[makeAmount(1e2),0][probably(77)]+'.00'))
  return [headers,renest(columns)]
},
createModify =num=> {
  const year = 365.25*864e5
  return [['created','modified'],makeArr(num,_=>{
    const created = rnd(year)
    return [dtStd(new Date(Date.now()-created)),
            dtStd(new Date(Date.now()-rnd(created)))]
  })]
},
rndData =(cols=[3,20], rows=[100,500])=> {
  if (typeof cols == 'number') cols = rnd(2,cols)
  else cols = rnd(cols[0],cols[1])
  if (typeof rows == 'number') rows = rnd(2,rows)
  else rows = rnd(rows[0],rows[1])
  // selectScheme()
  // decideOptions()
  // generateData()

  const wIds = probably(80)

},
persons =num=> {
  let result = []
  const names = namesGend(num),
        titled = names[1][0].reduce((titled,el)=> titled?true : !!el
                  .match(/mr\.|mrs\.|miss|dr\./i),0),
        wIds = rnd(5),
        wBirthAge = rnd(5),
        wOrigin = rnd(5),
        rOrigin = wOrigin? origins(num) :0,
        wColor = rnd(5),
        rColors = wColor? colouring(num) :0,
        wCreature = rnd(5),
        wPoints = !titled&&wCreature? rnd(5) :0,
        rPoints = wPoints? hitsManaStamina(num) :0,
        rAnimals = titled&&wCreature? [[rnd(['animal','totem',
          'totem animal','chosen animal'])],[rnd(animals,num)]] :0,
        rCreatures = !titled&&wCreature? [[rnd(['familiar','creature',
          'character','playing character'])],[familiars(num,1)]] :0,
        rCreatures2 = rCreatures&&rCreatures[0][0]=='playing character'?
          [['reserve character'],[familiars(num,1)]] :0,
        wQuote = rnd(5),
        rQuote = wQuote? quoting(num) :0,
        wStatus = rnd(2),
        rStatus = [['status'],[rnd({'':9,'active':3,'inactive':1,'left':1,'done':2,'quit':1,'deceased':1},num)]],
        wAmount = rnd(5),
        rAmount = !wAmount? 0: (titled? accounting(num) : scoring(num)),
        wCreateModify = rnd(7),
        rCreateModify = wCreateModify? createModify(num) :0,
        wLoremS = rnd(3),
        rLoremS = wLoremS? [['spell','proverb'][+titled], makeArr(num,_=>
          [lorem.sentence(2,22)])] :0,
        wLoremP = !rnd(5),
        rLoremP = wLoremP? [[rnd(['character bio','story']),rnd(['details',
          'description'])][+titled],makeArr(num,_=>[lorem.paragraph(22,222)])]:0

  if (wIds) result.push([['id'],[ids(num)]])
  result.push([names[0],renest(names[1])])
  if (wBirthAge) {
    const birth_age = birthAge(num)
    result.push([birth_age[0],renest(birth_age[1])])
  }
  if (wOrigin) result.push([rOrigin[0],renest(rOrigin[1])])
  if (wStatus) result.push(rStatus)
  if (wColor) result.push([rColors[0],renest(rColors[1])])
  if (wCreature) result.push(titled? rAnimals : rCreatures)
  if (rCreatures2) result.push(rCreatures2)
  if (wPoints) result.push([rPoints[0],renest(rPoints[1])])
  if (rQuote) result.push([rQuote[0],renest(rQuote[1])])
  if (wAmount) result.push([rAmount[0],renest(rAmount[1])])
  if (wLoremS) result.push([rLoremS[0],renest(rLoremS[1])])
  if (wLoremP) result.push([rLoremP[0],renest(rLoremP[1])])
  if (wCreateModify) result.push([rCreateModify[0],renest(rCreateModify[1])])
  result = renest(result)
  result = result.map(arr=>arr.flat())
  result[1] = renest(result[1])
  return result
}
// console.table(recordsFrom(makeArr(10000,_=>persons(3)).reduce((max,cur)=>max[0].length>cur[0].length? max:cur, [[]])))
// console.table(makeArr(10000,_=>persons(3)).reduce((counts,cur)=>{const count=''+cur[0].length;counts[count]=counts[count]?counts[count]+1:1;return counts},{}))
// JSON.stringify(makeArr(10000,_=>persons(3)).reduce((counts,cur)=>{const count=''+cur[0].length;counts[count]=counts[count]?counts[count]+1:1;return counts},{}))
