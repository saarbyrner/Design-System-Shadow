// packages/modules/src/Medical/forms/src/components/FormOverviewTab/__tests__/FormOverviewTab.test.js
import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormOverviewTab from '../index';
import formInfoMock, {
  baselineFormInfoResult,
} from '../../../mocks/formInfoMock';
import { mockSections } from '../../../../../shared/components/DynamicMedicalForms/mocks/data.mock';

const renderFormOverviewTab = (overrideProps = {}) => {
  const props = {
    sections: mockSections,
    formInfo: formInfoMock,
    displayFormInfo: true,
    requestStatus: 'SUCCESS',
    t: i18nextTranslateStub(),
    ...overrideProps,
  };
  return render(<FormOverviewTab {...props} />);
};

describe('<FormOverviewTab />', () => {
  describe('when request is successful', () => {
    it('renders all sections by default', async () => {
      renderFormOverviewTab();

      // Because the component now has a mocked async update, we should
      // wait for a final element to appear to ensure everything is settled.
      expect(
        await screen.findByRole('heading', { name: /linked injury/i })
      ).toBeInTheDocument();

      // Now we can safely check for all other content
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /space/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /sport/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /form details/i })
      ).toBeInTheDocument();
    });

    it('hides the FormLinkedIssueSection for baseline forms', () => {
      renderFormOverviewTab({ formInfo: baselineFormInfoResult });

      expect(
        screen.queryByRole('heading', { name: /linked injury/i })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: /form details/i })
      ).toBeInTheDocument();
    });

    it('hides the FormInfoSection when displayFormInfo prop is false', async () => {
      renderFormOverviewTab({ displayFormInfo: false });

      // Still need to await the content from the async child component
      expect(
        await screen.findByRole('heading', { name: /linked injury/i })
      ).toBeInTheDocument();

      expect(
        screen.queryByRole('heading', { name: /form details/i })
      ).not.toBeInTheDocument();
    });
  });

  describe('when request is pending', () => {
    it('renders a loader and hides the content', () => {
      renderFormOverviewTab({ requestStatus: 'PENDING' });

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: /space/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: /form details/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('heading', { name: /linked injury/i })
      ).not.toBeInTheDocument();
    });
  });
});
