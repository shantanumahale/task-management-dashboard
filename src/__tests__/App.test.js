import { render, screen } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    })),
  });
});

test('renders the Task Management Dashboard at root route', () => {
  render(<App />);
  expect(screen.getByRole('region', { name: /task management dashboard/i })).toBeInTheDocument();
});

test('renders the CREATE + button', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /create a new task/i })).toBeInTheDocument();
});
