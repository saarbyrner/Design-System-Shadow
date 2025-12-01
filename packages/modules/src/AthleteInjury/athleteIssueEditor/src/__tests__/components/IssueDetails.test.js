import { screen, within } from '@testing-library/react';
import selectEvent from 'react-select-event';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { renderWithUserEventSetup, i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import bamicGrades from '../../../../resources/bamicGrades';
import IssueDetails from '../../components/IssueDetails';

setI18n(i18n);

const defaultProps = {
  osicsPathologyOptions: [
    { id: 0, title: 'tendon injury' },
    { id: 1, title: 'valgus instability' },
  ],
  osicsClassificationOptions: [
    { id: 0, title: 'post surgery' },
    { id: 1, title: 'structural abnormality' },
  ],
  bodyAreaOptions: [
    { id: 0, title: 'chest' },
    { id: 1, title: 'foot' },
  ],
  sideOptions: [
    { id: 0, title: 'left' },
    { id: 1, title: 'right' },
  ],
  issueTypeOptions: [
    { id: 1, title: 'Overuse' },
    { id: 2, title: 'Traumatic' },
  ],
  osicsPathology: null,
  osicsClassification: null,
  bodyArea: null,
  side: null,
  osicsCode: null,
  typeId: null,
  bamicGradeId: 1,
  bamicSiteId: 1,
  isFetchingIssueDetails: false,
  supplementaryPathology: null,
  populateIssueDetails: jest.fn(),
  updateOsicsClassification: jest.fn(),
  updateBodyArea: jest.fn(),
  updateSide: jest.fn(),
  updateType: jest.fn(), // Corrected prop name from updateInjuryType
  updateHasSupplementaryPathology: jest.fn(),
  updateSupplementaryPathology: jest.fn(),
  updateBamicGradeId: jest.fn(),
  updateBamicSiteId: jest.fn(),
  formType: 'INJURY',
  hasRecurrence: false,
  hasSupplementaryPathology: false,
  injuryOsics: [
    { id: 'AAAX', bamic: true },
    { id: 'AASX', bamic: true },
    { id: 'AAXX', bamic: false },
    { id: 'ACLX', bamic: null },
    { id: 'ACPX', bamic: true },
    { id: 'ACTX', bamic: true },
    { id: 'ACXX', bamic: null },
  ],
  bamicGrades,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = {}) => {
  const view = renderWithUserEventSetup(
    <IssueDetails {...defaultProps} {...props} />
  );
  return { ...view };
};

// Helper to get dropdown button since the custom component isn't fully accessible
const getDropdownButtonByLabel = (label) => {
  const labelNode = screen.getByText(label);
  return labelNode.closest('.dropdown').querySelector('button');
};

describe('Athlete Injury Editor <IssueDetails /> component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    window.featureFlags = {};
  });

  it('renders', () => {
    renderComponent();
    expect(screen.getByText('Pathology')).toBeInTheDocument();
  });

  it('renders a pathology dropdown and calls the correct action when editing', async () => {
    renderComponent({ osicsPathology: 0 });
    expect(getDropdownButtonByLabel('Pathology')).toHaveTextContent('tendon injury');
    await selectEvent.select(screen.getByText('Pathology'), 'valgus instability');
    expect(defaultProps.populateIssueDetails).toHaveBeenCalledWith(1);
  });

  it('renders a classification dropdown and calls the correct action when editing', async () => {
    renderComponent({ osicsClassification: 0 });
    expect(getDropdownButtonByLabel('Classification')).toHaveTextContent('post surgery');
    await selectEvent.select(screen.getByText('Classification'), 'structural abnormality');
    expect(defaultProps.updateOsicsClassification).toHaveBeenCalledWith(1);
  });

  it('renders a body area dropdown and calls the correct action when editing', async () => {
    renderComponent({ bodyArea: 0 });
    expect(getDropdownButtonByLabel('Body Area')).toHaveTextContent('chest');
    await selectEvent.select(screen.getByText('Body Area'), 'foot');
    expect(defaultProps.updateBodyArea).toHaveBeenCalledWith(1);
  });

  it('renders a side dropdown and calls the correct action when editing', async () => {
    renderComponent({ side: 0 });
    expect(getDropdownButtonByLabel('Side')).toHaveTextContent('left');
    await selectEvent.select(screen.getByText('Side'), 'right');
    expect(defaultProps.updateSide).toHaveBeenCalledWith(1);
  });

  it('renders the osics code', () => {
    renderComponent({ osicsCode: '123' });
    expect(screen.getByText(/OSICS:/).parentElement).toHaveTextContent('OSICS: 123');
  });

  it('renders the icd code', () => {
    renderComponent({ icdCode: '456' });
    expect(screen.getByText(/ICD11:/).parentElement).toHaveTextContent('ICD11: 456');
  });

  describe('When the page is fetching issue details', () => {
    it('disables the Pathology, Classification and Body Area dropdowns', () => {
      renderComponent({ isFetchingIssueDetails: true });
      expect(getDropdownButtonByLabel('Pathology')).toBeDisabled();
      expect(getDropdownButtonByLabel('Classification')).toBeDisabled();
      expect(getDropdownButtonByLabel('Body Area')).toBeDisabled();
    });
  });

  describe('Issue type dropdown', () => {
    it('renders an issue type dropdown', async () => {
      renderComponent({ typeId: 1 });
      expect(getDropdownButtonByLabel('Onset')).toHaveTextContent('Overuse');
      await selectEvent.select(screen.getByText('Onset'), 'Traumatic');
      expect(defaultProps.updateType).toHaveBeenCalledWith(2);
    });
  });

  describe('When the formType is ILLNESS', () => {
    it('renders the correct title', () => {
      renderComponent({ formType: 'ILLNESS' });
      expect(screen.getByRole('heading', { name: 'Nature of Illness' })).toBeInTheDocument();
    });
  });

  describe('When the issue is a recurrence of a prior issue', () => {
    it('disables the form', () => {
      renderComponent({ hasRecurrence: true });
      expect(getDropdownButtonByLabel('Pathology')).toBeDisabled();
      expect(getDropdownButtonByLabel('Classification')).toBeDisabled();
      expect(getDropdownButtonByLabel('Body Area')).toBeDisabled();
      expect(getDropdownButtonByLabel('Side')).toBeDisabled();
      expect(getDropdownButtonByLabel('Onset')).toBeDisabled();
    });
  });

  describe('when the custom-pathologies feature flag is on', () => {
    beforeEach(() => {
      window.featureFlags['custom-pathologies'] = true;
    });

    describe('When a pathology is selected', () => {
      it('renders the supplementary pathology checkbox and calls the correct action when checking it', async () => {
        const { user } = renderComponent({ osicsPathology: 1234 });
        const checkbox = screen.getByLabelText('Supplementary Pathology');
        expect(checkbox).toBeInTheDocument();
        await user.click(checkbox);
        expect(defaultProps.updateHasSupplementaryPathology).toHaveBeenCalledWith(true);
      });
    });

    describe('when the checkbox for displaying the input text has been checked', () => {
      it('renders the supplementary pathology input text and calls the correct action when updating it', async () => {
        const { user, container } = renderComponent({ hasSupplementaryPathology: true, supplementaryPathology: '' });
        const inputWrapper = container.querySelector('.test-athleteIssueEditor__supplementaryPathologyFieldWrapper');
        const input = within(inputWrapper).getByRole('textbox');
        expect(input).toBeInTheDocument();
        await user.type(input, 'Something');
        expect(defaultProps.updateSupplementaryPathology).toHaveBeenLastCalledWith('Something');
      });
    });
  });

  describe('when the include-bamic-on-injury feature flag is enabled', () => {
    beforeEach(() => {
      window.featureFlags['include-bamic-on-injury'] = true;
    });

    it('renders a BAMIC field group', () => {
      renderComponent({ osicsCode: 'AAAX' });
      expect(screen.getByText('Grade (optional)')).toBeInTheDocument();
      expect(screen.getByText('Site (optional)')).toBeInTheDocument();
    });

    it('does not render a BAMIC field group for illnesses', () => {
      renderComponent({ formType: 'ILLNESS', osicsCode: 'AAAX' });
      expect(screen.queryByText('Grade (optional)')).not.toBeInTheDocument();
      expect(screen.queryByText('Site (optional)')).not.toBeInTheDocument();
    });

    it('does not render a BAMIC field group for non-bamic type injuries', () => {
      renderComponent({ osicsCode: 'AAXX' });
      expect(screen.queryByText('Grade (optional)')).not.toBeInTheDocument();
      expect(screen.queryByText('Site (optional)')).not.toBeInTheDocument();
    });

    it('calls the correct callback when grade is changed', async () => {
      renderComponent({ osicsCode: 'AAAX' });
      await selectEvent.select(screen.getByText('Grade (optional)'), 'Grade 3');
      expect(defaultProps.updateBamicGradeId).toHaveBeenCalledWith(4); // Grade 3 corresponds to id 4 in bamicGrades
    });

    it('calls the correct callback when site is changed', async () => {
      renderComponent({ osicsCode: 'AAAX' });
      await selectEvent.select(screen.getByText('Site (optional)'), 'b - myotendinous / muscular');
      // The dropdown's onChange passes the ID of the selected item, which is 2 for this option.
      expect(defaultProps.updateBamicSiteId).toHaveBeenCalledWith(2);
    });

    it('disables the site field if unknown is selected for grade', () => {
      renderComponent({ bamicGradeId: 6, osicsCode: 'AAAX' });
      expect(getDropdownButtonByLabel('Site (optional)')).toBeDisabled();
    });

    it('disables the site field if N/A is selected for grade', () => {
      renderComponent({ bamicGradeId: 'N/A', osicsCode: 'AAAX' });
      expect(getDropdownButtonByLabel('Site (optional)')).toBeDisabled();
    });
  });
});
