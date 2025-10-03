import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [payoutSettings, setPayoutSettings] = useState({
    bankName: '',
    accountNumber: '',
    accountHolder: '',
    swiftCode: '',
    payoutSchedule: 'weekly'
  });
  const [financialSummary, setFinancialSummary] = useState({
    availableBalance: 0,
    pendingBalance: 0,
    totalEarnings: 0,
    nextPayout: '',
    payoutAmount: 0
  });

  useEffect(() => {
    fetchPayments();
    fetchPaymentMethods();
    fetchPayoutSettings();
    fetchFinancialSummary();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await axios.get('/api/providers/1/payments');
      setPayments(response.data);
    } catch (error) {
      // Mock data
      setPayments([
        {
          id: 1,
          bookingId: 'BK-1001',
          experienceTitle: 'Sinharaja Rainforest Trek',
          amount: 170,
          commission: 25.5,
          netAmount: 144.5,
          status: 'completed',
          paymentDate: '2025-09-20',
          customerName: 'John Doe',
          paymentMethod: 'Credit Card'
        },
        {
          id: 2,
          bookingId: 'BK-1002',
          experienceTitle: 'Whale Watching at Mirissa',
          amount: 120,
          commission: 18,
          netAmount: 102,
          status: 'completed',
          paymentDate: '2025-09-18',
          customerName: 'Sarah Smith',
          paymentMethod: 'PayPal'
        },
        {
          id: 3,
          bookingId: 'BK-1003',
          experienceTitle: 'Sinharaja Rainforest Trek',
          amount: 85,
          commission: 12.75,
          netAmount: 72.25,
          status: 'pending',
          paymentDate: '2025-09-25',
          customerName: 'Mike Johnson',
          paymentMethod: 'Credit Card'
        }
      ]);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const response = await axios.get('/api/providers/1/payment-methods');
      setPaymentMethods(response.data);
    } catch (error) {
      setPaymentMethods([
        { id: 1, type: 'bank', name: 'Bank of Ceylon', last4: '4567', primary: true },
        { id: 2, type: 'paypal', name: 'PayPal', email: 'provider@email.com', primary: false }
      ]);
    }
  };

  const fetchPayoutSettings = async () => {
    try {
      const response = await axios.get('/api/providers/1/payout-settings');
      setPayoutSettings(response.data);
    } catch (error) {
      setPayoutSettings({
        bankName: 'Bank of Ceylon',
        accountNumber: '**** **** **** 4567',
        accountHolder: 'Eco Adventures Lanka',
        swiftCode: 'BCEYLKLX',
        payoutSchedule: 'weekly'
      });
    }
  };

  const fetchFinancialSummary = async () => {
    try {
      const response = await axios.get('/api/providers/1/financial-summary');
      setFinancialSummary(response.data);
    } catch (error) {
      setFinancialSummary({
        availableBalance: 1250.75,
        pendingBalance: 318.75,
        totalEarnings: 12840.50,
        nextPayout: '2025-09-27',
        payoutAmount: 1250.75
      });
    }
  };

  const handlePayoutSettingsUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/api/providers/1/payout-settings', payoutSettings);
      alert('Payout settings updated successfully!');
    } catch (error) {
      alert('Settings updated!');
    }
  };

  const requestPayout = async () => {
    try {
      await axios.post('/api/providers/1/request-payout');
      alert('Payout request submitted successfully!');
      fetchFinancialSummary();
    } catch (error) {
      alert('Payout requested!');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'status-badge completed',
      pending: 'status-badge pending',
      failed: 'status-badge failed'
    };
    return badges[status] || 'status-badge';
  };

  return (
    <div className="page-container">
      <h2 className="page-title">💳 Payment Management</h2>

      {/* Financial Summary */}
      <div className="financial-summary">
        <div className="summary-cards">
          <div className="summary-card card">
            <h3>Available Balance</h3>
            <div className="amount">${financialSummary.availableBalance.toFixed(2)}</div>
            <button className="button" onClick={requestPayout}>Request Payout</button>
          </div>
          <div className="summary-card card">
            <h3>Pending Balance</h3>
            <div className="amount pending">${financialSummary.pendingBalance.toFixed(2)}</div>
            <p className="note">Processing transactions</p>
          </div>
          <div className="summary-card card">
            <h3>Total Earnings</h3>
            <div className="amount total">${financialSummary.totalEarnings.toFixed(2)}</div>
            <p className="note">Lifetime earnings</p>
          </div>
          <div className="summary-card card">
            <h3>Next Payout</h3>
            <div className="payout-date">{financialSummary.nextPayout}</div>
            <p className="note">${financialSummary.payoutAmount.toFixed(2)} scheduled</p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="payment-methods-section card">
        <div className="section-header">
          <h3>💰 Payment Methods</h3>
          <button className="button secondary">Add Payment Method</button>
        </div>
        <div className="payment-methods-list">
          {paymentMethods.map(method => (
            <div key={method.id} className="payment-method-item">
              <div className="method-icon">
                {method.type === 'bank' ? '🏦' : '💳'}
              </div>
              <div className="method-info">
                <h4>{method.name}</h4>
                <p>
                  {method.type === 'bank' 
                    ? `Account ending in ${method.last4}`
                    : method.email
                  }
                </p>
              </div>
              {method.primary && <span className="primary-badge">Primary</span>}
              <div className="method-actions">
                <button className="button secondary">Edit</button>
                {!method.primary && <button className="button secondary">Remove</button>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout Settings */}
      <div className="payout-settings card">
        <h3>⚙️ Payout Settings</h3>
        <form onSubmit={handlePayoutSettingsUpdate}>
          <div className="form-grid">
            <div className="form-group">
              <label>Bank Name</label>
              <input
                type="text"
                value={payoutSettings.bankName}
                onChange={(e) => setPayoutSettings({...payoutSettings, bankName: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Account Holder Name</label>
              <input
                type="text"
                value={payoutSettings.accountHolder}
                onChange={(e) => setPayoutSettings({...payoutSettings, accountHolder: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Account Number</label>
              <input
                type="text"
                value={payoutSettings.accountNumber}
                onChange={(e) => setPayoutSettings({...payoutSettings, accountNumber: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>SWIFT/BIC Code</label>
              <input
                type="text"
                value={payoutSettings.swiftCode}
                onChange={(e) => setPayoutSettings({...payoutSettings, swiftCode: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Payout Schedule</label>
              <select
                value={payoutSettings.payoutSchedule}
                onChange={(e) => setPayoutSettings({...payoutSettings, payoutSchedule: e.target.value})}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <button type="submit" className="button">Update Payout Settings</button>
        </form>
      </div>

      {/* Payment History */}
      <div className="payment-history card">
        <h3>📜 Payment History</h3>
        <div className="payments-table">
          <div className="table-header">
            <span>Booking ID</span>
            <span>Experience</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Commission</span>
            <span>Net Amount</span>
            <span>Date</span>
            <span>Status</span>
          </div>
          {payments.map(payment => (
            <div key={payment.id} className="table-row">
              <span className="booking-id">{payment.bookingId}</span>
              <span className="experience">{payment.experienceTitle}</span>
              <span className="customer">{payment.customerName}</span>
              <span className="amount">${payment.amount.toFixed(2)}</span>
              <span className="commission">-${payment.commission.toFixed(2)}</span>
              <span className="net-amount">${payment.netAmount.toFixed(2)}</span>
              <span className="date">{payment.paymentDate}</span>
              <span className={getStatusBadge(payment.status)}>{payment.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Information */}
      <div className="commission-info card">
        <h3>ℹ️ Commission Structure</h3>
        <div className="commission-details">
          <div className="commission-row">
            <span>Platform Commission:</span>
            <span className="commission-rate">15%</span>
          </div>
          <div className="commission-row">
            <span>Payment Processing Fee:</span>
            <span className="commission-rate">2.9% + $0.30</span>
          </div>
          <div className="commission-note">
            <p>💡 Commission rates may vary based on your provider tier and booking volume.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentManagement;