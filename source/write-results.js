import { openSync, writeSync, closeSync } from 'fs'

import { stringify as toCSV } from 'csv-stringify/sync'


export default (groups, groupless, outputPath) => {

  const fd = openSync(outputPath, 'w')

  writeSync(fd, `2+ sized groups count: ${groups.length}\n`)
  groups
      .sort((group1, group2) => group2.length - group1.length)
      .concat([...groupless].map((group) => [ group ]))
      .forEach((group, i) => {
        
        const stringifiedGroup = toCSV(group, {
          delimiter: ';',
          quoted_string: true
        })

        writeSync(fd, `\ngroup ${i + 1}\n${stringifiedGroup}`)
      })

  closeSync(fd)

}



