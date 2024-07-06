import { useState } from 'react'
import styles from './AlarmkeywordSelect.module.css'
import { KeywordConfiguration } from '../types'
import { capitalizeAndReplaceY } from '../utils/capitalizeAndReplaceY'

type AlarmkeywordSelectProps = {
  alarmkeywordConfiguration: Record<string, KeywordConfiguration>
  isFollowUpAlarm: boolean
  onChange: (alarmkeyword: string) => void
  alarmkeyword: string
}

export default function AlarmkeywordSelect({
  alarmkeywordConfiguration,
  isFollowUpAlarm,
  onChange,
  alarmkeyword
}: AlarmkeywordSelectProps): JSX.Element {
  const [alarmkeywordInput, setAlarmkeywordInput] = useState('')
  const [hasFocus, setHasFocus] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)

  const isOpen = hasFocus && alarmkeywordInput !== ''

  function selectAlarmkeyword(selectedAlarmkeyword: string): void {
    console.log(selectedAlarmkeyword)
    setAlarmkeywordInput(selectedAlarmkeyword)
    setHasFocus(false)
    setHighlightedIndex(0)
    onChange(selectedAlarmkeyword)
  }

  return (
    <div
      className={styles.container}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
    >
      <label className={styles.label} htmlFor="alarmkeyword">
        Alarmierungsstichwort
      </label>
      <input
        type="text"
        id="alarmkeyword"
        placeholder="Alarmierungsstichwort"
        onChange={(e) => setAlarmkeywordInput(e.target.value.toLowerCase())}
        // onFocus={() => setHasFocus(true)}
        // onBlur={() => setHasFocus(false)}
      />
      <ul className={`${styles.alarmkeywordList} ${isOpen ? styles.show : ''}`}>
        {resolveAlarmkeywordInput(
          alarmkeywordInput,
          alarmkeywordConfiguration,
          isFollowUpAlarm
        ).map((resolvedAlarmkeyword, index) => (
          <li
            // onClick={() => selectAlarmkeyword(resolvedAlarmkeyword[2])}
            onMouseEnter={() => setHighlightedIndex(index)}
            key={index}
            className={`${styles.alarmkeywordListElement} ${
              index === highlightedIndex ? styles.highlighted : ''
            }`}
          >
            {resolvedAlarmkeyword[2]}
          </li>
        ))}
      </ul>
    </div>
  )
}

const resolveAlarmkeywordInput = (
  // '+' und '/' splicen und zusammensetzen der Alarmwörter
  alarmkeywordInput: string,
  alarmkeywordConfiguration: Record<string, KeywordConfiguration>,
  isFollowUpAlarm: boolean
): string[][] => {
  // if (alarmkeywordInput.includes('+')) {
  //   const splittedAlarmkeyword = alarmkeywordInput.split('+')
  //   splittedAlarmkeyword.forEach((alarmkeyword) => {
  //     const transformed = transformAlarmkeyword(
  //       alarmkeyword,
  //       alarmkeywordConfiguration,
  //       isFollowUpAlarm
  //     )
  //     console.log(transformed)
  //   })
  // }
  if (alarmkeywordInput === '') {
    return []
  }

  return transformAlarmkeyword(alarmkeywordInput, alarmkeywordConfiguration, isFollowUpAlarm)
}

const transformAlarmkeyword = (
  alarmkeywordInput: string,
  alarmkeywordConfiguration: Record<string, KeywordConfiguration>,
  isFollowUpAlarm: boolean
): string[][] => {
  const resolvedAlarmkeywords: string[][] = []

  const matchingKeywords = Object.keys(alarmkeywordConfiguration).filter((alarmkeyword) =>
    alarmkeyword.startsWith(alarmkeywordInput)
  )

  matchingKeywords.forEach((alarmkeyword) => {
    switch (alarmkeywordConfiguration[alarmkeyword].type) {
      case 'alarmkeyword':
        resolvedAlarmkeywords.push([
          alarmkeyword,
          alarmkeyword.toUpperCase(),
          alarmkeyword.toUpperCase()
        ])
        if (alarmkeywordConfiguration[alarmkeyword].allowedAdditions) {
          alarmkeywordConfiguration[alarmkeyword].allowedAdditions?.forEach((allowedAddition) => {
            resolvedAlarmkeywords.push([
              `${alarmkeyword}[${allowedAddition}]`,
              `${alarmkeyword.toUpperCase()}[${capitalizeAndReplaceY(allowedAddition)}]`,
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
          ].category?.toUpperCase()}[${capitalizeAndReplaceY(alarmkeyword)}]`,
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
          alarmkeywordConfiguration[alarmkeyword].presentation!,
          alarmkeywordConfiguration[alarmkeyword].presentation!
        ])
        break

      default:
        break
    }
  })

  console.log(resolvedAlarmkeywords)

  return resolvedAlarmkeywords

  // return alarmkeywordArray.filter((alarmkeyword) => alarmkeyword.startsWith(alarmkeywordInput))
}
