

const rnd =(...args)=> {
  rnd.counter = rnd.counter? rnd.counter+1 : 1
  const [arg1,arg2,arg3] = args

  if (args.length==1) {
    if (typeof arg1 == 'number')
      return Math.floor(Math.random()*arg1)
    if (Array.isArray(arg1)) return arg1[rnd(arg1.length)]
    if (arg1==Date) return standartDatetime(new Date(rnd(Date.now())))
    if (arg1 instanceof Date)
      return standartDatetime(new Date(rnd(arg1.getTime(), Date.now())))
    if (typeof arg1 == 'string') {
      if (arg1.match(/^.-.$/))
        return String.fromCharCode(rnd(arg1.charCodeAt(0),arg1.charCodeAt(2)))
      return formatDatetime(rnd(Date), arg1)
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
    if (arg2=='%') return +(rnd(1,100)<=arg1)
    if (typeof arg1=='number' && typeof arg2=='number')
      return Math.floor(arg1+(arg2-arg1+1)*Math.random())
    if (typeof arg2=='number') return makeArr(arg2,_=>rnd(arg1))
    if (Array.isArray(arg2)) return rnd(arg1)+' '+rnd(arg2)
    if (arg2 instanceof Date)
      return standartDatetime(new Date(rnd(arg1.getTime(), arg2.getTime())))
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
}

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
