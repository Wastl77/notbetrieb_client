import { useState } from 'react'
import styles from './IncidentForm.module.css'

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
