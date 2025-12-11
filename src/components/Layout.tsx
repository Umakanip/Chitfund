import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  setIsAuthenticated: (value: boolean) => void;
}

export default function Layout({ children, setIsAuthenticated }: LayoutProps) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/customers', label: 'Customers' },
    { path: '/schemes', label: 'Chit Schemes' },
    { path: '/payments', label: 'Payments' },
    { path: '/auctions', label: 'Auctions' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: '#007bff',
        color: 'white',
        padding: '15px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '24px' }}>Chit Fund Admin Portal</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </nav>
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #ddd',
        padding: '10px 0'
      }}>
        <div className="container" style={{ display: 'flex', gap: '20px' }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '8px 16px',
                textDecoration: 'none',
                color: location.pathname === item.path ? '#007bff' : '#333',
                fontWeight: location.pathname === item.path ? '600' : '400',
                borderBottom: location.pathname === item.path ? '2px solid #007bff' : '2px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <main style={{ flex: 1, padding: '20px 0' }}>
        <div className="container">
          {children}
        </div>
      </main>
      <footer style={{
        background: '#333',
        color: 'white',
        padding: '20px 0',
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <div className="container">
          <p>&copy; 2024 Chit Fund Admin Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

