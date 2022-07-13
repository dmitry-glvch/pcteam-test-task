import { parse } from 'csv-parse/sync'


export default (line) => {

  const tokens = parse(line, {
    delimiter: ';',
    skipRecordsWithError: true
  })
  .flat(1)

  return (tokens.some((t) => t.length > 0)) ? tokens : []

}
