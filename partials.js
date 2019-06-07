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
const ids = (num=100, options={}) => {
  /* options may be like
  {                        // omitted options are left to be chosen randomly
    preset: 0, 1, 2 or 3     // exact scheme for ids, options are:
            // 0 - letter/number combination, 1 - sequential integers,
            // 2 - dispersed integers, 3 - dispersed integers with zero padding
    chars: ['char1', 'char2']   // to wrap the number part in them
  } */

  let { preset, chars } = options
  preset = (preset !== undefined)? preset : rnd(4)

  // should number be padded with leading zeros?
  let pad = (preset == 3) || rnd(2),
      more = rnd(2)  // should there be more zeros than needed?

  // chosen or random preset to generate id column by it

  switch ( preset ) {
    case 1: return integers(1, num)   // just integers

    case 2: pad = 0       // integers with random density without zero padding
    case 3: {                                // with the possible zero padding
      const numbers = integers(1, num, rnd(10, 100)),
            padding = pad? String(numbers[num-1]).length : 1
      return numbers.map( int => String(int).padStart(padding,'0') ) }

    default:              // complex ids with letters and more
      const padding = pad?  String(num).length + more  :  1,
            letterSet = rnd( ['a-z', 'A-Z', 'a-'+rnd('b-z'), 'A-'+rnd('B-Z')] ),
            letters = countUnique( rnd(letterSet, num).sort() )
      // chars to wrap the number part in them
      chars = chars || rnd( [['-',''], ['.',''], ['(',')'], ['[',']'], ['','']])
      return Object.entries(letters)
        .map( ([key, value]) => integers( 1, value, rnd(10, 100) )
          .map( int => key + chars[0] + String(int).padStart(padding,'0') +
            chars[1])).flat()
  }
}


// generates records with names (and optionally titles/nicknames, gender)
const namesGenders = (num=100, options={}) => {
  /* options may be like
  {                        // all omitted options are left to be chosen randomly
    joined: 0 or {nameAbbr: 1 or 0},  // first/last in one cell, initial or full
    // just first/last name or with title, or with nicknames
    form: {casual or formal or playful: 1 or {
      nick1st or nickLast or nickIn or nickEnd: 1,          // nickname position
      quote: '**' or any 'string'        // character to wrap nickname if joined
    } },
    genders: 0 or 1 or ['girl', 'boy'], // if alternative labels for male/female
    name1st: 0 or 1              // should the firtname go before/after the last
  } */

  // preparations section: setting the variables for the generation process
  let { joined, form, genders, name1st } = options

  // decide on form of naming and the context of data generated
  const males = rnd(30, 70),   // male/female percentage
  // choice of form: gaming-like with nicknames, formal with titles or casual
      { playful, formal, casual } = (typeof form == 'object')?
          form : { [form || rnd(['playful', 'formal', 'casual'], 'lower')]: 1 }
  // should the first/last names go together
  joined = (joined == undefined)? rnd(2) : joined  // first/lastname in one cell
  genders = (genders == undefined)? rnd(2) : genders  // should there be gender
  name1st = (playful && joined)? 1 : (name1st == undefined)? rnd(2) : name1st

  if (joined)  var nameAbbr = (joined.nameAbbr == undefined)?
    rnd(25,'%') : joined.nameAbbr   // should there be just the initials
  else  var naming = rnd(3)  // choosing naming combinations for name columns

  if (genders)  var [f, m] = Array.isArray(genders)?   // words for genders
    genders : [['female', 'male'], ['F', 'M']][ rnd(35, '%') ]

  if (formal)  var [dr, mr, mrs, miss] =      // abbreviations for titles
    rnd( [['Dr.', 'Mr.', 'Mrs.', 'Miss'], ['dr.', 'mr.', 'mrs.', 'miss']] )

  if (playful) {
    var { nick1st, nickLast, nickIn, nickEnd, quote } = playful,
    // an array to take nicknames from it later, preferrably unique
    nicksArr = makeArr(num, ()=> rnd(nicknames), 1, nicknames.length > num)
    // deciding the postion for nickname value
    if (!nick1st && !nickLast && !nickIn && !nickEnd)
      ({ nick1st, nickLast, nickIn, nickEnd } = { [['nick1st', 'nickLast',
        'nickIn', 'nickEnd'][joined? rnd(4) : rnd(2)]]:1 })
    // choosing the sign around nickname
    quote = quote || rnd( ['"', "'", "~", '`', ':', '-', '='] )
    // what if nickname is between the first and last name and initials only
    if (joined && nickIn && nameAbbr) {
      if (joined.nameAbbr && !playful.nickIn)  [nickIn, nickEnd] = [0, 1]
      else nameAbbr = 0
    }
  }

  // generation section: filling the headers and rows with random data
  const headers = []

  if (nick1st)
    headers.push( rnd(['nick', 'nickname', 'nickname', 'alias', 'callsign']) )
  if (joined)  headers.push( rnd(['name', 'fullname', 'full name']) )
  else {
    if (formal)  headers.push('title')
    if (name1st)  headers.push( ['firstname', 'first name', 'name'][naming] )
    headers.push( ['lastname', 'last name', 'surname'][naming] )
    if (!name1st)  headers.push( ['firstname', 'first name', 'name'][naming] )
  }
  if (nickLast)
    headers.push( rnd(['nick', 'nickname', 'nickname', 'alias', 'callsign']) )
  if (genders)  headers.push('gender')

  const rows = makeArr(num, ()=> {
    // prepare variables for each row
    const male = rnd(males,'%'),
          last = rnd(lastNames)
    let first = rnd( [femaleNames, maleNames][male] )
    if (nameAbbr)  first = first[0]+'.'
    // nickname preparation
    if (playful)  var nick = nicksArr.pop()
    if (nickIn || nickEnd || playful && playful.quote)
      var _nick_ = quote + nick + quote
    // choice of the right title
    if (formal)  var title = !rnd(20)? dr : male? mr : rnd(3)? mrs : miss

    const row = []

    if (nick1st)  row.push(_nick_ || nick)
    // adds joined full name in format selected by various variables
    if (joined)  row.push( (title? title+' ' : '') + (name1st? first+' ' : '')
      + (nickIn? _nick_+' ' : '') + last + (!name1st? ', '+first : '')
      + (nickEnd? ' aka '+_nick_ : '') )
    else {
      if (formal)  row.push(title)
      if (name1st)  row.push(first)
      row.push(last)
      if (!name1st)  row.push(first)
    }
    if (nickLast)  row.push(_nick_ || nick)
    if (genders)  row.push( [f, m][male] )

    return row
  })
  return [headers, rows]
}


// generates records with birthdays and corresponding age
const birthAge = (num=100, options={}) => {
  /* options may be like
  {
    age: 1 or 0,                // show age or don't, random 5:1 otherwise
    spread: [
      minAge: number in years,   maxAge: number in years
      tendency: 'younger','average','older'       // even spread otherwise
    ],                                      // 19-69, 'younger' if omitted
    birthday: 1 or 0,      // show birthday or don't, random 2:1 otherwise
    format: string like 'DD.MM.YYYY' // randomly selected preset otherwise
  } */

  let { age, spread, birthday, format } = options,
      // deciding the limits for ages and how do they spread
      [ minAge, maxAge, tendency ] = spread || [19, 69, 'higher']
  const adultYearsAgo = new Date().getFullYear() - minAge,
        elderYearsAgo = new Date().getFullYear() - maxAge,
        // timestamps for earliest/latest birthdays possible
        beginTimestamp = new Date( String(elderYearsAgo) ).getTime(),
        endTimestamp   = new Date( String(adultYearsAgo) ).getTime(),
        year = 365.25*864e5  // just a constant for millisaconds in a year

  // processing all possible combinations of present/absent age/birthday
  if (age == undefined && birthday == undefined)
      age = rnd(6),       birthday = age? rnd(3) : 1
  else if (!age && birthday === 0)     age = 1
  else if (!age && !birthday)     birthday = 1
  else if ( age && birthday === undefined)  birthday = rnd(3)
  else if (!age === undefined && birthday)       age = rnd(6)

  if (tendency)  tendency =
    ['higher','center','lower'][['younger','average','older'].indexOf(tendency)]
  // generate an array of birthdays as was planned
  let birthdays = makeArr( num, ()=>
    standartDatetime(new Date( rnd(beginTimestamp, endTimestamp, tendency) ) ) )

  const headers = [], columns = []
  if (age)
    headers.push('age'),
    // generate an array of ages according to birthdays
    columns.push( birthdays.map( datetime =>
      Math.floor( (Date.now() - new Date(datetime).getTime()) / year ) ) )
  if (birthday) {
    headers.push(rnd( ['born','born on','date of birth','d.o.b.','birthday'] ))
    // decide on format and format birthdays accordingly
    format = format || rnd( ['YYYY-MM-DD', 'DD.MM.YYYY', 'DD.MM.YY', 'MM/DD/YY',
                     "DD month 'YY",'DDth of Month, YYYY', 'Month DDth, YYYY'] )
    columns.push( birthdays.map( datetime =>
      formatDatetime(datetime, format) ) )
  }
  return [headers, flipNested(columns)]  // flip columns array to the rows array
}


// generates records with cities and corresponding countries
const origins = (num=100, options={}) => {
  /* options may be like
  {
    columns: 1 or 2,    // if only the number matters
    joined: 1 or 0,     // should city and country go in one field
    city: 1 or 0,                 // show or don't show the cities
    country: 1 or 0,              // show or don't show countries
    // city or country would be shown anyway
    preset: 0, 1, 2 or 3     // alternative to previous properties, options are:
                // 0 - country, 1 - "city, country", 2 - city, country, 3 - city
  }     // in case of no options random preset      */

  let { columns, joined, city, country, preset } = options,
      // should city column go before country
      city1st = !joined && rnd(2)

  if (columns) {   // in case if preset choice depends on the number of columns
    if      (columns == 1)  preset = rnd([0, 3])
    else if (columns == 2)  preset = 2
  }

  preset = (preset === undefined)? rnd(4) : preset
  // 0 - country, 1 - "city, country", 2 - city, country, 3 - city

  // in case city and country should be in one cell
  if (city !== 0 && country !== 0 && joined !== 0  &&  preset == 1  ||  joined)
    return [ [rnd( ['origin','residence','where from','from','city, country'])],
      makeArr(num, ()=> {
        const pair = rnd(cities)
        return [`${ pair[0] }, ${ pair[1] }`]
      } ) ]

  // in case city / country is not defined directly
  if (   city === undefined)  city = (country !== 0)? preset : 1
  if (country === undefined)  country = 3 - preset

  if (city && country) {         // in case city & country are in separat cells
    if (options.city<=options.country || city1st)           // city first
      return [ ['city','country'], rnd(cities, num) ]
    // country first
    return [ ['country','city'], makeArr(num, ()=> [...rnd(cities)].reverse() )]
  }

  if (city)   // in case there shoud be only city
    return [ [rnd( ['city','from'] )], makeArr(num, ()=> [rnd(cities)[0]] ) ]

  else     // in case there shoud be only country
    return [ [rnd( ['country','from'] )], makeArr(num, ()=> [rnd(cities)[1]]) ]
}


// generates records with {columns:2 or 1} of valid CSS-color names
const colouring = (num=100, options={}) => {
  const columns = options.columns || rnd(3)

  if (columns == 2) {    // for 2 columns of colors
    const headers = rnd( [['primary color','secondary color'],
                      ['main color','accent color'], ['1st color','2nd color'],
                      ['first color','second color'], ['color 1','color 2']] )
    return [ headers, flipNested( [rnd(colors, num), rnd(colors, num)] ) ]
  }
  else {                // for 1 column of colors
    const header = rnd( ['color','favorite color','selected color',
                        'preferred color','color preference','color key'] )
    return [ [header], flipNested( [rnd(colors, num)] ) ]
  }
}


// generates an array of [distinct] random combinations of "feature creature"
const familiars = (num=100, distinct) =>
  makeArr( num, ()=> rnd(features, creatures), distinct )


// generates a string like "74/100" or "20/20"
const makePoints = (options={}) => {
  /* options may be like
  {
    exactCap: any positive integer,     // if provided other caps ignored
    minCap: any positive integer,    // last digit auto-drops to 0, default:  10
    maxCap: any positive integer,    // last digit auto-drops to 0, default: 120
    fullPercentage: 1 to 100  // percentage of values equal to cap, default:  50
  }   */

  let { exactCap, minCap, maxCap, fullPercentage } = options
  fullPercentage = fullPercentage || 50
  // if no exact cap desired
  if (!exactCap)  minCap = Math.floor(minCap / 10) || 1,
                  maxCap = Math.floor(maxCap / 10) || 12

  const cap = exactCap || rnd(minCap, maxCap) * 10,
        multiplier = (100 - 100/cap) / (100 - fullPercentage)

  const value = Math.min( rnd(1, cap * multiplier), cap )
  return  value + '/' + cap
}


// generates an array of records with hitpoints, mana, stamina
const charPoints = (num=100, options={}) => {
  /* options may be like
  {
    columns: 1, 2 or 3,     // number of columns desired
    preset: 0, 1, 2 or 3    // alternative to columns property, options are:
    // 0 - stamina, 1 - hp, stamina, 2 - hp, mana, stamina, 3 - hp, mana, 4 - hp
  }     // in case of no options random preset is chosen      */

  let { columns, preset } = options

  if (preset === undefined) {            // in case of no preset specified
    if (!columns)  preset = rnd(5)
    else  switch(columns) {  // choose preset according to the number of columns
      case 1:  preset = rnd( [0, 4] );      break
      case 2:  preset = rnd( [1, 3] );      break
      default: preset = 2
    }
  }
  const hpHeader = rnd( ['life','hitpoints'] ),     // choosing the headers
        manaHeader = rnd( ['mana','magicka'] ),
        headers = [];  columns = []

  if (preset)  headers.push(hpHeader),  columns.push( makeArr(num, makePoints) )
  if (preset == 2 || preset == 3)
             headers.push(manaHeader),  columns.push( makeArr(num, makePoints) )
  if ( [0,1,2].includes(preset) )
              headers.push('stamina'),  columns.push( makeArr(num, makePoints) )

  return [ headers, flipNested(columns) ]
}


// generate an array of records with phrase excerpts from Shakespeare's sonnets
const quoting = (num=100) => {
  const header = rnd( ['motto', 'creed', 'code phrase', 'quote'] ),
        rows = makeArr( num, ()=> ['"' + rnd( rnd(sonnets) )
          .replace(/[,?;:!\.]$|\.\.\.$| —$/,  '')  // clean end punctuation sign
            + rnd( {'.': 12, '!': 3, '?': 1} ) + '"'] )   // add another instead
  return [ [header], rows ]
}


// generates a number with comma separated thousands with maximum digits length
const makeAmount = (digits=4) =>
  addCommas( rnd(1000) * 10**rnd(digits - 2) + '')


// generates an array of records with scores
const scoring = (num=100, options={}) => {
  /* options may be like
  {
    columns: 1, 2 or 3,     // number of columns desired
    preset: 0, 1, 2 or 3    // alternative to columns property, options are:
    // 0 - won; 1 - score,won; 2 - score,won,tries; 3 - score,tries; 4 - tries
  }     // in case of no options random preset is chosen      */

  let { columns, preset } = options

  if (preset === undefined) {            // in case of no preset specified
    if (!columns)  preset = rnd(5)
    else  switch(columns) {  // choose preset according to the number of columns
      case 1:  preset = rnd( [0, 4] );      break
      case 2:  preset = rnd( [1, 3] );      break
      default:  preset = 2
    }
  }
  const score = rnd(['score','points total']),     // choosing the headers
        games = rnd(['rounds won','battles won']),
        headers = [];  columns = []

  if (preset)
    headers.push(score),  columns.push( makeArr(num, ()=> makeAmount(8)) )
  if ( [0,1,2].includes(preset) )  headers.push(games),
    columns.push( makeArr(num, ()=> rnd( [rnd(1),rnd(50),rnd(300),rnd(1000)])) )
  if (preset == 2 || preset == 3)  headers.push('tries before quitting'),
    columns.push( makeArr(num, ()=> rnd( [1, 2, 3, rnd(4, 70), rnd(4, 400)] )) )

  return [ headers, flipNested(columns) ]
}


// generates an array of records with accounting numbers
const accounting = (num=100, options={}) => {
  /* options may be like
  {
    columns: 1, 2, 3 or 4,     // number of columns desired
    preset: 0, 1, 2 or 3    // alternative to columns property, options are:
    // 0 - income,spendings; 1 - balance,income,spendings; 2 - score,won,tries; 3 - score,tries; 4 - tries
  }     // in case of no options random preset is chosen      */

  let { columns, preset } = options

  if (preset === undefined) {            // in case of no preset specified
    if (!columns)  preset = rnd(5)
    else  switch(columns) {  // choose preset according to the number of columns
      case 1:  preset = 4;                  break
      case 2:  preset = rnd( [0, 3] );      break
      case 3:  preset = 1;                  break
      default:  preset = 2
    }
  }
  const  headers = [];  columns = []

  if (preset)  headers.push('balance'),
    columns.push( makeArr(num, ()=> '$'+[0, makeAmount(7)][rnd(92,'%')]+'.00') )

  if ( [0,1,2].includes(preset) )  headers.push('income','spendings'),
    columns.push( makeArr(num, ()=> {
      const sum = [0, makeAmount(5)][rnd(83,'%')]
      return (sum? '+' : '') + '$' + sum + '.00'
    }), makeArr(num, ()=> {
      const sum = [0, makeAmount(5)][rnd(83,'%')]
      return (sum? '-' : '') + '$' + sum + '.00'
    }) )

  if (preset == 2 || preset == 3)  headers.push('debt'),
    columns.push( makeArr(num, ()=> '$'+[makeAmount(5), 0][rnd(77,'%')]+'.00') )

  return [ headers, flipNested(columns) ]
}


// generate an array of records with adequate created/modifed datetimes
const createModify = (num=100) => {
  const year = 365.25*864e5,
        rows = makeArr(num, ()=> {
          const created = rnd(year)
          return [ standartDatetime( new Date( Date.now() - created ) ),
                   standartDatetime( new Date( Date.now() - rnd(created) ) ) ]
        })
  return [ ['created','modified'], rows ]
}
