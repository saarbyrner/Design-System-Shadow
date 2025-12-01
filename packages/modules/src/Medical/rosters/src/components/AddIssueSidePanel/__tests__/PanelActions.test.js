import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';

import PanelActions from '../PanelActions';

setI18n(i18n);

describe('<PanelActions />', () => {
  const onClickCreateIssue = jest.fn();
  const setuploadQueuedAttachments = jest.fn();
  const onClickBack = jest.fn();
  const onClickNext = jest.fn();
  const formValidation = jest.fn(() => true);
  const setAllowCreateIssue = jest.fn();

  const defaultProps = {
    currentPage: 1,
    allowCreateIssue: false,
    annotations: [],
    onClickBack,
    onClickCreateIssue,
    setuploadQueuedAttachments,
    onClickNext,
    formValidation,
    selectedChronicIssue: null,
    issueType: 'INJURY',
    setAllowCreateIssue,
    t: i18nextTranslateStub(),
  };

  it('renders', () => {
    render(<PanelActions {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  describe('when the current page is not the first one', () => {
    it('has a back button', () => {
      render(<PanelActions {...defaultProps} currentPage={2} />);
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });
  });

  describe('when the current page is not the last one', () => {
    it('has a next button', () => {
      render(<PanelActions {...defaultProps} />);
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
    });
  });

  it('Calls onClickCreateIssue when next button clicked, on last page, and no annotations', async () => {
    const { user } = renderWithUserEventSetup(
      <PanelActions {...defaultProps} currentPage={4} />
    );

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(setuploadQueuedAttachments).not.toHaveBeenCalled();
    expect(onClickCreateIssue).toHaveBeenCalled();
  });

  it('has a next button which calls setuploadQueuedAttachments when clicked', async () => {
    const { user } = renderWithUserEventSetup(
      <PanelActions
        {...defaultProps}
        currentPage={4}
        annotations={[{ annotationExists: true }]}
        allowCreateIssue
      />
    );
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(setuploadQueuedAttachments).toHaveBeenCalled();
  });

  describe('[FEATURE FLAG] preliminary-injury-illness', () => {
    beforeEach(() => {
      window.featureFlags['preliminary-injury-illness'] = true;
    });
    afterEach(() => {
      window.featureFlags['preliminary-injury-illness'] = false;
    });
    it('renders the Save Progress button', () => {
      render(<PanelActions {...defaultProps} currentPage={2} />);
      expect(
        screen.getByRole('button', { name: 'Save Progress' })
      ).toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] chronic-injury-illness', () => {
    beforeEach(() => {
      window.featureFlags['chronic-injury-illness'] = true;
    });
    afterEach(() => {
      window.featureFlags['chronic-injury-illness'] = false;
    });

    it('should not render Save Progress button if No Prior Chronic option is selected.', () => {
      const propsForChronicIssue = {
        ...defaultProps,
        selectedChronicIssue: 'NoPriorChronicRecorded',
      };
      render(<PanelActions {...propsForChronicIssue} currentPage={2} />);

      expect(
        screen.queryByRole('button', { name: 'Save Progress' })
      ).not.toBeInTheDocument();
    });
  });

  describe('[FEATURE FLAG] chronic-conditions-updated-fields', () => {
    beforeEach(() => {
      window.featureFlags['chronic-injury-illness'] = true;
      window.featureFlags['chronic-conditions-updated-fields'] = true;
    });
    afterEach(() => {
      window.featureFlags['chronic-injury-illness'] = false;
      window.featureFlags['chronic-conditions-updated-fields'] = false;
    });

    it('Calls onClickCreateIssue when next button clicked, on second page', async () => {
      const { user } = renderWithUserEventSetup(
        <PanelActions
          {...defaultProps}
          issueType="CHRONIC_INJURY"
          currentPage={2}
        />
      );

      await user.click(screen.getByRole('button', { name: 'Next' }));

      expect(setuploadQueuedAttachments).not.toHaveBeenCalled();
      expect(onClickCreateIssue).toHaveBeenCalled();
    });
  });
});
