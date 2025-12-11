import { useEffect, useState } from 'react';
import { mockApi } from '../services/mockApi';
import { Payment } from '../types';

export default function PaymentList() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await mockApi.getPayments();
      setPayments(data);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = filter === 'all'
    ? payments
    : payments.filter(p => p.status === filter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTotalAmount = () => {
    return filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  return (
    <div>
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Payments</h1>

      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
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
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
            Total: {formatCurrency(getTotalAmount())}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Scheme Name</th>
              <th>Amount</th>
              <th>Month</th>
              <th>Payment Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                  No payments found
                </td>
              </tr>
            ) : (
              filteredPayments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.customerName}</td>
                  <td>{payment.schemeName}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>Month {payment.month}</td>
                  <td>{payment.paymentDate || 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      payment.status === 'paid' ? 'badge-success' :
                      payment.status === 'pending' ? 'badge-warning' : 'badge-danger'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
        Showing {filteredPayments.length} of {payments.length} payments
      </div>
    </div>
  );
}

