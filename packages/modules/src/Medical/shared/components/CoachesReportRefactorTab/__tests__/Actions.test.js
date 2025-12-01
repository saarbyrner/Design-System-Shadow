import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { axios } from '@kitman/common/src/utils/services';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import Actions from '../components/Actions';

jest.mock('@kitman/common/src/hooks/useEventTracking');

describe('<Actions />', () => {
  const i18nT = i18nextTranslateStub();

  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    globalApi: {},
    medicalApi: {},
  });

  beforeEach(() => {
    useEventTracking.mockReturnValue({ trackEvent: jest.fn() });
  });

  describe('coachesReportV2', () => {
    const user = userEvent.setup();
    const props = {
      t: i18nT,
      filters: {
        squads: [1],
      },
      dataGridCurrentDate: 'Wed May 22 2029 17:55:15 GMT+0100',
      coachesReportV2Enabled: true,
      rehydrateGrid: jest.fn(),
      handleCopyLastReport: jest.fn(),
    };

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('renders action buttons as expected with nessesary prop/permission present', () => {
      render(
        <Provider store={store}>
          <Actions {...props} canExport canCreateNotes />
        </Provider>
      );

      expect(
        screen.getByRole('button', { name: 'Export' })
      ).toBeInTheDocument();

      expect(
        screen.getByRole('button', { name: 'Copy last report' })
      ).toBeInTheDocument();
    });

    it('does not render action buttons when nessesary prop/permission NOT present', () => {
      // canCreateNotes prop = medical.notes.canCreate permission
      render(
        <Provider store={store}>
          <Actions {...props} canExport={false} canCreateNotes={false} />
        </Provider>
      );

      expect(
        screen.queryByRole('button', { name: 'Export' })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByRole('button', { name: 'Copy last report' })
      ).not.toBeInTheDocument();
    });

    it('does not render the Export button when prop/permission NOT present', () => {
      // canCreateNotes prop = medical.notes.canCreate permission
      render(
        <Provider store={store}>
          <Actions {...props} canExport={false} />
        </Provider>
      );

      expect(screen.queryByText('Export')).not.toBeInTheDocument();
    });

    it('does not render the Copy last report button when coachesReportV2Enabled is false', () => {
      // coachesReportV2Enabled prop = 'coaches-report-v2' FF
      render(
        <Provider store={store}>
          <Actions {...props} coachesReportV2Enabled={false} />
        </Provider>
      );

      expect(
        screen.queryByRole('button', { name: 'Copy last report' })
      ).not.toBeInTheDocument();
    });

    it('does not render Copy last report button when canCreateNotes is FALSE', async () => {
      // canCreateNotes prop = medical.notes.canCreate permission
      const getMultipleCoachesNotes = jest.spyOn(axios, 'post');

      render(
        <Provider store={store}>
          <Actions {...props} canExport canCreateNotes={false} />
        </Provider>
      );
      const copyLastReportButton = screen.queryByRole('button', {
        name: 'Copy last report',
      });

      expect(copyLastReportButton).not.toBeInTheDocument();

      expect(getMultipleCoachesNotes).toHaveBeenCalledTimes(0);
      expect(props.rehydrateGrid).toHaveBeenCalledTimes(0);
    });

    it('calls the correct callback when copy last report button is clicked', async () => {
      render(
        <Provider store={store}>
          <Actions {...props} canExport canCreateNotes />
        </Provider>
      );
      const copyLastReportButton = screen.getByRole('button', {
        name: 'Copy last report',
      });

      await user.click(copyLastReportButton);

      expect(props.handleCopyLastReport).toHaveBeenCalledTimes(1);
    });
  });

  describe('[FEATURE FLAG] - nfl-coaches-report', () => {
    const props = {
      t: i18nT,
      filters: {
        squads: [1],
      },
    };

    beforeEach(() => {
      window.featureFlags = { 'nfl-coaches-report': true };
    });
    afterEach(() => {
      window.featureFlags = { 'nfl-coaches-report': false };
      jest.restoreAllMocks();
    });

    it('renders the component', () => {
      render(
        <Provider store={store}>
          <Actions {...props} canExport />
        </Provider>
      );

      expect(screen.getByText('Export')).toBeInTheDocument();
    });

    it('does not render the component without permission', () => {
      render(
        <Provider store={store}>
          <Actions {...props} canExport={false} />
        </Provider>
      );

      expect(screen.queryByText('Export')).not.toBeInTheDocument();
    });
  });
});
