import { useState, useEffect } from 'react';
import { db, seedDatabase, isDbSeeded } from '../data/db';
import type { AppUserLocal } from '../types/access-db';
import { t } from '../utils/i18n';
import type { Language } from '../utils/i18n';
import { usePagination, PaginationBar } from '../utils/usePagination';
import { UserCog, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

interface SystemUsersTabProps { lang: Language }

export const SystemUsersTab: React.FC<SystemUsersTabProps> = ({ lang }) => {
  const isRtl = lang === 'ar';
  const [users, setUsers] = useState<AppUserLocal[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      if (!(await isDbSeeded())) await seedDatabase();
      setUsers(await db.appUsersLocal.toArray());
    } finally { setLoading(false); }
  };
  useEffect(() => { loadData(); }, []);

  const pagination = usePagination(users, 10);

  if (loading) return (
    <div className="glass-panel-noclick" style={{ padding: '40px', textAlign: 'center' }}>
      <RefreshCw size={32} className="glowing-element" style={{ color: 'var(--accent-cyan)' }} />
      <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>{t('commonRefresh', lang)}...</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="glass-panel-noclick" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <UserCog size={24} style={{ color: 'var(--accent-cyan)' }} />
        <h2 style={{ fontSize: '18px', fontWeight: 700, fontFamily: isRtl ? 'Tajawal, sans-serif' : 'inherit' }}>{t('usersTitle', lang)}</h2>
      </div>

      <div className="glass-panel-noclick" style={{ padding: '24px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: isRtl ? 'right' : 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '10px 12px' }}>{t('usersUsername', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('usersRole', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('usersCanAdd', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('usersCanDelete', lang)}</th>
              <th style={{ padding: '10px 12px' }}>{t('usersCanEdit', lang)}</th>
            </tr>
          </thead>
          <tbody>
            {pagination.pageData.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>{t('commonNoData', lang)}</td></tr>
            )}
            {pagination.pageData.map((u, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '10px 12px', fontWeight: 600 }}>{u.username || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{u.role || '-'}</td>
                <td style={{ padding: '10px 12px' }}>{u.canAdd ? <CheckCircle2 size={16} style={{ color: 'var(--color-stayed)' }} /> : <XCircle size={16} style={{ color: 'var(--text-dim)' }} />}</td>
                <td style={{ padding: '10px 12px' }}>{u.canDelete ? <CheckCircle2 size={16} style={{ color: 'var(--color-stayed)' }} /> : <XCircle size={16} style={{ color: 'var(--text-dim)' }} />}</td>
                <td style={{ padding: '10px 12px' }}>{u.canEdit ? <CheckCircle2 size={16} style={{ color: 'var(--color-stayed)' }} /> : <XCircle size={16} style={{ color: 'var(--text-dim)' }} />}</td>
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
          totalItems={users.length}
        />
      </div>
    </div>
  );
};
export default SystemUsersTab;