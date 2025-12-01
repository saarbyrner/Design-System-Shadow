import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { screen, render, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import Datalys from '../Datalys';

const mockSelectedCoding = {
  datalys: {
    id: 604,
    code: 308,
    pathology: 'Hamstring Tear - Partial or Complete',
    datalys_body_area: 'Thigh',
    datalys_body_area_id: 15,
    datalys_classification: 'Strain/Tear',
    datalys_classification_id: 5,
    datalys_tissue_type: 'Muscle',
    datalys_tissue_type_id: 15,
  },
};

const mockedSides = [
  {
    id: 1,
    name: 'Left',
  },
  {
    id: 2,
    name: 'Midline',
  },
  {
    id: 3,
    name: 'Right',
  },
  {
    id: 4,
    name: 'Bilateral',
  },
  {
    id: 5,
    name: 'N/A',
  },
];

const props = {
  examinationDateProps: {
    selectedExaminationDate: moment('2021-03-02T13:00:00Z'),
    selectedDiagnosisDate: moment('2021-03-02T13:00:00Z'),
    onSelectExaminationDate: jest.fn(),
  },
  datalysCodeProps: {
    selectedCoding: mockSelectedCoding,
    onSelectCoding: jest.fn(),
  },
  supplementalPathologyProps: {
    enteredSupplementalPathology: '',
    onEnterSupplementalPathology: jest.fn(),
    onRemoveSupplementalPathology: jest.fn(),
  },
  codingSystemProps: {
    selectedCoding: mockSelectedCoding,
    onSelectCoding: jest.fn(),
    onSelectPathology: jest.fn(),
    onSelectClassification: jest.fn(),
    onSelectBodyArea: jest.fn(),
  },
  onsetProps: {
    selectedOnset: 6,
    onSelectOnset: jest.fn(),
    onsetFreeText: '',
    onUpdateOnsetFreeText: jest.fn(),
  },
  sideProps: {
    sides: mockedSides,
    onSelectSide: jest.fn(),
    selectedSide: '',
  },
  invalidFields: [],
  issueType: 'injury',
  issueIsARecurrence: false,
  isBamic: false,
  t: i18nextTranslateStub(),
};

describe('<Datalys/>', () => {
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
        container = render(<Datalys {...props} />).container;
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
        render(<Datalys {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText('308 Hamstring Tear - Partial or Complete')
        ).toBeInTheDocument();
      });
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
        render(<Datalys {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText('Add supplemental pathology')
        ).toBeInTheDocument();
      });
    });

    it('shows the input when the toggle is clicked', async () => {
      await act(async () => {
        render(<Datalys {...props} />);
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
        render(<Datalys {...props} />);
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

  describe('[FORM FIELD] Classification', () => {
    it('renders the value', async () => {
      await act(async () => {
        render(<Datalys {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Classification:')).toBeInTheDocument();
        expect(screen.getByText('Structural Abnormality')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Body area', () => {
    it('renders the value', async () => {
      await act(async () => {
        render(<Datalys {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Body area:')).toBeInTheDocument();
        expect(screen.getByText('Thigh')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Tissue type', () => {
    it('renders the value', async () => {
      await act(async () => {
        render(<Datalys {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Tissue type:')).toBeInTheDocument();
        expect(screen.getByText('Muscle')).toBeInTheDocument();
      });
    });
  });

  describe('[FEATURE FLAG] preliminary-injury-illness', () => {
    describe('when it is true', () => {
      beforeEach(() => {
        window.featureFlags['preliminary-injury-illness'] = true;
      });
      afterEach(() => {
        window.featureFlags['preliminary-injury-illness'] = false;
      });
      it('[FORM FIELD] Side: renders the component', async () => {
        await act(async () => {
          render(<Datalys {...props} />);
        });
        await waitFor(() => {
          expect(screen.getByText('Side')).toBeInTheDocument();
          expect(screen.getByText('Left')).toBeInTheDocument();
          expect(screen.getByText('Midline')).toBeInTheDocument();
          expect(screen.getByText('Right')).toBeInTheDocument();
          expect(screen.getByText('Bilateral')).toBeInTheDocument();
          expect(screen.getByText('N/A')).toBeInTheDocument();
        });
      });
    });
    describe('when it is false and we have no id set', () => {
      beforeEach(() => {
        window.featureFlags['preliminary-injury-illness'] = false;
      });
      it('[FORM FIELD] Side: does not render the component', async () => {
        await act(async () => {
          render(
            <Datalys
              {...props}
              codingSystemProps={{
                ...props.codingSystemProps,
                selectedCoding: {
                  datalys: {
                    code: 308,
                    pathology: 'Hamstring Tear - Partial or Complete',
                    datalys_body_area: 'Thigh',
                    datalys_body_area_id: 15,
                    datalys_classification: 'Strain/Tear',
                    datalys_classification_id: 5,
                    datalys_tissue_type: 'Muscle',
                    datalys_tissue_type_id: 15,
                  },
                },
              }}
            />
          );
        });
        await waitFor(() => {
          expect(screen.queryByText('Side')).not.toBeInTheDocument();
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
          render(<Datalys {...props} issueType="injury" />);
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
});
