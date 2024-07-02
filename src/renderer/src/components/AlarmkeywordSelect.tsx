import { useState } from 'react'
import styles from './AlarmkeywordSelect.module.css'
import { KeywordConfiguration } from '../types'
import { decapitalizeStrings } from '../utils/decapitalizeStrings'

type AlarmkeywordSelectProps = {
  alarmkeywordConfiguration: Record<string, KeywordConfiguration>
  isFollowUpAlarm: boolean
}

export default function AlarmkeywordSelect({
  alarmkeywordConfiguration,
  isFollowUpAlarm: isOpeningKeyword
}: AlarmkeywordSelectProps): JSX.Element {
  const [alarmkeywordInput, setAlarmkeywordInput] = useState('')
  const [hasFocus, setHasFocus] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const isOpen = hasFocus && alarmkeywordInput !== ''

  return (
    <div className={styles.container}>
      <label className={styles.label} htmlFor="alarmkeyword">
        Alarmierungsstichwort
      </label>
      <input
        type="text"
        id="alarmkeyword"
        placeholder="Alarmierungsstichwort"
        onChange={(e) => setAlarmkeywordInput(e.target.value.toLowerCase())}
        onFocus={() => setHasFocus(true)}
        onBlur={() => setHasFocus(false)}
      />
      <ul className={`${styles.alarmkeywordList} ${isOpen ? styles.show : ''}`}>
        {resolveAlarmkeywordInput(
          alarmkeywordInput,
          alarmkeywordConfiguration,
          isOpeningKeyword
        ).map((alarmkeyword) => (
          <li key={alarmkeyword[1]} className={`${styles.alarmkeywordListElement} `}>
            {alarmkeyword[1]}
          </li>
        ))}
      </ul>
    </div>
  )
}

const resolveAlarmkeywordInput = (
  alarmkeywordInput: string,
  alarmkeywordConfiguration: Record<string, KeywordConfiguration>,
  isFollowUpAlarm: boolean
): string[][] => {
  const returnedAlarmkeywords: string[][] = []
  const alarmkeywordArray = decapitalizeStrings(Object.keys(alarmkeywordConfiguration))

  if (alarmkeywordInput === '') {
    return []
  }

  const matchingKeywords = alarmkeywordArray.filter((alarmkeyword) =>
    alarmkeyword.startsWith(alarmkeywordInput)
  )

  matchingKeywords.forEach((alarmkeyword) => {
    // alarmkeyword = alarmkeyword.toUpperCase() ???
    switch (alarmkeywordConfiguration[alarmkeyword.toUpperCase()].type) {
      case 'alarmkeyword':
        returnedAlarmkeywords.push([
          alarmkeyword,
          alarmkeywordConfiguration[alarmkeyword.toUpperCase()].presentation
        ])
        if (alarmkeywordConfiguration[alarmkeyword.toUpperCase()].allowedAdditions) {
          alarmkeywordConfiguration[alarmkeyword.toUpperCase()].allowedAdditions?.forEach(
            (allowedAddition) => {
              returnedAlarmkeywords.push([
                `${alarmkeyword}[${allowedAddition}]`,
                `${
                  alarmkeywordConfiguration[alarmkeyword.toUpperCase()].presentation
                } + ${allowedAddition} (${allowedAddition.slice(0, -1)})`
              ])
            }
          )
        }
        break

      case 'addition':
        returnedAlarmkeywords.push([
          alarmkeyword,
          alarmkeywordConfiguration[alarmkeyword.toUpperCase()].presentation
        ])
        break

      default:
        break
    }
  })

  return returnedAlarmkeywords

  // return alarmkeywordArray.filter((alarmkeyword) => alarmkeyword.startsWith(alarmkeywordInput))
}
