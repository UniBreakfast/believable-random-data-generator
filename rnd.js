// "swiss army knife" random function - result completely depends on parameters
const rnd =(...args)=> {
  // just for fun stats - counts how many times the rnd function ran total
  rnd.counter = 1 + (rnd.counter || 0)

  const [arg1, arg2, arg3] = args

  if (args.length == 1) {             // one argument cases...

    if (typeof arg1 == 'number')      // random integer from 0 to n-1
      return Math.floor( Math.random() * arg1 )

    if ( Array.isArray(arg1) )        // random array item
      return arg1[ rnd(arg1.length) ]

    if (arg1 == Date)   // random datetime between 1970 and now, standardized
      return standartDatetime(new Date( rnd(Date.now()) ))

    if (arg1 instanceof Date)         // random datetime between then and now
      return standartDatetime(new Date( rnd(arg1.getTime(), Date.now()) ))

    if (typeof arg1 == 'string') {

      if ( arg1.match( /^.-.$/ ) )    // random character in given range
        return String.fromCharCode(rnd(arg1.charCodeAt(0), arg1.charCodeAt(2)) )

      return formatDatetime( rnd(Date), arg1 )  // preformatted random datetime
    }

    // random object key with specific probability value
    if (typeof arg1 == 'object') {
      const max = Object.values(arg1).reduce( (sum, num)=> sum + num ),
            entries = Object.entries(arg1)
      let key;
      for (let num = rnd(max), i=0; num>=0; i++)
        key = entries[i][0],    num -= entries[i][1]
      return key
    }
  }

  if (args.length==2) {             // two arguments cases...

    if (arg2 == '%')        // random true/false with given probability of true
      return Number(rnd(1, 100) <= arg1)

    // random integer from minNumber to maxNumber
    if (typeof arg1=='number' && typeof arg2=='number') {
      const [min, max] =  arg1 < arg2?  [arg1, arg2]  :  [arg2, arg1]
      return Math.floor(min+(max-min+1)*Math.random())
    }

    if (typeof arg2=='number') // an array of rnd(arg1) items with length = arg2
      return makeArr( arg2, ()=> rnd(arg1) )

    if (Array.isArray(arg2))   // string pair of random values from two arrays
      return rnd(arg1)+' '+rnd(arg2)

    if (arg2 instanceof Date)  // random date between two dates (Date instances)
      return standartDatetime( new Date( rnd(arg1.getTime(), arg2.getTime()) ) )


    if (typeof arg2=='string') {  // like 'lower', 'higher', 'center', 'average'

      // random integer with probability towards lower, higher, center, average
      if (typeof arg1=='number')  return rnd(0, arg1-1, arg2)

      // random array item with lower, higher, medium or average index preferred
      if (Array.isArray(arg1))  return arg1[rnd(0, arg1.length-1, arg2)]
    }
  }

  if (args.length==3) {             // three arguments cases...

    if (arg3=='lower') {                      // random integer with linear
                // decrease of probability from minNumber towards maxNumber
      const min = Math.min(arg1, arg2) - 1,  // to normalize edge cases
            max = Math.max(arg1, arg2) + 1

      do  {  var num =  min + Math.abs( rnd(-max,-min) + rnd(min, max) )  }
      while  (min >= num || num >= max)    // retry on edge cases
      return num
    }

    if (arg3=='higher') {                      // random integer with linear
                 // increase of probability from minNumber towards maxNumber
      const min = Math.min(arg1, arg2) - 1,  // to normalize edge cases
            max = Math.max(arg1, arg2) + 1

      do  {  var num =  max - Math.abs( rnd(-max,-min) + rnd(min, max) )  }
      while  (min >= num || num >= max)    // retry on edge cases
      return num
    }

    if (arg3=='center') {              // random integer with linear increase
         // of probability towards the center between minNumber and maxNumber
      const  min1 = Math.floor( arg1 / 2 ),   min2 = arg1 - min1,
             max1 = Math.floor( arg2 / 2 ),   max2 = arg2 - max1
      return  rnd(min1, max1) + rnd(min2, max2)
    }

    if (arg3=='average') {          // random integer with quadratic increase
         // of probability towards the center between minNumber and maxNumber
      return  rnd( rnd(arg1, arg2), rnd(arg1, arg2) )
    }

    if (!arg3)  return rnd(arg1, arg2)  // foolproof for "falsey" values

    // otherwise it's just a number of rnd(arg1,arg2) items in the array
    return makeArr( arg3, ()=> rnd(arg1, arg2) )
  }

  return Math.random()  // if there are no valid parameters treat as Math.random
}

// examples:

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
