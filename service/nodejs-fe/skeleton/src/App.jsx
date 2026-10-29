import React from 'react';

export default function App() {
  const appName = "${{ values.componentId }}";

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Welcome to {appName}</h1>
      <p><strong>Status:</strong> <span style={{ color: 'green' }}>healthy</span></p>
      <p>
        <a href="/docs" data-testid="docs-link">Documentation</a>
      </p>
    </div>
  );
}
