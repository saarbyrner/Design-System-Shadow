import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { render, screen } from '@testing-library/react';
import i18n from '@kitman/common/src/utils/i18n';
import TreatmentSessionModal from '@kitman/modules/src/TreatmentSessionModal';

const storeFake = (state) => ({
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: () => ({ ...state }),
});

jest.mock('@kitman/components/src/GroupedDropdown/hooks', () => ({
  __esModule: true,
  default: jest.fn(() => []),
}));

describe('TreatmentSessionModal', () => {
  const ownProps = {
    isOpen: true,
    attachedFiles: [],
    bodyAreaOptions: [],
    noteContent: '',
    reasonOptions: [],
    selectedPractitioner: 999,
    selectedTimezone: 'UTC',
    treatmentAttributes: [
      {
        duration: null,
        issue_id: null,
        issue_type: null,
        reason: null,
        treatment_body_areas_attributes: [],
        treatment_modality_id: null,
        note: '',
      },
    ],
    treatmentModalityOptions: [],
    treatmentTitle: '',
    users: [],
    athlete: {
      fullname: 'Test Athlete',
      id: 1,
    },
    onClickCloseModal: jest.fn(),
    t: (key) => key,
  };

  it('renders', () => {
    const store = storeFake({
      treatmentSessionModal: {
        isModalOpen: false,
        athlete: {
          fullname: '',
          id: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <TreatmentSessionModal {...ownProps} />
        </I18nextProvider>
      </Provider>
    );

    expect(screen.getByText('New Treatment Session')).toBeInTheDocument();
  });
});
