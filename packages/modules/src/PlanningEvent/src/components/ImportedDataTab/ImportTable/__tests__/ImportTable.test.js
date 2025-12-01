import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import moment from 'moment-timezone';

import { setupStore } from '@kitman/modules/src/AppRoot/store';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import { server, rest } from '@kitman/services/src/mocks/server';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import ImportTable, { hasProgressUpdated } from '../ImportTable';

jest.mock('@kitman/common/src/hooks/useEventTracking');

const mockTrackEvent = jest.fn();

const event = {
  id: '123',
};

const props = {
  event,
  onClickImportData: jest.fn(),
  canEditEvent: true,
  t: i18nextTranslateStub(),
  showImport: false,
};

const importListMock = [
  {
    id: 1,
    created_at: '2019-09-12T20:10:10+01:00',
    progress: '100',
    type: 'Catapult',
    name: 'Catapult File Name',
    steps: [{ step_status: 'completed' }],
    source: { id: 1, name: 'Catapult', source_identifier: 'catapult' },
  },
  {
    id: 2,
    created_at: '2019-02-12T20:10:10+01:00',
    progress: '40',
    type: 'CSV',
    name: 'CSV File Name',
    steps: [],
    source: { id: null, name: null, source_identifier: null },
  },
  {
    id: 3,
    created_at: '2019-09-12T20:10:10+01:00',
    progress: '100',
    type: 'Catapult',
    name: 'Catapult File Name',
    steps: [{ step_status: 'failed' }],
    source: { id: 1, name: 'Catapult', source_identifier: 'catapult' },
  },
];

const renderComponent = (customProps = {}) => {
  const store = setupStore({});
  return render(
    <Provider store={store}>
      <ImportTable {...props} {...customProps} />
    </Provider>
  );
};

describe('<ImportTable />', () => {
  let user;
  beforeAll(() => {
    setI18n(i18n);
    moment.tz.setDefault('UTC');
  });

  beforeEach(() => {
    user = userEvent.setup();
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });

  describe('When the server returns an Error', () => {
    it('renders an error message', async () => {
      server.use(
        rest.get('/planning_hub/events/123/imports', (req, res, ctx) => {
          return res(ctx.status(404));
        })
      );

      renderComponent();

      expect(
        await screen.findByText('Something went wrong!')
      ).toBeInTheDocument();
    });
  });

  describe('When the server returns an empty array', () => {
    beforeEach(() => {
      server.use(
        rest.get('/planning_hub/events/123/imports', (req, res, ctx) => {
          return res(ctx.json([]));
        })
      );
    });

    it('renders an import button when showImport is true', async () => {
      renderComponent({ showImport: true });

      expect(
        await screen.findByRole('button', { name: 'Import Data' })
      ).toBeInTheDocument();
    });

    it('calls onClickImportData when clicking the import button', async () => {
      const onClickSpy = jest.fn();
      renderComponent({ showImport: true, onClickImportData: onClickSpy });

      const importButton = await screen.findByRole('button', {
        name: 'Import Data',
      });
      await user.click(importButton);

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });

    it('renders a message when showImport is false', async () => {
      renderComponent({ showImport: false });

      expect(
        await screen.findByText('No data has been imported')
      ).toBeInTheDocument();
    });
  });

  describe('When the server returns a list of imports', () => {
    beforeEach(() => {
      server.use(
        rest.get('/planning_hub/events/123/imports', (req, res, ctx) => {
          return res(ctx.json(importListMock));
        })
      );
    });

    it('renders the correct number of tables for the different sources', async () => {
      renderComponent();
      expect(await screen.findAllByRole('table')).toHaveLength(2);
    });

    it('renders the correct data for the last table (no source table)', async () => {
      renderComponent();

      const noSourceTable = (await screen.findAllByRole('table'))[1];
      const rows = within(noSourceTable).getAllByRole('row');

      expect(rows).toHaveLength(2); // Header + 1 data row
      expect(
        within(rows[1]).getByText('Feb 12, 2019 7:10 PM')
      ).toBeInTheDocument();
      expect(within(rows[1]).getByText('CSV File Name')).toBeInTheDocument();
      expect(within(rows[1]).getByText('CSV')).toBeInTheDocument();
      expect(within(rows[1]).getByText('In Progress')).toBeInTheDocument();
    });

    it('renders the catapult source import table', async () => {
      renderComponent();

      const catapultTable = (await screen.findAllByRole('table'))[0];
      const rows = within(catapultTable).getAllByRole('row');

      expect(rows).toHaveLength(3); // Header + 2 data rows

      expect(
        within(rows[1]).getByText('Sep 12, 2019 7:10 PM')
      ).toBeInTheDocument();
      expect(
        within(rows[1]).getByText('Catapult File Name')
      ).toBeInTheDocument();
      expect(within(rows[1]).getByText('Catapult')).toBeInTheDocument();
    });

    it('shows no delete button if the user does not have the edit session permission', async () => {
      renderComponent({ canEditEvent: false });
      await screen.findAllByRole('table');
      expect(
        screen.queryByRole('button', { name: 'icon-bin' })
      ).not.toBeInTheDocument();
    });

    it('shows no delete button if a source is not present', async () => {
      renderComponent();
      const noSourceTable = (await screen.findAllByRole('table'))[1];
      expect(
        within(noSourceTable).queryByRole('button', { name: 'icon-bin' })
      ).not.toBeInTheDocument();
    });

    it('shows a delete button if a source is present and user has permission', async () => {
      renderComponent();
      const catapultTable = (await screen.findAllByRole('table'))[0];
      expect(catapultTable.querySelector('.icon-bin')).toBeInTheDocument();
    });
  });
});

describe('hasProgressUpdated', () => {
  it('returns false when the previous import list is undefined', () => {
    expect(hasProgressUpdated(undefined, { id: 1, progress: 100 })).toBe(false);
  });

  it('returns false when the import is not in the previous import list', () => {
    expect(hasProgressUpdated([{ id: 33 }], { id: 1, progress: 100 })).toBe(
      false
    );
  });

  it("returns false when the import progress didn't change", () => {
    expect(
      hasProgressUpdated([{ id: 1, progress: 100 }], { id: 1, progress: 100 })
    ).toBe(false);
  });

  it('returns true when the import progress changed', () => {
    expect(
      hasProgressUpdated([{ id: 1, progress: 90 }], { id: 1, progress: 100 })
    ).toBe(true);
  });

  it('returns true when progressUpdated was already true', () => {
    expect(
      hasProgressUpdated([{ id: 1, progress: 90, progressUpdated: true }], {
        id: 1,
        progress: 90,
      })
    ).toBe(true);
  });
});
