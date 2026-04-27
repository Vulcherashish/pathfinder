// import React from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../utils/AuthContext';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const isActive = (path) => location.pathname === path ? 'active' : '';

//   if (!user) return null;

//   return (
//     <nav className="navbar">
//       <Link to="/dashboard" className="navbar-brand">
//         Path<span>finder</span>
//       </Link>

//       <div className="navbar-nav">
//         {user.role === 'admin' ? (
//           <>
//             <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Dashboard</Link>
//             <Link to="/admin/jobs" className={`nav-link ${isActive('/admin/jobs')}`}>Jobs</Link>
//             <Link to="/admin/colleges" className={`nav-link ${isActive('/admin/colleges')}`}>Colleges</Link>
//             <Link to="/admin/users" className={`nav-link ${isActive('/admin/users')}`}>Users</Link>
//           </>
//         ) : (
//           <>
//             <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
//             <Link to="/quiz" className={`nav-link ${isActive('/quiz')}`}>Take Quiz</Link>
//             <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`}>Jobs</Link>
//             <Link to="/colleges" className={`nav-link ${isActive('/colleges')}`}>Colleges</Link>
//           </>
//         )}

//         <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
//           <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
//             Hi, {user.name?.split(' ')[0]}
//           </span>
//           <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
//             Logout
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  if (!user) return null;

  const profilePath = user.role === 'admin' ? '/admin-profile' : '/profile';

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="navbar-brand">
        Path<span>finder</span>
      </Link>

      <div className="navbar-nav">
        {user.role === 'admin' ? (
          <>
            <Link to="/admin" className={`nav-link ${isActive('/admin')}`}>Dashboard</Link>
            <Link to="/admin/jobs" className={`nav-link ${isActive('/admin/jobs')}`}>Jobs</Link>
            <Link to="/admin/colleges" className={`nav-link ${isActive('/admin/colleges')}`}>Colleges</Link>
            <Link to="/admin/users" className={`nav-link ${isActive('/admin/users')}`}>Users</Link>
            <Link to="/admin/quiz" className={`nav-link ${isActive('/admin/quiz')}`}>Quiz</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>Dashboard</Link>
            <Link to="/quiz" className={`nav-link ${isActive('/quiz')}`}>Take Quiz</Link>
            <Link to="/jobs" className={`nav-link ${isActive('/jobs')}`}>Jobs</Link>
            <Link to="/colleges" className={`nav-link ${isActive('/colleges')}`}>Colleges</Link>
          </>
        )}

        <div style={{ marginLeft: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Hi, {user.name?.split(' ')[0]}
          </span>
          
          {/* ✅ NEW: Profile Button */}
          <Link to={profilePath} className="btn btn-secondary btn-sm" style={{ marginRight: '4px' }}>
            👤 Profile
          </Link>

          <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;