
export const capitalizeFirstLetter = (str) => {
  const dontCapitolize = (s) => {
    if (s[0] === '¢') return true
    else return false
  }
  if (!str)
    return str
  else if (str.length >= 2 && str[0].match(/[a-z]/i)) {
    return str[0].toUpperCase() + str.slice(1)
  }
  else if (str.length >= 1 && str[0].match(/[a-z]/i))
    return str[0].toUpperCase()
  else if (dontCapitolize(str))
    return str.slice(1)
  else
    return str
}