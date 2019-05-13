// lorem ipsum -like generator for words, sentences and paragraphs
const lorem = {
  words(num1, num2) {
    const arr = [],
          length =  (num1 && num2)   // determine the length
            ? rnd(num1, num2)
            : (num1 || num2 || rnd(3, 16))

    while (arr.length < length) {

      // choose next word, different from the last one
      do  { var word = rnd(lorems) }
      while (word == arr[arr.length-1])

      arr.push(word)
    }
    return arr
  },

  sentence(num1, num2) {
    const words = this.words(num1, num2)

    // throw in some commas
    for ( let i = rnd(2, 12, 'lower');
          i < words.length-2;
          i += rnd(2, 12, 'lower') )     words[i] += ','

    // titlecase 1st word and punctuation at the end
    words[0] = words[0][0].toUpperCase() + words[0].slice(1)
    words[words.length-1] += rnd({'.':5, '!':2, '?':1})

    return words.join(' ')
  },

  paragraph(num1, num2) {
    const wordsIn = (text) => text? text.trim().split(' ').length : 0,
          length =  (num1 && num2)   // determine the length
            ? rnd(num1, num2)
            : (num1 || num2 || rnd(20, 80))

    let text = ''
    while (true) {
      const sent = this.sentence()

      // add generated sentence or generate another that fits
      if (wordsIn(text+sent) < length)  text += (text? ' ':'') + sent
      else if (wordsIn(text) == length)  break
      else  text += ' ' + this.sentence(length - wordsIn(text))
    }
    return text.trim()
  }
}

// generates and array of unique identifiers by random or selected preset
const ids = (num, preset, chars) => {
  let pad = rnd(2),  // should number be padded with leading zeros?
      more = rnd(2)  // should there be more zeros than needed?

  // chosen or random preset to generate id column by it
  preset = (typeof preset != 'undefined')? preset : rnd(4)

  switch ( preset ) {
    case 1: return integers(1, num)   // just integers

    case 2: pad = 0       // integers with random density without zero padding
    case 3: {                                             // with zero padding
      const numbers = integers(1, num, rnd(10, 100)),
            padding = pad? String(numbers[num-1]).length : 1
      return numbers.map( int => String(int).padStart(padding,'0') ) }

    default:              // complex ids with letters and more
      const padding = pad? String(num).length+more : 1,
            letterSet = rnd( ['a-z', 'A-Z', 'a-'+rnd('b-z'), 'A-'+rnd('B-Z')] ),
            letters = countUnique( rnd(letterSet, num).sort() )
      chars = chars || rnd( [['-',''], ['.',''], ['(',')'], ['[',']'], ['','']])
      return Object.entries(letters)
        .map( ([key, value]) => integers( 1, value, rnd(10, 100) )
          .map( int => key + chars[0] + String(int).padStart(padding,'0') +
            chars[1])).flat()
  }
}


const birthAge =num=> {
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
  birthdays = needBD? birthdays.map(dt=>formatDatetime(dt,dtFormat)) :0
  return [[needAge? 'age':0, needBD? rnd(['born','date of birth','born on',
    'd.o.b.','birthday']):0].filter(s=>s),
    flipNested([needAge? ages:0, needBD? birthdays:0].filter(s=>s))]
}
const origins =num=> {
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
const colouring =num=> {
  if (rnd(3)) return [[rnd(['color','favorite color','selected color',
    'preferred color','color preference','color key'])],
    flipNested([rnd(colors,num)])]
  else return [rnd([['primary color','secondary color'],['main color',
    'accent color'],['1st color','2nd color'],['first color','second color'],
    ['color 1','color 2']]), flipNested([rnd(colors,num),rnd(colors,num)])]
}
const makePoints =()=> {
  const max=rnd(1,12)*10
  return Math.min(rnd(1,max*1.7),max)+'/'+max
}
const familiars =(num,distinct)=>
  makeArr(num,_=> rnd(features,creatures),distinct)
const hitsManaStamina =num=> {
  const hp = rnd(['life','hitpoints']), mana = rnd(['mana','magicka']),
        preset = rnd(5), headers = [], columns = []
  if (preset) headers.push(hp) && columns.push(makeArr(num,makePoints))
  if (preset==2 || preset==3)
    headers.push(mana) && columns.push(makeArr(num,makePoints))
  if ([0,1,2].includes(preset))
    headers.push('stamina') && columns.push(makeArr(num,makePoints))
  return [headers,flipNested(columns)]
}
const quoting =num=> [[rnd(['motto','creed','code phrase','quote'])],
  makeArr(num,_=>['"'+rnd(rnd(sonnets))
    .replace(/[,?;:!\.]$|\.\.\.$|--$/,'')+rnd({'.':12,'!':3,'?':1})+'"'])]
const makeAmount =max=> addCommas(rnd(1000)* 10**rnd(((max||1000)/100+'').length)+'')
const scoring =num=> {
  const score = rnd(['score','points total']),
        games = rnd(['rounds won','battles won']),
        preset = rnd(5), headers = [], columns = []
  if (preset)
    headers.push(score) && columns.push(makeArr(num,_=>makeAmount(1e7)))
  if ([0,1,2].includes(preset)) headers.push(games) &&
    columns.push(makeArr(num,_=>rnd([rnd(1),rnd(50),rnd(300),rnd(1000)])))
  if (preset==2 || preset==3) headers.push('tries before quitting') &&
    columns.push(makeArr(num,_=>rnd([1,2,3,rnd(4,70),rnd(4,400)])))
  return [headers,flipNested(columns)]
}
const accounting =num=> {
  const preset = rnd(5), headers = [], columns = []
  if (preset) headers.push('balance') &&
    columns.push(makeArr(num,_=>'$'+[0,makeAmount(1e5)][rnd(92,'%')]+'.00'))
  if ([0,1,2].includes(preset)) headers.push('income','spendings') &&
    columns.push(makeArr(num,_=>{
      const sum = [0,makeAmount(1e2)][rnd(83,'%')]
      return (sum? '+':'')+'$'+sum+'.00'
    }), makeArr(num,_=>{
      const sum = [0,makeAmount(1e2)][rnd(83,'%')]
      return (sum? '-':'')+'$'+sum+'.00'
    }))
  if (preset==2 || preset==3) headers.push('debt') &&
    columns.push(makeArr(num,_=>'$'+[makeAmount(1e2),0][rnd(77,'%')]+'.00'))
  return [headers,flipNested(columns)]
}
const createModify =num=> {
  const year = 365.25*864e5
  return [['created','modified'],makeArr(num,_=>{
    const created = rnd(year)
    return [standartDatetime(new Date(Date.now()-created)),
            standartDatetime(new Date(Date.now()-rnd(created)))]
  })]
}
const rndData =(cols=[3,20], rows=[100,500])=> {
  if (typeof cols == 'number') cols = rnd(2,cols)
  else cols = rnd(cols[0],cols[1])
  if (typeof rows == 'number') rows = rnd(2,rows)
  else rows = rnd(rows[0],rows[1])
  // selectScheme()
  // decideOptions()
  // generateData()

  const wIds = rnd(80,'%')

}
const persons =num=> {
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
  result.push([names[0],flipNested(names[1])])
  if (wBirthAge) {
    const birth_age = birthAge(num)
    result.push([birth_age[0],flipNested(birth_age[1])])
  }
  if (wOrigin) result.push([rOrigin[0],flipNested(rOrigin[1])])
  if (wStatus) result.push(rStatus)
  if (wColor) result.push([rColors[0],flipNested(rColors[1])])
  if (wCreature) result.push(titled? rAnimals : rCreatures)
  if (rCreatures2) result.push(rCreatures2)
  if (wPoints) result.push([rPoints[0],flipNested(rPoints[1])])
  if (rQuote) result.push([rQuote[0],flipNested(rQuote[1])])
  if (wAmount) result.push([rAmount[0],flipNested(rAmount[1])])
  if (wLoremS) result.push([rLoremS[0],flipNested(rLoremS[1])])
  if (wLoremP) result.push([rLoremP[0],flipNested(rLoremP[1])])
  if (wCreateModify) result.push([rCreateModify[0],flipNested(rCreateModify[1])])
  result = flipNested(result)
  result = result.map(arr=>arr.flat())
  result[1] = flipNested(result[1])
  return result
}
// console.table(recordsFrom(makeArr(10000,_=>persons(3)).reduce((max,cur)=>max[0].length>cur[0].length? max:cur, [[]])))
// console.table(makeArr(10000,_=>persons(3)).reduce((counts,cur)=>{const count=''+cur[0].length;counts[count]=counts[count]?counts[count]+1:1;return counts},{}))
// JSON.stringify(makeArr(10000,_=>persons(3)).reduce((counts,cur)=>{const count=''+cur[0].length;counts[count]=counts[count]?counts[count]+1:1;return counts},{}))
