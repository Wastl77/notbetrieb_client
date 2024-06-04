import { useState } from 'react'

function IncidentForm(): JSX.Element {
  const [activeNav, setActiveNav] = useState('incident')

  const handleNavClick = (nav: string): void => {
    setActiveNav(nav)
  }

  return (
    <div
      className={
        activeNav === 'medicalTransport' || activeNav === 'emergencyRelocation'
          ? 'container wide'
          : 'container'
      }
    >
      <nav className="incident-nav">
        <p
          className={activeNav === 'incident' ? 'activeNav' : ''}
          onClick={() => handleNavClick('incident')}
        >
          Einsatz aufnehmen
        </p>
        <p
          className={activeNav === 'medicalTransport' ? 'activeNav' : ''}
          onClick={() => handleNavClick('medicalTransport')}
        >
          Krankentransport
        </p>
        <p
          className={activeNav === 'emergencyRelocation' ? 'activeNav' : ''}
          onClick={() => handleNavClick('emergencyRelocation')}
        >
          Notfallverlegung
        </p>
      </nav>
      <div
        className={
          activeNav === 'medicalTransport' || activeNav === 'emergencyRelocation'
            ? 'incident-form wide'
            : 'incident-form'
        }
      >
        <div className="row1"></div>
        <div
          className={
            activeNav === 'medicalTransport' || activeNav === 'emergencyRelocation'
              ? 'row2'
              : 'hidden'
          }
        ></div>
      </div>
    </div>
  )
}

export default IncidentForm
