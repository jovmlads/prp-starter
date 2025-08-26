import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('renders the app structure correctly', () => {
    render(<App />);
    // Check for navigation elements that should be present
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Logo')).toBeInTheDocument();
  });

  it('has correct layout classes', () => {
    render(<App />);
    // Check for layout structure
    expect(document.querySelector('.relative')).toBeInTheDocument();
    expect(document.querySelector('aside')).toBeInTheDocument();
  });
});
