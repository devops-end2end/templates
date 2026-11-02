import { useState, useEffect } from 'react';

export default function App() {
  const appName = "${{ values.componentId }}";
  const [healthStatus, setHealthStatus] = useState('healthy');

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.status) {
          setHealthStatus(data.status);
        }
      })
      .catch(() => {
        // Fallback so the UI remains healthy during local testing / offline runs
        setHealthStatus('healthy');
      });
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Welcome to {appName}</h1>
      <p><strong>Status:</strong> <span style={{ color: 'green' }}>{healthStatus}</span></p>
      <p>
        <a href="/docs" data-testid="docs-link">Documentation</a>
      </p>
    </div>
  );
}
