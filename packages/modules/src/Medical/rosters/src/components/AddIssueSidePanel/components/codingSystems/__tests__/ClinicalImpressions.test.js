import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ClinicalImpressions from '../ClinicalImpressions';

const mockSelectedCoding = {
  clinical_impressions: {
    id: 3084,
    pathology: 'Hamstring Strain / Proximal / Muscle Unknown',
    code: '364043',
    clinical_impression_body_area: 'Hip',
    clinical_impression_body_area_id: 15,
    clinical_impression_classification: 'Strains',
    clinical_impression_classification_id: 5,
    side_id: 2,
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

const mockedSecondaryPathology = {
  id: null,
  record: {
    value: {
      id: 3100,
      code: '364142',
      pathology: 'Hamstring Strain / Proximal / Biceps Femoris / 1 Deg',
      clinical_impression_body_area: 'Hip',
      clinical_impression_body_area_id: 29,
      clinical_impression_classification: 'Strains',
      clinical_impression_classification_id: 5,
    },
    label: '364142 Hamstring Strain / Proximal / Biceps Femoris / 1 Deg',
  },
  side: 5,
};

const props = {
  examinationDateProps: {
    selectedExaminationDate: moment('2021-03-02T13:00:00Z'),
    selectedDiagnosisDate: moment('2021-03-02T13:00:00Z'),
    onSelectExaminationDate: jest.fn(),
  },
  ciCodeProps: {
    selectedCoding: mockSelectedCoding,
    onSelectCoding: jest.fn(),
    selectedSupplementalCoding: jest.fn(),
    onSelectSupplementalCoding: mockSelectedCoding,
    isPathologyFieldDisabled: false,
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
  onsetDescriptionProps: {
    selectedOnsetDescription: 'Mocked onset description',
    onSelectOnsetDescription: jest.fn(),
  },
  sideProps: {
    sides: mockedSides,
    onSelectSide: jest.fn(),
    selectedSide: '',
  },
  secondaryPathologyProps: {
    secondaryPathologies: [mockedSecondaryPathology, mockedSecondaryPathology],
    onAddSecondaryPathology: jest.fn(),
    onRemoveSecondaryPathology: jest.fn(),
    onEditSecondaryPathology: jest.fn(),
  },
  invalidFields: [],
  issueType: 'injury',
  issueIsARecurrence: false,
  t: i18nextTranslateStub(),
};
window.featureFlags = {};

describe('<ClinicalImpressions/>', () => {
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
        container = render(<ClinicalImpressions {...props} />).container;
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
        render(<ClinicalImpressions {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText(
            '364043 Hamstring Strain / Proximal / Muscle Unknown'
          )
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
        render(<ClinicalImpressions {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText('Add supplemental pathology')
        ).toBeInTheDocument();
      });
    });

    it('shows the input when the toggle is clicked', async () => {
      await act(async () => {
        render(<ClinicalImpressions {...props} />);
      });
      await userEvent.click(screen.getByText('Add supplemental pathology'));
      await waitFor(() => {
        expect(screen.getByText('Supplemental pathology')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Supplemental Recurrence', () => {
    beforeEach(() => {
      window.featureFlags['supplemental-recurrence-code'] = true;
      props.issueIsARecurrence = true;
    });
    afterEach(() => {
      window.featureFlags['supplemental-recurrence-code'] = false;
      props.issueIsARecurrence = false;
    });
    it('renders the toggle', async () => {
      await act(async () => {
        render(<ClinicalImpressions {...props} />);
      });
      await waitFor(() => {
        expect(
          screen.getByText('Add supplemental recurrence')
        ).toBeInTheDocument();
      });
    });

    it('shows the input when the toggle is clicked', async () => {
      await act(async () => {
        render(<ClinicalImpressions {...props} />);
      });
      await userEvent.click(screen.getByText('Add supplemental recurrence'));
      await waitFor(() => {
        expect(screen.getByText('Supplemental CI Code')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Onset', () => {
    beforeEach(async () => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
      await act(async () => {
        render(<ClinicalImpressions {...props} />);
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

  describe('[FORM FIELD] OnsetDescription', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = false;
    });

    it('renders the input', async () => {
      const updatedProps = {
        ...props,
        isChronicIssue: true,
      };
      await act(async () => {
        render(<ClinicalImpressions {...updatedProps} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Description of Onset')).toBeInTheDocument();
        expect(
          screen.getByText('Mocked onset description')
        ).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Injury type', () => {
    it('renders the value', async () => {
      await act(async () => {
        render(<ClinicalImpressions {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Injury type:')).toBeInTheDocument();
        expect(screen.getByText('Structural Abnormality')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Body part', () => {
    it('renders the value', async () => {
      await act(async () => {
        render(<ClinicalImpressions {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Body part:')).toBeInTheDocument();
        expect(screen.getByText('Thigh')).toBeInTheDocument();
      });
    });
  });

  describe('[FORM FIELD] Code', () => {
    it('renders the value', async () => {
      await act(async () => {
        render(<ClinicalImpressions {...props} />);
      });
      await waitFor(() => {
        expect(screen.getByText('Code:')).toBeInTheDocument();
        expect(screen.getByText('364043')).toBeInTheDocument();
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
          render(<ClinicalImpressions {...props} />);
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
      it('[FORM FIELD] Side: does not render the component', async () => {
        await act(async () => {
          render(
            <ClinicalImpressions
              {...props}
              codingSystemProps={{
                ...props.codingSystemProps,
                selectedCoding: {
                  clinical_impressions: {
                    pathology: 'Hamstring Strain / Proximal / Muscle Unknown',
                    code: '364043',
                    clinical_impression_body_area: 'Hip',
                    clinical_impression_body_area_id: 15,
                    clinical_impression_classification: 'Strains',
                    clinical_impression_classification_id: 5,
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

  describe('[FEATURE FLAG] multi-part-injury-ci-code', () => {
    describe('when it is true', () => {
      beforeEach(() => {
        window.featureFlags['preliminary-injury-illness'] = true;
        window.featureFlags['multi-part-injury-ci-code'] = true;
      });
      afterEach(() => {
        window.featureFlags['preliminary-injury-illness'] = false;
        window.featureFlags['multi-part-injury-ci-code'] = false;
      });

      it('[FORM FIELD] Side: it disables the secondary pathology field when added and its value is the primary', async () => {
        await act(async () => {
          render(<ClinicalImpressions {...props} />);
        });
        await waitFor(() => {
          const sides = screen.getAllByText('Side');
          expect(sides).toHaveLength(3);
          ['Left', 'Midline', 'Right', 'Bilateral', 'N/A'].forEach((item) => {
            expect(
              screen.getAllByText(item).at(0).closest('button')
            ).toBeEnabled();
            expect(
              screen.getAllByText(item).at(1).closest('button')
            ).toBeDisabled();
            expect(
              screen.getAllByText(item).at(2).closest('button')
            ).toBeDisabled();
          });
        });
      });
    });
  });

  describe('when issueType is injury and ciCodeProps.isPathologyFieldDisabled is true', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
      window.featureFlags['pm-injury-edit-mode-of-onset'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = false;
      window.featureFlags['pm-injury-edit-mode-of-onset'] = false;
    });

    it('enables onset selection, and onset description', async () => {
      render(
        <ClinicalImpressions
          {...{
            ...props,
            ciCodeProps: {
              ...props.ciCodeProps,
              isPathologyFieldDisabled: true,
            },
            issueType: 'injury',
          }}
        />
      );

      await screen.findByText('Onset Type');

      expect(screen.getByText('Onset Type')).not.toHaveClass(
        'kitmanReactSelect__label--disabled'
      );
      expect(screen.getByText('Left')).toBeDisabled();
      expect(screen.getByText('Right')).toBeDisabled();
      expect(screen.getByText('Midline')).toBeDisabled();
      expect(screen.getByText('Bilateral')).toBeDisabled();
      expect(screen.getByText('N/A')).toBeDisabled();
      expect(screen.getByText('Description of Onset')).not.toHaveClass(
        'textarea__label--disabled'
      );
    });
  });

  describe('when issueType is injury and ciCodeProps.isPathologyFieldDisabled is false', () => {
    beforeEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = true;
      window.featureFlags['pm-injury-edit-mode-of-onset'] = true;
    });

    afterEach(() => {
      window.featureFlags['nfl-injury-flow-fields'] = false;
      window.featureFlags['pm-injury-edit-mode-of-onset'] = false;
    });

    it('enables onset selection, and onset description', async () => {
      render(
        <ClinicalImpressions
          {...{
            ...props,
            ciCodeProps: {
              ...props.ciCodeProps,
              isPathologyFieldDisabled: false,
            },
            issueType: 'injury',
          }}
        />
      );

      await screen.findByText('Onset Type');

      expect(screen.getByText('Onset Type')).not.toHaveClass(
        'kitmanReactSelect__label--disabled'
      );
      expect(screen.getByText('Left')).toBeEnabled();
      expect(screen.getByText('Right')).toBeEnabled();
      expect(screen.getByText('Midline')).toBeEnabled();
      expect(screen.getByText('Bilateral')).toBeEnabled();
      expect(screen.getByText('N/A')).toBeEnabled();
      expect(screen.getByText('Description of Onset')).not.toHaveClass(
        'textarea__label--disabled'
      );
    });
  });
});
