import { resolve } from 'path'
import { readFileSync } from 'fs'

import parseLineTokens from './parse-line-tokens.js'
import areSameLines from './are-same-lines.js'
import writeResults from './write-results.js'


const tokens = {}
const groups = []
const groupless = new Set()

const assignGroup = (line, group) => {

  line.forEach((token, column) => {
    if (token !== '')
      tokens[token][column].group = group
  })

  groupless.delete(line)
}


const inputFilePath = resolve(process.cwd(), process.argv[2])
const outputFilePath = resolve(process.cwd(), process.argv[3])


readFileSync(inputFilePath)
  .toString()
  .split(/\r?\n/)
  .map((line) => parseLineTokens(line))
  .filter((tokenLine) => tokenLine.length > 1)
  .forEach((tokenLine) => {

    let uniqueLine = true
    let lineGroup = undefined

    tokenLine.forEach((token, column) => {

      const checkGroplessness = () => {
        if (column === tokenLine.length - 1 && !lineGroup)
          groupless.add(tokenLine)
      }


      if (!uniqueLine || token === '')
        return


      if (tokens[token]?.[column] === undefined) {

        tokens[token] = tokens[token] ?? {}
        tokens[token][column] = tokens[token][column] ?? { line: tokenLine }

        return checkGroplessness()
      }


      const tc = tokens[token][column]

      if (lineGroup) {
        if (tc.group)
          lineGroup = tc.group
        else {
          lineGroup.push(tc.line)
          assignGroup(tc.line, lineGroup)
        }
      }
      
      else if (column === 0 && areSameLines(tokenLine, tc.line))
        return uniqueLine = false

      else {
        if (tc.group)
          tc.group.push(tokenLine)

        else {
          const group = [ tokenLine, tc.line ]
          groups.push(group)
          assignGroup(tc.line, group)
        }

        lineGroup = tc.group
        assignGroup(tokenLine.slice(0, column), lineGroup)
      }

      checkGroplessness()

    })
  })


writeResults(groups, groupless, outputFilePath)
