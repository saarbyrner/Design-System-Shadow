import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { screen, render, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ICD from '../ICD';

const mockSelectedCoding = {
  icd_10_cm: {
    code: 'H21.21',
    diagnosis: 'Degeneration of chamber angle',
    icd_id: 8249,
    body_area: 'Leg',
    pathology_type: null,
    side_id: 2,
    side: 'Left',
    osics_body_area_id: 1,
    osics_body_area: 'Ankle',
  },
};

const props = {
  examinationDateProps: {
    selectedExaminationDate: moment('2021-03-02T13:00:00Z'),
    selectedDiagnosisDate: moment('2021-03-02T13:00:00Z'),
    maxPermittedExaminationDate: moment('2021-03-02T13:00:00Z'),
    onSelectExaminationDate: jest.fn(),
  },
  icdCodeProps: {
    selectedCoding: mockSelectedCoding,
    onSelectCoding: jest.fn(),
  },
  supplementalPathologyProps: {
    enteredSupplementalPathology: '',
    onEnterSupplementalPathology: jest.fn(),
    onRemoveSupplementalPathology: jest.fn(),
  },
  onsetProps: {
    selectedOnset: 6,
    onSelectOnset: jest.fn(),
    onsetFreeText: '',
    onUpdateOnsetFreeText: jest.fn(),
  },
  invalidFields: [],
  issueType: 'injury',
  issueIsARecurrence: false,
  isBamic: false,
  t: i18nextTranslateStub(),
};

describe('<ICD/>', () => {
  describe('[FORM FIELD] Date of examination', () => {
    let container;
    let dateOfExaminationInput;

    beforeEach(() => {
      window.featureFlags['examination-date'] = true;
    });
    afterEach(() => {
      window.featureFlags['examination-date'] = false;
    });

    it('renders the input', async () => {
      await act(async () => {
        container = render(<ICD {...props} />).container;
        dateOfExaminationInput = container.querySelector(
          'input[name="examinationDate"]'
        );
      });
      await waitFor(() => {
        expect(dateOfExaminationInput).toHaveValue('02 Mar 2021');
      });
    });
  });

  describe('[FORM FIELD] Pathology', () => {
    it('renders the input', async () => {
      await act(async () => {
        render(<ICD {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText('H21.21 Degeneration of chamber angle')
        ).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] ICT Details', () => {
    it('renders ICD Details', async () => {
      render(<ICD {...props} />);

      await waitFor(() => {
        expect(screen.getByText('Body area')).toBeInTheDocument();
      });
      expect(screen.getByText('Leg')).toBeInTheDocument();
      expect(screen.getByText('Side')).toBeInTheDocument();
      expect(screen.getByText('Left')).toBeInTheDocument();
      expect(screen.getByText('Code')).toBeInTheDocument();
      expect(screen.getByText('H21.21')).toBeInTheDocument();
    });
  });

  describe('[FORM FIELD] Supplemental Pathology', () => {
    beforeEach(() => {
      window.featureFlags['custom-pathologies'] = true;
    });
    afterEach(() => {
      window.featureFlags['custom-pathologies'] = false;
    });
    it('renders the toggle', async () => {
      await act(async () => {
        render(<ICD {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText('Add supplemental pathology')
        ).toBeInTheDocument();
      });
    });

    it('shows the input when the toggle is clicked', async () => {
      await act(async () => {
        render(<ICD {...props} />);
      });
      await userEvent.click(screen.getByText('Add supplemental pathology'));
      await waitFor(() => {
        expect(screen.getByText('Supplemental pathology')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Onset', () => {
    beforeEach(async () => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
      await act(async () => {
        render(<ICD {...props} />);
      });
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = false;
    });

    it('renders the input', async () => {
      await waitFor(() => {
        expect(
          screen.getByTestId('options-select-container')
        ).toHaveTextContent('Onset Type');
        expect(screen.getByText('Other')).toBeInTheDocument();
      });
    });

    it('renders the freetext area', async () => {
      await waitFor(() => {
        expect(screen.getByText('Other Reason')).toBeInTheDocument();
      });
    });
  });
});

describe('[FEATURE FLAG] pm-injury-edit-mode-of-onset', () => {
  describe('when it is true', () => {
    beforeEach(() => {
      window.featureFlags['pm-injury-edit-mode-of-onset'] = true;
    });
    afterEach(() => {
      window.featureFlags['pm-injury-edit-mode-of-onset'] = false;
    });
    it('enables the onset selection field', async () => {
      await act(async () => {
        render(<ICD {...props} issueType="injury" />);
      });

      await waitFor(() => {
        const selectAndFreetext = screen.getByText('Onset Type');
        expect(selectAndFreetext).toBeInTheDocument();
        expect(selectAndFreetext).not.toHaveClass(
          'kitmanReactSelect__label--disabled'
        );
      });
    });
  });
});
