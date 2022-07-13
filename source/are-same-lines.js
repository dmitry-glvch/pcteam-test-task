export default (line1, line2) => {

  if (line1 === line2)
    return true

  if (line1.length !== line2.length)
    return false

  for (let i = 0; i < line1.length; ++i)
    if (line1[i] !== line2[i])
      return false

  return true

}
