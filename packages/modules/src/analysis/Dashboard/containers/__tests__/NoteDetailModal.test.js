import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithStore } from '@kitman/modules/src/analysis/Dashboard/utils/testUitils';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import NoteDetailModalContainer from '../NoteDetailModal';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

describe('NoteDetailModal Container', () => {
  const containerProps = {
    athletes: [],
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it('dispatches the correct action when onClickCloseModal is called', async () => {
    const user = userEvent.setup();

    const stateWithOpenModal = {
      noteDetailModal: {
        annotation: {
          title: 'Test Note',
          annotation_date: '2024-01-01',
          organisation_annotation_type: { name: 'Test Type' },
          annotationable: { fullname: 'Test Athlete' },
          description: 'Test description',
          content: 'Test content',
          annotation_actions: [],
          created_by: { fullname: 'Test Creator' },
          created_at: '2024-01-01',
          updated_by: { fullname: 'Test Updater' },
          updated_at: '2024-01-02',
        },
        requestStatus: 'success',
        isOpen: true,
      },
    };

    const props = {
      ...containerProps,
      currentUser: { id: 1, fullname: 'Test User' },
    };

    renderWithStore(
      <NoteDetailModalContainer {...props} />,
      {},
      stateWithOpenModal
    );

    // Close button
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'CLOSE_NOTE_DETAIL_MODAL',
    });
  });
});
