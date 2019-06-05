# believable-random-data-generator

Arrays of first and last names, nicknames, cities, countries, animals, colors, sonets, fantasy features, elements, creatures etc.

Functions to generate arrays of headers with rows of believable data (people, dates, score, accounting, game creatures and characteristics, timestamps, text) easily transformable into objects. May be used for generating stub JSON for training data manipulation or for mockups. Also some functions for transforming arrays of headers and rows into objects and back.And do the same for ```rndneeds.js``` if you're planning to use ```rnd(...)``` for dates or generation of arrays of random values at one go.

I made it for enjoyable table component development.

Versatile ```rnd(...)``` function for numbers, arrays, objects, dates, string combinations etc is from [my other project](https://github.com/UniBreakfast/rnd) so look there for elaborate documentation on how to use it.


## Table of Contents:

  * [Installation](#installation)
  * [Usage](#usage)
    * [shorthand for Math.random()](#example-0---mathrandom-shorthand)

    1. [random integer](#example-group-1---integers)
    1. [random character from a range](#example-group-2---characters)
    1. [random date](#example-group-3---dates)
    1. [random array element](#example-group-4---array-elements)
    1. [random object key by weight](#example-group-5---object-property-names)
    1. [random true/false by percentage](#example-group-6---boolean-with-probability)
    1. [predictably altered random](#example-group-7---predictably-altered-probability)
    1. [arrays of random results](#example-group-8---make-arrays-of-results)
    1. [preformatted dates](#example-group-9---preformatted-dates)
  * [Contributing](#contributing)
  * [Credits](#credits)
  * [License](#license)


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


### Example group X - GROUP_NAME:

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example


### Example group X - GROUP_NAME:

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example


### Example group X - GROUP_NAME:

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example

  Text before example

  ```js
    > persons
    // ""  - random something like that
  ```

  Text after example




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
