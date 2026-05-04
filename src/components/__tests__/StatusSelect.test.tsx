import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StatusSelect from '../StatusSelect';

describe('StatusSelect', () => {
  it('renders the current status label', () => {
    render(<StatusSelect value="PENDING" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: /status: pending/i })).toBeInTheDocument();
  });

  it('does not show dropdown by default', () => {
    render(<StatusSelect value="PENDING" onChange={() => {}} />);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the dropdown on click', () => {
    render(<StatusSelect value="PENDING" onChange={() => {}} />);
    userEvent.click(screen.getByRole('button', { name: /status: pending/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('shows all three status options when open', () => {
    render(<StatusSelect value="PENDING" onChange={() => {}} />);
    userEvent.click(screen.getByRole('button', { name: /status: pending/i }));
    expect(screen.getByRole('option', { name: 'PENDING' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'IN PROGRESS' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'DONE' })).toBeInTheDocument();
  });

  it('calls onChange with the selected status', () => {
    const onChange = jest.fn();
    render(<StatusSelect value="PENDING" onChange={onChange} />);
    userEvent.click(screen.getByRole('button', { name: /status: pending/i }));
    userEvent.click(screen.getByRole('option', { name: 'IN PROGRESS' }));
    expect(onChange).toHaveBeenCalledWith('IN_PROGRESS');
  });

  it('closes the dropdown after selecting an option', () => {
    render(<StatusSelect value="PENDING" onChange={() => {}} />);
    userEvent.click(screen.getByRole('button', { name: /status: pending/i }));
    userEvent.click(screen.getByRole('option', { name: 'DONE' }));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the dropdown on Escape', () => {
    render(<StatusSelect value="PENDING" onChange={() => {}} />);
    userEvent.click(screen.getByRole('button', { name: /status: pending/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('listbox').parentElement!, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('marks the current value as aria-selected', () => {
    render(<StatusSelect value="IN_PROGRESS" onChange={() => {}} />);
    userEvent.click(screen.getByRole('button', { name: /status: in progress/i }));
    const selected = screen.getByRole('option', { name: 'IN PROGRESS' });
    expect(selected).toHaveAttribute('aria-selected', 'true');
  });

  it('options have neutral background classes (not coloured)', () => {
    render(<StatusSelect value="PENDING" onChange={() => {}} />);
    userEvent.click(screen.getByRole('button', { name: /status: pending/i }));
    const options = screen.getAllByRole('option');
    options.forEach((opt) => {
      expect(opt).toHaveClass('bg-white');
    });
  });

  it('forwards the id prop to the trigger button', () => {
    render(<StatusSelect value="DONE" onChange={() => {}} id="my-status" />);
    expect(screen.getByRole('button', { name: /status: done/i })).toHaveAttribute('id', 'my-status');
  });
});
