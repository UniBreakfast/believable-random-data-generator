
// generate an array of records with person information
const persons = (num=10, options={}) => {
  /* options may be like
  {   // for details on options objects passed deeper see their docs or examples
    omitRest: 0 or 1,   // if not enabled all omitted options are randomly added
    useId: 0, 1 or { ...options for ids function are: preset, chars },
    naming: { ...options to be passed into namesGenders function are: form,
      joined, name1st },       // only this one does not obey to omitRest and
                               // is generated even if omitted
    genders: 0, 1 or { ...sub-options for genders option for namesGenders func},
    birthdays: 0, 1 or { ...option for birthAge function is: spread },
    age: 0, 1 or { ...option for birthAge function is: format },
    origin: 0, 1, 2 (for 1 or 2 columns) or { ... options for origins function
      are: columns, preset, city, country, joined }
    status: 0 or 1,     // should result contain status column or not
    colors: 0, 1 or 2,  // should there be 1 or 2 columns with CSS colors
    creatures: 0, 1, 2 (for 1 or 2 columns of style-appropriate creatures) or
      { fauna: 0, 1 or 2,      // number of columns with real animals
       fantasy: 0, 1 or 2 },   // columns with fantasy creatures or characters
    points: 0, 1, 2, 3 (for the respective number of columns) or
      { preset: number to be passed into the charPoints functions },
    quote: 0 or 1,  // should result contain Shakespeare's quote column or not
    account: 0, 1, 2, 3 or 4,  // number of columns for the financial info
    scores: 0, 1, 2 or 3,      // number of columns for the player scoring
    sentence: 0 or 1,      // should there be a column with the lorem sentence
    paragraph: 0 or 1,     // should there be a column with the lorem paragraph
    timestamp: 0 or 1 // should there be columns with created/modified datetime
  }
  // remember: if omitRest isn't set to true omitted are taken at random

  an example options: {
    omitRest: 1,
    useId: { preset: 0, chars: ['-',''] },
    naming: { form: 'playful', joined: 1 }, genders: 1,
    birthdays: 1, age: 1,
    origin: { joined: 1 },
    status: 1, colors: 1,
    creatures: { fantasy: 2, fauna: 1 },
    points: 3, quote: 1,
    scores: 3, sentence: 1,
    timestamp: 1
  }               */

  let { omitRest, useId, naming={}, genders, birthdays, age, origin, status,
    colors, creatures, points, quote, account, scores, sentence, paragraph,
    timestamp } = options

  // style selection in case in wasn't selected explicitly (playful more often)
  if (!naming.form)  naming.form = rnd(['playful', 'formal', 'casual'], 'lower')

  // in case if omitted options really should not be selected
  if (omitRest)  genders = (genders === undefined)? 0 : genders

  else {  // but in general case omitted options are randomly selected

    if (useId === undefined)  useId = rnd(5)  // should there be ids

    if (birthdays === undefined) {
      // should birthday and/or age columns be chosen randomly
      if (age === undefined)  var birth_or_age = rnd(5)
      else  birthdays = rnd(3)    // or decide just on birthdays column
    }                   // or decide just if there should be age column
    else if (age === undefined)  age = rnd(6)

    // should there be city and/or country columns
    if (origin === undefined)  origin = rnd(5)

    if (status === undefined)  status = rnd(2)  // should there be statuses

    // should there be colors column(s)
    if (colors === undefined)  colors = rnd(5)

    // should there be columns with creatures (animals or fantasy things)
    if (creatures === undefined || !creatures.fauna && !creatures.fantasy) {

      if (naming.form == 'casual' || naming.form.casual) {
        if ( rnd(5) )  creatures = {fauna: creatures || 1 + !rnd(4)}
      }  // in case casual style chosen have animals (1, 2 or random number)

      if (naming.form == 'playful' || naming.form.playful) {
        if ( rnd(5) )  creatures = {fantasy: creatures || 1 + !rnd(4)}
      }  // in case playful style chosen have fantasy creatures (1, 2 or random)
    }

    if (points === undefined         // should there be hitpoints, mana, stamina
      && ( naming.form == 'playful' || naming.form.playful ))  points = rnd(5)

    if (quote === undefined)  quote = rnd(5)     // should there be quote column

    // include accounting information if formal or casual style selected
    if (account === undefined && ( ['formal', 'casual'].includes(naming.form) || naming.form.formal || naming.form.casual ) )  account = rnd(5)

    if (scores === undefined      // should there be highscore, game stats etc.
      && ( naming.form == 'playful' || naming.form.playful ))  scores = rnd(5)

    // should there be lorem ipsum sentence of pseudo words
    if (sentence  === undefined)  sentence  =  rnd(3)

    // should there be lorem ipsum paragraph of pseudo text
    if (paragraph === undefined)  paragraph = !rnd(5)

    // should there be creaded and modified datetime columns
    if (timestamp === undefined)  timestamp =  rnd(7)
  }

  let result = []     // array for gradual assembly of result records arrays

  // accumulate the headers/rows parts according to options selected

  if (useId) result.push( [ ['id'], [ids(num, useId)] ] )

  const names = namesGenders( num, {...naming, genders} )
  result.push( [names[0], flipNested(names[1])] )

  if (birthdays || age || birth_or_age) {
    const options = birth_or_age? {}           // random choice of columns
      : { ...birthdays, ...age, birthday: birthdays, age }, // or explicit
          birth_age = birthAge(num, options)
    result.push( [ birth_age[0], flipNested(birth_age[1]) ] )
  }

  if (origin) {
    // pass the columns number if chosen without sub-options
    if (typeof origin == 'number')  origin = {columns: origin}
    const generated = origins(num, origin)
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  if (status)  result.push( [ ['status'], [ rnd( {'':9, 'active':3,
    'inactive':1, 'left':1, 'done':2, 'quit':1, 'deceased':1}, num ) ] ] )

  if (colors) {
    // pass the columns number if chosen without sub-options
    if (typeof colors == 'number')  colors = {columns: colors}
    const generated = colouring(num, colors)
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  if (creatures) {
    const { fantasy, fauna } = creatures

    if (fantasy) {
      // in case of two columns
      if (fantasy == 2)  result.push( [ ['playing character',
        'reserve character'], [familiars(num, 1), familiars(num, 1)] ] )
      // in case of one column
      else  result.push( [ [rnd( ['familiar', 'creature', 'character'] )],
        [familiars(num, 1)] ] )
    }

    if (fauna) {
      // in case of two columns
      if (fauna == 2)  result.push( [ ['animal 1', 'animal 2'],
        [rnd(animals, num), rnd(animals, num)] ] )
      // in case of one column
      else  result.push( [ [rnd( ['animal', 'totem', 'totem animal',
      'chosen animal'] )], [rnd(animals, num)] ] )
    }
  }

  if (points) {
    // pass the columns number if chosen without sub-options
    if (typeof points == 'number')  points = {columns: points}
    const generated = charPoints(num, points)
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  if (quote) {
    const generated = quoting(num, points)
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  if (account) {
    // pass the columns number if chosen without sub-options
    if (typeof account == 'number')  account = {columns: account}
    const generated = accounting(num, account)
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  if (scores) {
    // pass the columns number if chosen without sub-options
    if (typeof scores == 'number')  scores = {columns: scores}
    const generated = scoring(num, scores)
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  if (sentence) {
    // different headers (only) for playful or formal and casual style
    const header = (naming.form.playful || naming.form == 'playful')?
          rnd( ['', 'arcane','ancient','favorite','lorem'], ['spell','curse'] )
          : rnd( ['','lorem','fake','proverbial'], ['proverb'] )
          generated = [ [header], makeArr(num, ()=> [ lorem.sentence(2, 22) ]) ]
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  if (paragraph) {
    // different headers (only) for playful or formal and casual style
    const header = (naming.form.playful || naming.form == 'playful')?
          rnd( ['character bio', 'story'] ) : rnd( ['dossier', 'profile'] )
          generated = [[header], makeArr(num, ()=> [lorem.paragraph(22, 222)] )]
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  if (timestamp) {
    const generated = createModify(num)
    result.push( [ generated[0], flipNested(generated[1]) ] )
  }

  result = flipNested(result).map(arr=>arr.flat())     // flip and group results
  result[1] = flipNested(result[1])   // flip columns into rows (make "records")
  return result
}

// random spread for different numbers of columns - copy and run in console
// probe(makeArr(10000,_=>persons(1)).reduce((counts,cur)=>{const count=''+cur[0].length;counts[count]=counts[count]?counts[count]+1:1;return counts},{}))
