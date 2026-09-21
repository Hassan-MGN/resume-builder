const getEndpoint = (name) => {
  if (typeof import.meta === 'undefined' || !import.meta.env) return '';
  return String(import.meta.env[name] || '').trim();
};

const getSafeLocation = () => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}${window.location.pathname}`;
};

const post = (endpoint, payload) => {
  if (!endpoint || typeof fetch === 'undefined') return;
  try {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Telemetry must never interrupt the product.
  }
};

export const trackEvent = (name, properties = {}) => {
  if (import.meta.env?.DEV) console.debug('[Resummetry event]', name, properties);
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...properties });
  }
  post(getEndpoint('VITE_ANALYTICS_ENDPOINT'), {
    type: 'event', name, properties, timestamp: new Date().toISOString(),
  });
};

export const reportError = (error, context = {}) => {
  const normalized = error instanceof Error ? error : new Error(String(error || 'Unknown error'));
  if (import.meta.env?.DEV) console.error('[Resummetry]', normalized, context);
  post(getEndpoint('VITE_ERROR_REPORTING_ENDPOINT'), {
    type: 'error', name: normalized.name, message: normalized.message,
    stack: normalized.stack, context, url: getSafeLocation(),
    timestamp: new Date().toISOString(),
  });
};
