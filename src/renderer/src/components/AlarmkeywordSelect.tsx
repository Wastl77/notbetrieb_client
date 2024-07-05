import { useState } from 'react'
import styles from './AlarmkeywordSelect.module.css'
import { KeywordConfiguration } from '../types'
import { capitalizeAndReplaceY } from '../utils/capitalizeAndReplaceY'

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
  const resolvedAlarmkeywords: string[][] = []

  if (alarmkeywordInput === '') {
    return []
  }

  const matchingKeywords = Object.keys(alarmkeywordConfiguration).filter((alarmkeyword) =>
    alarmkeyword.startsWith(alarmkeywordInput)
  )

  matchingKeywords.forEach((alarmkeyword) => {
    switch (alarmkeywordConfiguration[alarmkeyword].type) {
      case 'alarmkeyword':
        resolvedAlarmkeywords.push([alarmkeyword, alarmkeyword.toUpperCase()])
        if (alarmkeywordConfiguration[alarmkeyword].allowedAdditions) {
          alarmkeywordConfiguration[alarmkeyword].allowedAdditions?.forEach((allowedAddition) => {
            resolvedAlarmkeywords.push([
              `${alarmkeyword}[${allowedAddition}]`,
              `${alarmkeyword.toUpperCase()} + ${capitalizeAndReplaceY(
                allowedAddition
              )} (${capitalizeAndReplaceY(allowedAddition.slice(0, -1))})`
            ])
          })
        }
        break

      case 'addition':
        resolvedAlarmkeywords.push([
          alarmkeyword,
          `${alarmkeywordConfiguration[
            alarmkeyword
          ].category?.toUpperCase()} + ${capitalizeAndReplaceY(
            alarmkeyword
          )} (${capitalizeAndReplaceY(alarmkeyword.slice(0, -1))})`
        ])
        break

      case 'module':
        resolvedAlarmkeywords.push([
          alarmkeyword,
          alarmkeywordConfiguration[alarmkeyword].presentation!
        ])
        break

      default:
        break
    }
  })

  return resolvedAlarmkeywords

  // return alarmkeywordArray.filter((alarmkeyword) => alarmkeyword.startsWith(alarmkeywordInput))
}
