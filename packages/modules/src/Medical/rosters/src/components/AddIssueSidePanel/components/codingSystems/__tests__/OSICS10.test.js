import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { screen, render, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import OSICS10 from '../OSICS10';

const mockSelectedCoding = {
  osics_10: {
    osics_pathology_id: 1392,
    osics_classification_id: 9,
    groups: ['all_injuries'],
    osics_body_area_id: 20,
    osics_id: 'WUPC',
    icd: 'NC54.03',
    side_id: 3,
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
  osics10CodeProps: {
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
    selectedOnset: 4,
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
  selectedAthlete: 7,
  issueIsAnInjury: false,
  issueIsAnIllness: true,
  selectedIssueType: 'injury',
  t: i18nextTranslateStub(),
};

describe('<OSICS10/>', () => {
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
        container = render(<OSICS10 {...props} />).container;
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
        render(<OSICS10 {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText('1st CMC Joint instability')
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
        render(<OSICS10 {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText('Add supplemental pathology')
        ).toBeInTheDocument();
      });
    });

    it('shows the input when the toggle is clicked', async () => {
      await act(async () => {
        render(<OSICS10 {...props} />);
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
        render(<OSICS10 {...props} />);
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
        render(<OSICS10 {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Classification:')).toBeInTheDocument();
        expect(screen.getByText('Instability')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Body area', () => {
    it('renders the value', async () => {
      await act(async () => {
        render(<OSICS10 {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Body area:')).toBeInTheDocument();
        expect(screen.getByText('Wrist/Hand')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Code', () => {
    it('renders the value', async () => {
      await act(async () => {
        render(<OSICS10 {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Code:')).toBeInTheDocument();
        expect(screen.getByText('WUPC')).toBeInTheDocument();
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
          render(<OSICS10 {...props} />);
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
    describe('when it is false and we have no osics_pathology_id set', () => {
      beforeEach(() => {
        window.featureFlags['preliminary-injury-illness'] = false;
      });
      afterEach(() => {
        window.featureFlags['preliminary-injury-illness'] = false;
      });
      it('[FORM FIELD] Side: does not render the component', async () => {
        await act(async () => {
          render(
            <OSICS10
              {...props}
              codingSystemProps={{
                ...props.codingSystemProps,
                selectedCoding: {
                  osics_10: {
                    osics_classification_id: 9,
                    groups: ['all_injuries'],
                    osics_body_area_id: 20,
                    osics_id: 'WUPC',
                    icd: 'NC54.03',
                    side_id: 3,
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
          render(<OSICS10 {...props} issueType="injury" />);
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
