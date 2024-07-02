import { useState } from 'react'
import AlarmkeywordSelect from './AlarmkeywordSelect'
import styles from './IncidentForm.module.css'
import { KeywordConfiguration } from '../types'

const alarmkeywordConfiguration: Record<string, KeywordConfiguration> = {
  'F1.': {
    type: 'alarmkeyword',
    units: ['c-di', 'hlf', 'dlk'],
    openingKeyword: true,
    presentation: 'F1.'
  },
  'F2.': {
    type: 'alarmkeyword',
    allowedAdditions: ['Wohn.', 'WohnY.', 'Keller.'],
    units: ['c-di', 'hlf', 'hlf', 'dlk'],
    openingKeyword: true,
    presentation: 'F2.'
  },
  'F3.': {
    type: 'alarmkeyword',
    allowedAdditions: ['WohnY.'],
    units: ['b-di', 'c-di', 'c-di', 'hlf', 'hlf', 'hlf', 'dlk', 'gw-mess', 'rtw'],
    openingKeyword: false,
    presentation: 'F3.'
  },
  'R2.': { type: 'alarmkeyword', units: ['rtw', 'nef'], openingKeyword: true, presentation: 'R2.' },
  'R1.': { type: 'alarmkeyword', units: ['rtw'], openingKeyword: true, presentation: 'R1.' },
  'Wohn.': {
    type: 'addition',
    units: ['gw-mess', 'rtw'],
    openingKeyword: true,
    presentation: 'F2.[Wohn.]'
  },
  'WohnY.': {
    type: 'addition',
    units: ['rtw', 'nef', 'olrd'],
    openingKeyword: true,
    presentation: 'F3.[WohnY.]'
  },
  'Keller.': {
    type: 'addition',
    units: ['gw-mess', 'ab-slm'],
    openingKeyword: true,
    presentation: 'F2.[Keller.]'
  },
  rtw: { type: 'module', units: ['rtw'], openingKeyword: true, presentation: 'RTW' },
  hlf: { type: 'module', units: ['hlf'], openingKeyword: true, presentation: 'HLF' },
  'gw-mess': { type: 'module', units: ['gw-mess'], openingKeyword: true, presentation: 'GW-Mess' },
  'c-di': { type: 'module', units: ['c-di'], openingKeyword: true, presentation: 'C-Di' },
  drohne: {
    type: 'module',
    units: ['gw-mess', 'c-di'],
    openingKeyword: true,
    presentation: 'Drohne'
  },
  's-rtw': { type: 'module', units: ['s-rtw'], openingKeyword: true, presentation: 'S-RTW' }
  // Weitere Konfigurationsdaten hier hinzufügen...
}

function IncidentForm(): JSX.Element {
  const [activeNav, setActiveNav] = useState('incident')
  const [formIsActive, setFormIsActive] = useState(false)

  const handleFormClick = (): void => {
    if (!formIsActive) {
      setFormIsActive(true)
    }
  }

  const handleReset = (): void => {
    setFormIsActive(false)
  }

  const handleNavClick = (nav: string): void => {
    setActiveNav(nav)
  }

  return (
    <div
      className={
        activeNav === 'medicalTransport' || activeNav === 'emergencyRelocation'
          ? `${styles.container} ${styles.wide}`
          : formIsActive === true
            ? styles.container
            : `${styles.container} ${styles.inactive}`
      }
      onClick={handleFormClick}
    >
      <nav className={styles.incidentNav}>
        <p
          className={activeNav === 'incident' ? styles.activeNav : ''}
          onClick={() => handleNavClick('incident')}
        >
          Einsatz aufnehmen
        </p>
        <p
          className={activeNav === 'medicalTransport' ? styles.activeNav : ''}
          onClick={() => handleNavClick('medicalTransport')}
        >
          Krankentransport
        </p>
        <p
          className={activeNav === 'emergencyRelocation' ? styles.activeNav : ''}
          onClick={() => handleNavClick('emergencyRelocation')}
        >
          Notfallverlegung
        </p>
      </nav>
      <div className={styles.row1}>
        <label className={styles.label} htmlFor="street">
          Adresse
        </label>
        <input type="text" id={styles.street} name="street" placeholder="Straße" />
        <input type="text" id={styles.houseNumber} name="houseNumber" placeholder="Hnr." />
        <input type="text" id={styles.zipCode} name="zipCode" placeholder="PLZ" />
        <input type="text" id={styles.district} name="district" placeholder="Stadtteil" />
        <input type="text" id={styles.object} name="object" placeholder="Objekt" />
        <textarea name="hints" id="hints" placeholder="Manuelle Hinweise"></textarea>
        <label className={styles.label} htmlFor="reporter">
          Meldender
        </label>
        <input type="text" name="reporter" placeholder="Wer meldet" />
        <input type="text" name="phoneNumber" placeholder="Abweichende Rückrufnummer" />
        <label className={styles.label} htmlFor="reporter">
          Patient
        </label>
        <input
          type="text"
          id={styles.patientLastname}
          name="patientLastname"
          placeholder="Nachname"
        />
        <input
          type="text"
          id={styles.patientFirstname}
          name="patientFirstname"
          placeholder="Vorname"
        />
        <div className={styles.patientBirthdateContainer}>
          <input
            type="text"
            id={styles.patientBirthdate}
            name="patientBirthdate"
            placeholder="Geburtsdatum"
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => (e.target.value === '' ? (e.target.type = 'text') : null)}
          />
          <div className={styles.resetCircle}></div>
        </div>
        <p id={styles.gender}>Geschlecht:</p>
        <div className={styles.genderRadioContainer}>
          <input
            type="radio"
            name="gender"
            id="unknown"
            value="unknown"
            checked
            className={styles.genderRadio}
          />
          <label htmlFor="unknown" className={styles.genderLabel}>
            u
          </label>
          <input type="radio" name="gender" id="male" value="male" className={styles.genderRadio} />
          <label htmlFor="male" className={styles.genderLabel}>
            m
          </label>
          <input
            type="radio"
            name="gender"
            id="female"
            value="female"
            className={styles.genderRadio}
          />
          <label htmlFor="female" className={styles.genderLabel}>
            w
          </label>
          <input
            type="radio"
            name="gender"
            id="diverse"
            value="diverse"
            className={styles.genderRadio}
          />
          <label htmlFor="diverse" className={styles.genderLabel}>
            d
          </label>
        </div>
        <AlarmkeywordSelect
          alarmkeywordConfiguration={alarmkeywordConfiguration}
          isFollowUpAlarm={true}
        />
      </div>
      <div
        className={
          activeNav === 'medicalTransport' || activeNav === 'emergencyRelocation'
            ? styles.row2
            : styles.hidden
        }
      ></div>
      <div className={styles.buttonField}>
        <button className={styles.resetButton} onClick={handleReset}>
          Verwerfen
        </button>
        <button className={styles.submitButton}>Ablegen</button>
      </div>
      {/* todo: verwerfen button welcher feld wieder dunkel 
      macht und forminhalte löscht */}
    </div>
  )
}

export default IncidentForm
