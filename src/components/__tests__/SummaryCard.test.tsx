import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryCard from '../SummaryCard';

describe('SummaryCard', () => {
  it('renders the label and count', () => {
    render(<SummaryCard label="PENDING" count={5} gradientClass="" onClick={() => {}} />);
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', () => {
    const onClick = jest.fn();
    render(<SummaryCard label="DONE" count={3} gradientClass="" onClick={onClick} />);
    userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has an accessible aria-label with label and count', () => {
    render(<SummaryCard label="IN PROGRESS" count={7} gradientClass="" onClick={() => {}} />);
    expect(screen.getByRole('button', { name: /IN PROGRESS: 7 tasks/i })).toBeInTheDocument();
  });

  it('applies the provided gradientClass', () => {
    const { container } = render(
      <SummaryCard label="TOTAL" count={0} gradientClass="bg-gradient-to-br from-gray-100" onClick={() => {}} />
    );
    expect(container.firstChild).toHaveClass('bg-gradient-to-br', 'from-gray-100');
  });

  it('renders count of zero correctly', () => {
    render(<SummaryCard label="DONE" count={0} gradientClass="" onClick={() => {}} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
