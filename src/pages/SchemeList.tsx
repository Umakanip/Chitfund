import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { mockApi } from '../services/mockApi';
import { ChitScheme } from '../types';

export default function SchemeList() {
  const [schemes, setSchemes] = useState<ChitScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadSchemes();
  }, []);

  const loadSchemes = async () => {
    try {
      const data = await mockApi.getSchemes();
      setSchemes(data);
    } catch (error) {
      console.error('Failed to load schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSchemes = filter === 'all'
    ? schemes
    : schemes.filter(s => s.status === filter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Chit Schemes</h1>
        <Link to="/schemes/add" className="btn btn-primary">
          Create New Scheme
        </Link>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label style={{ margin: 0 }}>Filter by Status:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            style={{
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px'
            }}
          >
            <option value="all">All Schemes</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {filteredSchemes.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            No schemes found
          </div>
        ) : (
          filteredSchemes.map(scheme => (
            <div key={scheme.id} className="card" style={{
              borderLeft: `4px solid ${
                scheme.status === 'active' ? '#28a745' :
                scheme.status === 'completed' ? '#007bff' : '#dc3545'
              }`
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{scheme.name}</h3>
              <div style={{ marginBottom: '15px' }}>
                <span className={`badge ${
                  scheme.status === 'active' ? 'badge-success' :
                  scheme.status === 'completed' ? 'badge-info' : 'badge-danger'
                }`}>
                  {scheme.status.toUpperCase()}
                </span>
              </div>
              <div style={{ color: '#666', lineHeight: '1.8' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>Total Amount:</strong> {formatCurrency(scheme.totalAmount)}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Monthly Installment:</strong> {formatCurrency(scheme.monthlyInstallment)}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Duration:</strong> {scheme.duration} months
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Members:</strong> {scheme.currentMembers} / {scheme.totalMembers}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Start Date:</strong> {scheme.startDate}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>End Date:</strong> {scheme.endDate}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
        Showing {filteredSchemes.length} of {schemes.length} schemes
      </div>
    </div>
  );
}

