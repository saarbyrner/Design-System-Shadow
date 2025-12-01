import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import useGameEventsModal from '../useGameEventsModal';

describe('useGameEventsModal', () => {
  it('initial modal state is closed', () => {
    const { result } = renderHook(() => useGameEventsModal());
    const { renderModal } = result.current;
    expect(renderModal()).toBeNull();
  });

  it('opens the modal', async () => {
    const { result } = renderHook(() => useGameEventsModal());

    act(() => {
      result.current.show({
        isOpen: true,
        title: 'Title',
        content: 'Content',
      });
    });

    render(result.current.renderModal());

    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('closes the modal when calling hide method', async () => {
    const { result } = renderHook(() => useGameEventsModal());

    act(() => {
      result.current.show({
        isOpen: true,
        title: 'Title',
        content: 'Content',
      });
    });

    render(result.current.renderModal());

    expect(screen.getByText('Title')).toBeInTheDocument();

    act(() => {
      result.current.hide();
    });

    expect(result.current.renderModal()).toBeNull();
  });

  it('calls onCancel when click "Cancel" is clicked', async () => {
    const { result } = renderHook(() => useGameEventsModal());
    const onCancel = jest.fn(() => {
      result.current.hide();
    });

    act(() => {
      result.current.show({
        isOpen: true,
        title: 'Title',
        content: 'Content',
        onCancel,
      });
    });

    render(result.current.renderModal());

    await act(async () => {
      await userEvent.click(screen.getByText('Cancel'));
    });

    expect(onCancel).toHaveBeenCalled();
    expect(result.current.renderModal()).toBeNull();
  });

  it('calls onConfirm when click "Confirm" is clicked', async () => {
    const { result } = renderHook(() => useGameEventsModal());
    const onConfirm = jest.fn();

    act(() => {
      result.current.show({
        isOpen: true,
        title: 'Title',
        content: 'Content',
        onConfirm,
      });
    });

    render(result.current.renderModal());

    await act(async () => {
      await userEvent.click(screen.getByText('Confirm'));
    });

    expect(onConfirm).toHaveBeenCalled();
  });
});
