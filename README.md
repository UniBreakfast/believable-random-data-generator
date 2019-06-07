# believable-random-data-generator

Arrays of first and last names, nicknames, cities, countries, animals, colors, sonets, fantasy features, elements, creatures etc.

Functions to generate arrays of headers with rows of believable data (people, dates, score, accounting, game creatures and characteristics, timestamps, text) easily transformable into objects. May be used for generating stub JSON for training data manipulation or for mockups. Also some functions for transforming arrays of headers and rows into objects and back.

I made these for enjoyable table component development.

To see it in action just go to the [unibreakfast.github.io/believable-random-data-generator/](https://unibreakfast.github.io/believable-random-data-generator/) and hit ```F5``` (refresh) until satisfied - there will be different columns, headers and values every time. The table with fixed headers, footers and 1st column is from [my other project](https://github.com/UniBreakfast/web-table-w-fixed-first-last).

Versatile ```rnd(...)``` function for numbers, arrays, objects, dates, string combinations etc is from [my other project](https://github.com/UniBreakfast/rnd) so look there for elaborate documentation on how to use it.


## Table of Contents:

  - [Installation:](#installation)
  - [Usage:](#usage)
    - [Example group 0 - Basic usage of persons(num):](#example-group-0---basic-usage-of-personsnum)

    1. [Example group 1 - Using persons(...) with custom results:](#example-group-1---using-persons-with-custom-results)
  - [Contributing:](#contributing)
  - [Credits:](#credits)
  - [License:](#license)


## Installation:

Take **```transformations.js, utilitary.js, rnd.js, stuff.js, partials.js, stuffing.js```** files and put them in your project's folder and add tags

  ```html
    <script src="transformations.js">
    <script src="utilitary.js">
    <script src="rnd.js">
    <script src="stuff.js">
    <script src="partials.js">
    <script src="stuffing.js">
  ```

and the rest to your html if it suits you.
Or you may include them from github directly with

  ```html
    <script src="https://raw.githubusercontent.com/UniBreakfast/believable-random-data-generator/master/transformations.js">
    <script src="https://raw.githubusercontent.com/UniBreakfast/believable-random-data-generator/master/utilitary.js">
    <script src="https://raw.githubusercontent.com/UniBreakfast/rnd/master/rnd.js">
    <script src="https://raw.githubusercontent.com/UniBreakfast/believable-random-data-generator/master/stuff.js">
    <script src="https://raw.githubusercontent.com/UniBreakfast/believable-random-data-generator/master/partials.js">
    <script src="https://raw.githubusercontent.com/UniBreakfast/believable-random-data-generator/master/stuffing.js">
  ```

If you only need the arrays they are in the ```stuff.js```


## Usage:

### Example group 0 - Basic usage of persons(num):

  If you just need some random JSON to play with or to practice on, just call the ```persons(...)``` function with one argument - the number of record-like sub-arrays you'd like to have in a nested array of results like that

  ```js
    > persons(4)
    // [
    //   ["id", "full name", "gender", "color", "totem animal"],
    //   [
    //     ["02", "Chau, Celina", "female", "Coral", "vulture"],
    //     ["07", "Starr, Jaquez", "male", "Cyan", "sand dollar],
    //     ["10", "Hall, Davis", "male", "RosyBrown", "trout"],
    //     ["14", "Delgado, Ashlynn", "female", "DarkRed", "buffalo"]
    //   ]
    // ]  - random something like that, columns/values are different every time
  ```

  The default result is a nested array with two sub-arrays: one with headers and one with rows of respective values. They are like that in order to fit in a table view. By default ```persons(num)``` will generate a random number of columns that may vary from 3 to 23. And it's gravitate towards the 14 columns. Here is the spread of probability for differend number of columns on default call

  ![Number of columns generated is on the left, times that number was generated shown with the bar lentght](https://raw.githubusercontent.com/UniBreakfast/believable-random-data-generator/master/Graph01.PNG)

  Columns (and respective values) that may be or not be in the result are **_ids, first and last names, nicknames, titles, genders, countries and cities of origin, age, birthdays, status, colors, animals, fantasy creatures, game points, scores, financial accounting info, quotes, sentences, paragraphs, timestamps_**. And their format may vary too.

  If you prefer the result to be an object with ```headers, rows``` properties transform it upon receive like that

  ```js
    > recordsAsObject( persons(3) )
    // {
    //   headers: ["name", "surname", "nick", "city", "country",
    //             "creature", "hitpoints", "stamina", "rounds won"],
    //   rows: [
    //     ["Noe",    "Sauer", "Groundhog", "Johannesburg", "South Africa",
    //      "future nagual", "110/110", "90/90", 179],
    //     ["Hailie", "Davis", "Fantastic",   "Cordoba",     "Argentina",
    //      "gross dwarf",    "10/40",  "30/30", 241],
    //     ["Alaina",  "Rea",   "Samurai",    "Tabriz",        "Iran",
    //      "invisible ogre", "52/60",  "90/90",  84]
    //   ]
    // }  - random something like that, again headers/values vary heavily
  ```

  And if you need the same kind of data fit for tables but in the form of an of objects with properties/values you may objectify the result like this

  ```js
    > objectifyRecords( persons(5) )
    // [
    //   {id: "02", lastname: "MacDonald", firstname: "Bridgette",
    //    alias: "Solitude", color: "DarkSlateGray", score: "402,000"},
    //   {id: "04", lastname: "Boyle",     firstname: "Lizbeth",
    //    alias: "Zena",     color: "LightBlue",     score: "6,860,000"},
    //   {id: "05", lastname: "Watters",   firstname: "Emmett",
    //    alias: "Chucky",   color: "Black",         score: "22,300,000"},
    //   {id: "07", lastname: "Vu",        firstname: "Ralph",
    //    alias: "Bronze",   color: "Purple",        score: "98,200"},
    //   {id: "11", lastname: "Gagnon",    firstname: "Armani",
    //    alias: "Athena",   color: "Chocolate",     score: "65,400"},
    // ]  - random something like that
  ```

  This last format is suitable for ```console.table(...)```


### Example group 1 - Using persons(...) with custom results:

  Function persons(num [, options]) accepts the following options:

  ```js
    > persons(num, {
        omitRest,  // if this it NOT set to truthy, all omitted options are
                   // randomized! If it is truthy, only specified options
                   // will determine the columns/values of the result, so
                   // there will be no other columns
        useId,   // 0, 1 or {...}   - options for ids(...) function
        naming,   // {...}   - options for namesGenders(...) function
        genders,   // 0, 1 or {...}   - sub-options for genders option for
                   //                    namesGenders(...) function
        birthdays,  // 0, 1 or {...}   - options for birthAge(...) function
        age,     // 0, 1 or {...}   - options for birthAge(...) function
        origin,   // 0, 1, 2   - columns or {...} - options
                  //          for origins(...) function
        status,    // 0 or 1   - here and below numbers without detailed
                   //           explanations mean simply the number of columns
        colors,  // 0, 1 or 2   - columns with CSS colors
        creatures:  // 0, 1, 2   - columns with appropriate creatures or ...
        {
          fauna,   // 0, 1 or 2   - number of columns with real animals
          fantasy, // 0, 1 or 2   - columns with fantasy creatures or characters
        },
        points, // 0, 1, 2, 3    - columns
                // or {...}   - options for charPoints(...) function
        quote,   // 0 or 1   - should result contain Shakespeare's quote column
        account,  // 0, 1, 2, 3 or 4   - columns of financial info
        scores,  // 0, 1, 2 or 3   - columns for the player scoring
        sentence,   // 0 or 1    - lorem sentence
        paragraph,   // 0 or 1    - lorem paragraph
        timestamp   // 0 or 1    - created/modified datetime columns
      })
  ```

  Here is an example with options for a gaming flavored random mockup-data

  ```js
    > persons(40, {
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
      })
    // [
    //   ["id", "fullname", "gender", "age", "born", "from", "status", "favorite color", "playing character", "reserve character", "totem animal", "hitpoints", "magicka", "stamina", "quote", "points total", "rounds won", "tries before quitting", "ancient spell", "created", "modified"],
    //   [
    //     ["a-2", "Thalia :Curtisan: DeJesus", "F", 42, "22.08.1976", "Santo Domingo, Dominican Republic", "active", "LawnGreen", "brave changeling", "white tennin", "grouse", "54/110", "60/60", "20/20", `"How can my muse want subject to invent?"`, "1,260,000", 15, 69, "Ad mauris purus vivamus semper neque vivamus viver itur molestie lectus, nibh id tempor gnutti nibh.", "2019-05-02 08:14:59", "2019-06-03 00:11:30"],
    //     ["a-3", "Maximillian :Unreal: Bean", "M", 29, "25.01.1990", "Khulna, Bangladesh", "", "CadetBlue", "true genie", "kinky striga", "capybara", "120/120", "40/40", "10/60", `"But he that writes of you, if he can tell."`, "449,000", 42, 210, "Vestibulum hendrerit commodo et vici, ultrices at, emper hac ultricies vitae quisque senectus nulla!", "2018-11-05 12:50:21", "2019-03-12 05:14:43"],
    //     ["b-2", "Daryl :Diablo: Liu", "M", 35, "02.06.1984", "Maracaibo, Venezuela", "", "Green", "mirror kami", "glacial goblin", "shark", "69/120", "10/10", "30/30", `"Beauteous thou art, therefore to be assail'd?"`, "30,000", 9, 1, "Dictumst tempor praesent phasellus feugiat, semper pendisse, vestibulum hac faucibus elit enim eget.", "2019-03-10 19:00:55", "2019-05-26 22:03:59"],
    //     ... 37 more rows like that
    //   ]
    // ]  - random something like that
  ```

  And here is an example for a shorter formal random data

  ```js
    > persons(20, {
        omitRest: 1,
        naming: { form: 'formal', joined: 1 },
        account: 4,
        timestamp: 1
      })
    // [
    //   ["full name", "balance", "income", "spendings", "debt", "created", "modified"],
    //   [
    //     ["Mrs. Bradshaw, Alissa", "$897,000.00", "$0.00", "-$5,440.00", "$0.00", "2018-08-19 17:56:06", "2018-11-20 02:52:05"],
    //     ["Mr. Betancourt, Rick", "$331.00", "+$79,800.00", "-$81,200.00", "$6,810.00", "2019-03-15 08:59:06", "2019-04-05 16:48:37"],
    //     ["Mr. Paulson, Lane", "$51,300.00", "+$7,110.00", "-$46,200.00", "$0.00", "2019-05-26 17:40:58", "2019-05-30 09:20:17"],
    //     ... 17 more rows like that
    //   ]
    // ]  - random something like that
  ```

  But if, for example, you try the same without the ```omitRest: 1``` option you'll get some other columns on random

  ```js
    > persons(20, {
        naming: { form: 'formal', joined: 1 },
        account: 4,
        timestamp: 1
      })
    // [
    //   ["id", "fullname", "gender", "age", "birthday", "country", "city", "color preference", "balance", "income", "spendings", "debt", " proverb", "created", "modified"],
    //   [
    //     ["1", "mr. Jace Martino", "M", 20, "07.08.1998", "Indonesia", "Medan", "White", "$1,440.00", "+$979.00", "-$6,940.00", "$0.00", "Morbi litora?", "2019-01-15 23:19:16", "2019-06-01 16:10:47"],
    //     ["2", "mrs. Teagan Delong", "F", 58, "14.03.1961", "Mexico", "Mexicali", "DarkMagenta", "$0.00", "+$9,400.00", "-$104.00", "$0.00", "Ligula quis eget urna sed felis pretium nec, vehic cras cursus, sit scelerisque consequat ultrices.", "2018-09-10 10:42:55", "2019-01-10 09:41:03"],
    //     ["3", "mr. Jovanni Hsu", "M", 58, "17.09.1960", "Brazil", "Recife", "LightPink", "$18,400.00", "+$4,100.00", "-$2,400.00", "$842.00", "Platea faucibus class perpetum gnutti conubia.", "2018-09-19 03:42:33", "2019-04-11 19:03:37"],
    //     ... 17 more rows like that
    //   ]
    // ]  - random something like that, and omitted options columns will be different each time
  ```

  And don't forget, you can easily pass the result through ```objectifyRecords(...)``` or have ```recordsAsObject(...)``` as you've seen in the previous Example group.


### Example group 2 - Partials - functions behind the persons(...):

  There are a lot of them actually.

  ```js
      ids(num [, options])    // generates id columns
      namesGenders(num [, options])    // generates columns with firstnames,
                                      // lastnames, nicknames, titles and gender
      birthAge(num [, options])    // generates birthdays and age columns
      origins(num [, options])    // generates city and country columns
      colouring(num [, options])    // generates columns with CSS-colors in them
      familiars(num [, distinct])    // generate fantasy creatures
      makePoints(options)    // generates points in game-like format like 73/100
      charPoints(num [, options])    // generates columns of game-like points
      quoting(num)    // simulate quotes from Shakespeare's sonnets
      makeAmount(digits)    // generates big numbers with comma-separation 1,000
      scoring(num [, options])    // generates columns with game-like scores
      accounting(num [, options])    // generates columns with financial info
      createModify(num)    // generates columns with datetime log-data
  ```

  All of these are documented quite well with the comments and examples inside the ```partials.js``` itself, so if you need to use them, [look there](https://github.com/UniBreakfast/believable-random-data-generator/blob/master/partials.js).

  There is one I find the funnies - it's the ```familiars(num, distinct)``` function. It's to be used to generate fantasy characters, creatures and entities. Some results are quite clever and some are just funny, I can read them for hours. :)

  ```js
    > familiars(100, 1)
    // ["bloody striker", "weird rogue", "mountain vampire",
    //  "electric projection", "rot copycat", "brittle crab",
    //  "morphic werecat", "crazy rover", "twin vibria", "fierce foglet",
    //  "rubber merc", "brass priest", "false prophet", "sane bannerman",
    //  "anxious upin", "emerald frightener", "meteoric cemetaur",
    //  "necro rat", "static satyr", "unchained bullvore", "static garkain",
    //  "agitated unicorn", "infernal wyrm", "insane armor", "spectral lynx",
    //  "agitated minotaur", "leather yanari", "wood myling", "rift faun",
    //  "necro acolyte", "gross guide", "stone wolf", "ink worm",
    //  "steam walker", "wise mutant", "magma pard", "sugar elemental",
    //  "ionic cerberus", "gorgeous renegade", "high form",
    //  "curious devourer", "friendly pillar", "divine unicorn",
    //  "cold twin", "winged lord", "lake carbuncle", "diamond warg",
    //  "sour armor", "copper endrega", "high fairy", "ice moss",
    //  "cloaked templar", "arcane fiend", "white visionary",
    //  "meteoric sphinx", "sturdy viking", "odd gremlin", "fallen vampire",
    //  "fire draconid", "dream bunny", "swamp garkain", "brass nargun",
    //  "sour tigris", "phasing moth", "high wisp", "happy creeper",
    //  "snow madness", "dubious lord", "quartz strix", "plain dude",
    //  "notorious widow", "future rider", "odd dude", "fluffy rat",
    //  "sapphire edge", "serenity goblin", "famed kabouter", "mech warden",
    //  "high servo", "sturdy knocker", "rubber cyclops", "light servant",
    //  "crazy grigg", "diamond assassin", "eerie goblin", "armored vine",
    //  "scarred shape", "invisible raven", "ether zeugl", "undead walker",
    //  "little construct", "crazy mimic", "brass star", "mud nomad",
    //  "violent priest", "wood priest", "sky faun", "ferocious lamia",
    //  "rainbow warden", "diamond bannerman"]  - random something like that
  ```

  And you can remove or add your own features and creatures to the respective arrays in ````stuff.js```` file, just as you can edit arrays with male and female names, lastnames, nicknames, cities, countries, animals etc in there.

  In a way similar to the way previous example works (internally) you can also generate people data with the ```namesGenders(...)``` function

  ```js
    > namesGenders(7)
    // [
    //   ["title", "first name", "last name", "gender"],
    //   [
    //     ["dr.", "Leonel", "Boudreau", "male"],
    //     ["mr.", "Alfred", "Bullock", "male"],
    //     ["miss", "Daniela", "Lockhart", "female"],
    //     ["mrs.", "Michelle", "Hardy", "female"],
    //     ["mr.", "Ahmad", "Eaton", "male"],
    //     ["mrs.", "Annette", "Means", "female"],
    //     ["mr.", "Dwight", "Schuster", "male"]
    //   ]
    // ]  - random something like that, again columns may be different
  ```

  And for the most of these partial functions, just as for the ```persons(...)``` function itself, if you omit the options parameter the result columns will be random as well.


## Contributing:

Larger projects often have sections on contributing to their project, in which contribution instructions are outlined. Sometimes, this is a separate file. If you have specific contribution preferences, explain them so that other developers know how to best contribute to my work. To learn more about how to help others contribute, check out the guide for setting guidelines for repository contributors.


## Credits:

Well I learned from ffflo and remade his https://github.com/fffilo/lorem-ipsum-js in a way that suits my taste. The rest is made by me.


## License:

This is free and unencumbered software released into the public domain.

 Anyone is free to copy, modify, publish, use, compile, sell, or
 distribute this software, either in source code form or as a compiled
 binary, for any purpose, commercial or non-commercial, and by any
 means.

 In jurisdictions that recognize copyright laws, the author or authors
 of this software dedicate any and all copyright interest in the
 software to the public domain. We make this dedication for the benefit
 of the public at large and to the detriment of our heirs and
 successors. We intend this dedication to be an overt act of
 relinquishment in perpetuity of all present and future rights to this
 software under copyright law.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
 OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

 For more information, please refer to [unlicense.org](http://unlicense.org)
