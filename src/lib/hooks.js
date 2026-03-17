import { useState, useEffect, useCallback } from 'react';
import { api } from './api';

export function useApi(url, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url);
      if (res.success) setData(res.data);
      else setError(res.error || 'Error');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [url, ...deps]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useNotificationBadges() {
  const [badges, setBadges] = useState({});

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await api.get('/api/notificaciones/conteo');
        if (res.success) setBadges(res.data);
      } catch { /* ignore */ }
    };
    fetchBadges();
    const interval = setInterval(fetchBadges, 60000);
    return () => clearInterval(interval);
  }, []);

  return badges;
}
