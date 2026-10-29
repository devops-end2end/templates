import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Component', () => {
  it('renders welcome message and health status', () => {
    render(<App />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/healthy/i)).toBeInTheDocument();
    expect(screen.getByTestId('docs-link')).toHaveAttribute('href', '/docs');
  });
});
