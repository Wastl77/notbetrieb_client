import { useState } from 'react'
import styles from './IncidentForm.module.css'

function IncidentForm(): JSX.Element {
  const [activeNav, setActiveNav] = useState('incident')

  const handleNavClick = (nav: string): void => {
    setActiveNav(nav)
  }

  return (
    <div
      className={
        activeNav === 'medicalTransport' || activeNav === 'emergencyRelocation'
          ? `${styles.container} ${styles.wide}`
          : styles.container
      }
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
      <div
        className={
          activeNav === 'medicalTransport' || activeNav === 'emergencyRelocation'
            ? `${styles.incidentForm} ${styles.wide}`
            : styles.incidentForm
        }
      >
        <div className={styles.row1}></div>
        <div
          className={
            activeNav === 'medicalTransport' || activeNav === 'emergencyRelocation'
              ? styles.row2
              : styles.hidden
          }
        ></div>
      </div>
    </div>
  )
}

export default IncidentForm
