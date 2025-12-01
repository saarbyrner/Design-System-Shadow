import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest, server } from '@kitman/services/src/mocks/server';
import { data as mockAthleteIssueStatuses } from '@kitman/services/src/mocks/handlers/medical/getAthleteIssueStatuses';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import {
  OrganisationProvider,
  useOrganisation,
} from '@kitman/common/src/contexts/OrganisationContext';
// eslint-disable-next-line jest/no-mocks-import
import mockedOrganisation from '@kitman/common/src/contexts/OrganisationContext/__mocks__/organisation';
import IssuesFilters from '../IssuesFilters';
import { athleteIssueTypes } from '../../../utils';

// Mock CustomDateRangePicker to simplify feature-flag tests
jest.mock(
  '@kitman/playbook/components/wrappers/CustomDateRangePicker',
  () => () => <div>CustomDateRangePickerStub</div>
);

setI18n(i18n);

// Mock OrganisationContext to control the organisation data
jest.mock('@kitman/common/src/contexts/OrganisationContext', () => ({
  ...jest.requireActual('@kitman/common/src/contexts/OrganisationContext'),
  useOrganisation: jest.fn(),
  OrganisationProvider: jest.requireActual(
    '@kitman/common/src/contexts/OrganisationContext'
  ).OrganisationProvider,
}));

// Mock the default return value of useOrganisation

describe('<IssuesFilters />', () => {
  const props = {
    athleteIssueStatuses: mockAthleteIssueStatuses,
    athleteIssueTypes,
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    // Default organisation and feature-flag
    useOrganisation.mockReturnValue({ organisation: mockedOrganisation });
    window.getFlag = jest.fn().mockReturnValue(false);
  });
  // Setup userEvent
  let user;
  beforeEach(() => {
    user = userEvent.setup();
  });

  it('renders the web and mobile filters correctly', async () => {
    render(<IssuesFilters {...props} />);

    const searchFilters = screen.getAllByPlaceholderText('Search');
    expect(searchFilters).toHaveLength(2);

    const typeFilters = screen.getAllByText('Type', {
      class: 'kitmanReactSelect__placeholder',
    });
    expect(typeFilters).toHaveLength(2);

    const statusFilters = screen.getAllByText('Status', {
      class: 'kitmanReactSelect__placeholder',
    });
    expect(statusFilters).toHaveLength(2);

    const dateFilters = screen.getAllByText(/date range/i);
    expect(dateFilters).toHaveLength(2);
  });

  it('renders the filters in a side panel when on mobile', async () => {
    render(<IssuesFilters {...props} />);

    // Panel closed initially
    const mobileFiltersPanelContent = screen.queryByTestId(
      'mobile-filters-panel-content'
    );
    expect(mobileFiltersPanelContent).not.toBeInTheDocument();

    // Find and click the button to open the side panel.
    // Open panel

    const filterButton = screen.getByRole('button', { name: /filters/i });
    await user.click(filterButton);

    // After clicking, the panel should be open. Wait for an element inside the panel to appear.
    const mobilePanel = screen.getByTestId('sliding-panel');
    // Check the presence of filters in the mobile panel using role and placeholder
    const searchFilterMobile =
      within(mobilePanel).getByPlaceholderText('Search');
    const typeFilterMobile = within(mobilePanel).getByText('Type', {
      class: 'kitmanReactSelect__placeholder',
    });
    const statusFilterMobile = within(mobilePanel).getByText('Status', {
      class: 'kitmanReactSelect__placeholder',
    });

    expect(searchFilterMobile).toBeInTheDocument();
    expect(typeFilterMobile).toBeInTheDocument();
    expect(statusFilterMobile).toBeInTheDocument();
  });

  describe('[feature-flag] when the coding system is CLINICAL_IMPRESSIONS', () => {
    beforeEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = true;
      // Mock the specific AJAX endpoint using MSW
      server.use(
        rest.get('/ui/organisation/organisations/current', (req, res, ctx) => {
          return res(
            ctx.json({
              ...mockedOrganisation,
              coding_system_key: codingSystemKeys.CLINICAL_IMPRESSIONS,
            })
          );
        })
      );
      useOrganisation.mockReturnValue({
        organisation: {
          ...mockedOrganisation,
          coding_system_key: codingSystemKeys.CLINICAL_IMPRESSIONS,
        },
      });
    });

    afterEach(() => {
      window.featureFlags['emr-multiple-coding-systems'] = false;
    });

    it('does not render the issue type filter', async () => {
      render(
        <OrganisationProvider>
          <IssuesFilters {...props} />
        </OrganisationProvider>
      );
      // Wait for the search filter to appear, as it should always be present.
      const searchFilters = await screen.findAllByPlaceholderText('Search');
      expect(searchFilters).toHaveLength(2);
      // Check that the issue type filter is not present
      const typeFilter = screen.queryByText('Type', {
        class: 'kitmanReactSelect__placeholder',
      });
      expect(typeFilter).not.toBeInTheDocument();
      // Check that the status filter is present
      const statusFilters = screen.getAllByText('Status', {
        class: 'kitmanReactSelect__placeholder',
      });
      expect(statusFilters).toHaveLength(2);
    });
  });

  describe('[feature-flag] pm-date-range-picker-custom', () => {
    beforeEach(() => {
      window.getFlag = jest
        .fn()
        .mockImplementation((flag) => flag === 'pm-date-range-picker-custom');
    });

    afterEach(() => {
      window.getFlag.mockReset();
    });

    it('renders CustomDateRangePicker when feature flag is enabled', () => {
      render(<IssuesFilters {...props} />);
      const stubs = screen.getAllByText('CustomDateRangePickerStub');
      expect(stubs).toHaveLength(2);
    });
  });
});
