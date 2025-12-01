import { render, screen, fireEvent } from '@testing-library/react';
import * as reduxHooks from 'react-redux';
import { MODES } from '@kitman/modules/src/HumanInput/shared/constants';
import * as useHistoryGoModule from '@kitman/common/src/hooks/useHistoryGo';
import * as useUnsavedChangesModule from '@kitman/modules/src/HumanInput/hooks/useUnsavedChanges';
import * as useFormToastsModule from '@kitman/modules/src/LeagueOperations/shared/hooks/useFormToasts';
import BackLink from '../BackLink';

describe('BackLink', () => {
  const mockDispatch = jest.fn();
  const mockHistoryGo = jest.fn();
  const mockClearToasts = jest.fn();

  beforeEach(() => {
    jest.spyOn(reduxHooks, 'useDispatch').mockReturnValue(mockDispatch);
    jest.spyOn(reduxHooks, 'useSelector').mockImplementation(() => {
      return MODES.CREATE;
    });
    jest.spyOn(useHistoryGoModule, 'default').mockReturnValue(mockHistoryGo);
    jest.spyOn(useUnsavedChangesModule, 'default').mockReturnValue({
      hasUnsavedChanges: false,
    });
    jest.spyOn(useFormToastsModule, 'default').mockReturnValue({
      onClearToasts: mockClearToasts,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders', () => {
    render(<BackLink />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('renders and handles click without unsaved changes', () => {
    render(<BackLink />);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockClearToasts).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'formStateSlice/onSetMode',
      payload: { mode: MODES.VIEW },
    });
    expect(mockHistoryGo).toHaveBeenCalledWith(-1);
  });

  it('handles click with unsaved changes', () => {
    useUnsavedChangesModule.default.mockReturnValue({
      hasUnsavedChanges: true,
    });

    render(<BackLink />);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(mockClearToasts).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'formStateSlice/onUpdateShowUnsavedChangesModal',
      payload: { showUnsavedChangesModal: true },
    });
    expect(mockHistoryGo).not.toHaveBeenCalled();
  });
});
