import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import renderWithRedux from '@kitman/common/src/utils/renderWithRedux';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { IMPORT_TYPES } from '@kitman/modules/src/shared/MassUpload/New/utils/consts';

import DeleteImport from '..';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<DeleteImport />', () => {
  const mockProps = {
    canDelete: false,
    attachmentId: null,
    importType: `${IMPORT_TYPES.GrowthAndMaturation}_import`,
    submissionStatus: 'pending',
  };

  const mockTrackEvent = jest.fn();

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });

  it('should not render if canDelete is false', () => {
    const { container } = renderWithRedux(<DeleteImport {...mockProps} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render if canDelete is true', () => {
    renderWithRedux(<DeleteImport {...mockProps} canDelete />);
    expect(
      screen.getByRole('button', { name: 'Delete import' })
    ).toBeInTheDocument();
  });

  it('should dispatch action to update import to delete and track event', async () => {
    const props = { ...mockProps, canDelete: true, attachmentId: 1 };
    const user = userEvent.setup();
    const { mockedStore } = renderWithRedux(<DeleteImport {...props} />, {
      useGlobalStore: false,
    });
    await user.click(screen.getByRole('button', { name: 'Delete import' }));

    expect(mockedStore.dispatch).toHaveBeenCalledWith({
      payload: {
        id: props.attachmentId,
        showDeleteConfirmation: true,
        submissionStatus: 'pending',
      },
      type: 'massUploadSlice/onUpdateImportToDelete',
    });
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'Forms - Growth and maturation - CSV Importer - Delete Import Click',
      { SubmissionStatus: 'pending' }
    );
  });
});
