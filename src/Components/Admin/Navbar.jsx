import React ,{useState} from 'react';
import './Navbar.css'; 

const Navbar = ({ hospitalName,setHospitalName }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [uniqueId, setUniqueId] = useState('');

  const handleLogout = () => {
  sessionStorage.clear();
  setIsLoggedIn(false);
  setHospitalName('');
  setUniqueId('');
};

  return (
    <header>
      <nav className="navbar">
        <ul className="nav-list">
          <div>
          <button onClick={handleLogout} style={{padding:'13px'}}><a href="/login">logout</a></button>
          </div>
          <li className='nav1' style={{padding:'13px'}}>{hospitalName ? `${hospitalName} Dashboard` : 'Your Dashboard'}</li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
