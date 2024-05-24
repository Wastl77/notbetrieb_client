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
    </div>
  )
}

export default IncidentForm
