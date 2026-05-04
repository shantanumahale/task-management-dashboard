import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DeleteModal from '../DeleteModal';

describe('DeleteModal', () => {
  it('renders the confirmation message', () => {
    render(<DeleteModal onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.getByText(/are you sure you want to delete this task/i)).toBeInTheDocument();
  });

  it('renders Cancel and Delete buttons', () => {
    render(<DeleteModal onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onConfirm when Delete is clicked', () => {
    const onConfirm = jest.fn();
    render(<DeleteModal onConfirm={onConfirm} onCancel={() => {}} />);
    userEvent.click(screen.getByRole('button', { name: /^delete$/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel = jest.fn();
    render(<DeleteModal onConfirm={() => {}} onCancel={onCancel} />);
    userEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when close (X) button is clicked', () => {
    const onCancel = jest.fn();
    render(<DeleteModal onConfirm={() => {}} onCancel={onCancel} />);
    userEvent.click(screen.getByRole('button', { name: /close dialog/i }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when Escape is pressed', () => {
    const onCancel = jest.fn();
    render(<DeleteModal onConfirm={() => {}} onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('has role=dialog with aria-modal', () => {
    render(<DeleteModal onConfirm={() => {}} onCancel={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('focuses the Cancel button on mount', () => {
    render(<DeleteModal onConfirm={() => {}} onCancel={() => {}} />);
    expect(screen.getByRole('button', { name: /cancel/i })).toHaveFocus();
  });
});
