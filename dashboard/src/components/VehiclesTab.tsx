import React, { useState, useEffect } from 'react';
import { db, seedDatabase, isDbSeeded } from '../data/db';
import type { Vehicle } from '../types/access-db';
import { t, formatCurrency } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { usePagination, PaginationBar } from '../utils/usePagination';
import { Car, RefreshCw, AlertTriangle } from 'lucide-react';

interface VehiclesTabProps { lang: Language }

export const VehiclesTab: React.FC<VehiclesTabProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!(await isDbSeeded())) await seedDatabase();
      setVehicles(await db.vehicles.toArray());
    } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const expiringLicenses = vehicles.filter(v => v.licensedUntil && v.licensedUntil <= thirtyDaysFromNow && v.licensedUntil >= today);
  const expiringInsurance = vehicles.filter(v => v.insuranceExpiry && v.insuranceExpiry <= thirtyDaysFromNow && v.insuranceExpiry >= today);

  const pagination = usePagination(vehicles, 10);

  if (loading) return (
    <div className="glass-panel-noclick" style={{ padding: '40px', textAlign: 'center' }}>
      <RefreshCw size={32} className="glowing-element" style={{ color: 'var(--accent-cyan)' }} />
      <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>{t('commonRefresh', lang)}...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel-noclick" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Car size={24} style={{ color: 'var(--accent-cyan)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('fleetTitle', lang)}</h2>
      </div>

      {/* Expiry Alerts */}
      {(expiringLicenses.length > 0 || expiringInsurance.length > 0) && (
        <div className="glass-panel-noclick" style={{ padding: '20px', border: '1px solid var(--color-warning)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--color-warning)' }} />
            <span style={{ fontWeight: 700, color: 'var(--color-warning)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('fleetExpiryAlerts', lang)}</span>
          </div>
          {expiringLicenses.map((v, i) => (
            <div key={i} style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {v.plateNumber} — {t('fleetLicenseExpiring', lang)}: {v.licensedUntil?.toLocaleDateString()}
            </div>
          ))}
          {expiringInsurance.map((v, i) => (
            <div key={i} style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>
              {v.plateNumber} — {t('fleetInsuranceExpiring', lang)}: {v.insuranceExpiry?.toLocaleDateString()}
            </div>
          ))}
        </div>
      )}

      {/* Vehicles table */}
      <div className="glass-panel-noclick" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>{t('fleetPlate', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('fleetType', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('fleetModel', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('fleetColor', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('fleetLicense', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('fleetInsurance', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('fleetPrice', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pageData.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>{t('commonNoData', lang)}</td></tr>
            )}
            {pagination.pageData.map((v, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{v.plateNumber}</td>
                <td style={{ padding: '10px 12px' }}>{v.vehicleType || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{v.model || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{v.color || '-'}</td>
                <td style={{ padding: '10px 12px', color: v.licensedUntil && v.licensedUntil <= thirtyDaysFromNow ? 'var(--color-warning)' : 'inherit' }}>
                  {v.licensedUntil?.toLocaleDateString() || '-'}
                </td>
                <td style={{ padding: '10px 12px', color: v.insuranceExpiry && v.insuranceExpiry <= thirtyDaysFromNow ? 'var(--color-warning)' : 'inherit' }}>
                  {v.insuranceExpiry?.toLocaleDateString() || '-'}
                </td>
                <td style={{ padding: '10px 12px' }}>{v.price ? formatCurrency(v.price, lang) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <PaginationBar
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          setPage={pagination.setPage}
          nextPage={pagination.nextPage}
          prevPage={pagination.prevPage}
          hasNext={pagination.hasNext}
          hasPrev={pagination.hasPrev}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={vehicles.length}
        />
      </div>
    </div>
  );
};
export default VehiclesTab;