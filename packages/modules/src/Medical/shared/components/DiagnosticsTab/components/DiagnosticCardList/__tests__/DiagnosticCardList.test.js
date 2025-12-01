import { render, screen, within } from '@testing-library/react';
import moment from 'moment-timezone';
import { Provider } from 'react-redux';

import { data } from '../../../__tests__/mocks/getDiagnostics';
import DiagnosticCardList from '..';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  medicalApi: {},
  addDiagnosticSidePanel: {
    isOpen: false,
    initialInfo: {
      isAthleteSelectable: true,
    },
  },
  addDiagnosticAttachmentSidePanel: {
    isOpen: false,
    diagnosticId: null,
  },
  medicalHistory: {},
});

const props = {
  athleteId: 666,
  diagnostics: data.diagnostics,
  isLoading: false,
  openAddDiagnosticAttachmentSidePanel: jest.fn(),
  currentOrganisation: { id: 1 },
  diagnosticReasons: [],
  t: (t) => t,
};

describe('<DiagnosticCardList />', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });
  afterEach(() => {
    moment.tz.setDefault();
  });

  it('renders the correct content', () => {
    render(
      <Provider store={store}>
        <DiagnosticCardList {...props} />
      </Provider>
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('renders the correct columns in the DataTable', () => {
    render(
      <Provider store={store}>
        <DiagnosticCardList {...props} />
      </Provider>
    );

    const table = screen.getByRole('table');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(8);
    expect(headers[0]).toHaveTextContent('Type');
    expect(headers[1]).toHaveTextContent('Date');
    expect(headers[2]).toHaveTextContent('Link to an Injury/Illness');
    expect(headers[3]).toHaveTextContent('Attachments');
    expect(headers[4]).toHaveTextContent('Practitioner');
    expect(headers[5]).toHaveTextContent('Reason');
    expect(headers[6]).toHaveTextContent('Location');
    expect(headers[7]).toHaveTextContent('');
  });

  it('renders the correct columns when showAvatar prop exists', () => {
    render(
      <Provider store={store}>
        <DiagnosticCardList {...props} showAvatar />
      </Provider>
    );

    const table = screen.getByRole('table');
    const headers = within(table).getAllByRole('columnheader');
    expect(headers).toHaveLength(9);
    expect(headers[0]).toHaveTextContent('Player');
    expect(headers[1]).toHaveTextContent('Type');
    expect(headers[2]).toHaveTextContent('Date');
    expect(headers[3]).toHaveTextContent('Link to an Injury/Illness');
    expect(headers[4]).toHaveTextContent('Attachments');
    expect(headers[5]).toHaveTextContent('Practitioner');
    expect(headers[6]).toHaveTextContent('Reason');
    expect(headers[7]).toHaveTextContent('Location');
    expect(headers[8]).toHaveTextContent('');
  });

  describe('when the medical-diagnostics-iteration-3-billing-cpt flag is on', () => {
    beforeEach(() => {
      window.setFlag('medical-diagnostics-iteration-3-billing-cpt', true);
    });

    afterEach(() => {
      window.setFlag('medical-diagnostics-iteration-3-billing-cpt', false);
    });

    it('renders the billable columns in the DataTable', () => {
      render(
        <Provider store={store}>
          <DiagnosticCardList {...props} />
        </Provider>
      );

      const table = screen.getByRole('table');
      const headers = within(table).getAllByRole('columnheader');
      expect(headers).toHaveLength(12);
      expect(headers[7]).toHaveTextContent('CPT code');
      expect(headers[8]).toHaveTextContent('Billable');
      expect(headers[9]).toHaveTextContent('Amount paid by insurance');
      expect(headers[10]).toHaveTextContent('Amount paid by athlete');
    });

    describe('when the diagnostics-billing-extra-fields flag is on', () => {
      beforeEach(() => {
        window.setFlag('diagnostics-billing-extra-fields', true);
      });

      afterEach(() => {
        window.setFlag('diagnostics-billing-extra-fields', false);
      });

      it('renders the billable columns in the DataTable', () => {
        render(
          <Provider store={store}>
            <DiagnosticCardList {...props} />
          </Provider>
        );

        const table = screen.getByRole('table');
        const headers = within(table).getAllByRole('columnheader');
        expect(headers).toHaveLength(16);
        expect(headers[7]).toHaveTextContent('CPT code');
        expect(headers[8]).toHaveTextContent('Billable');
        expect(headers[9]).toHaveTextContent('Amount charged');
        expect(headers[10]).toHaveTextContent('Discount/ reduction');
        expect(headers[11]).toHaveTextContent('Amount insurance paid');
        expect(headers[12]).toHaveTextContent('Amount due');
        expect(headers[13]).toHaveTextContent('Amount athlete paid');
        expect(headers[14]).toHaveTextContent('Date paid');
      });
    });
  });

  it('renders the correct rows in the DataTable', () => {
    render(
      <Provider store={store}>
        <DiagnosticCardList {...props} showAvatar />
      </Provider>
    );

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    const firstRow = rows[1]; // First data row

    const avatar = within(firstRow).getByRole('img');
    expect(avatar).toHaveAttribute('src', '/avatars/are/cool.com');
    expect(avatar).toHaveAttribute(
      'alt',
      `${data.diagnostics[0].athlete.fullname}'s avatar`
    );

    expect(
      within(firstRow).getByText('Adductor strain [Right]')
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByText('Chronic Injury Full Pathology 1')
    ).toBeInTheDocument();
    expect(within(firstRow).getByText('filePond.png')).toBeInTheDocument();
    expect(within(firstRow).getByText('3D Analysis')).toBeInTheDocument();
    expect(within(firstRow).getByText('May 15, 2022')).toBeInTheDocument();
  });

  describe('when redox-iteration-1 and redox flag is on', () => {
    beforeEach(() => {
      window.setFlag('redox-iteration-1', true);
      window.setFlag('redox', true);
    });
    afterEach(() => {
      window.setFlag('redox-iteration-1', false);
      window.setFlag('redox', false);
    });

    it('renders the columns correctly in the DataTable', () => {
      render(
        <Provider store={store}>
          <DiagnosticCardList {...props} />
        </Provider>
      );
      const table = screen.getByRole('table');
      const headers = within(table).getAllByRole('columnheader');
      expect(headers).toHaveLength(9);
      expect(screen.queryByText('Location')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Link to an Injury/Illness')
      ).not.toBeInTheDocument();
    });
  });

  describe('when redox-iteration-1 and redox flag is off', () => {
    beforeEach(() => {
      window.setFlag('redox-iteration-1', false);
      window.setFlag('redox', false);
    });

    it('renders the columns correctly in the DataTable', () => {
      render(
        <Provider store={store}>
          <DiagnosticCardList {...props} />
        </Provider>
      );
      const table = screen.getByRole('table');
      const headers = within(table).getAllByRole('columnheader');
      expect(headers).toHaveLength(8);
      expect(screen.getByText('Link to an Injury/Illness')).toBeInTheDocument();
      expect(screen.getByText('Location')).toBeInTheDocument();
    });
  });

  describe('when viewing a diagnostic created by a different organisation', () => {
    it('does not render the action cell', () => {
      render(
        <Provider store={store}>
          <DiagnosticCardList {...props} currentOrganisation={{ id: 999 }} />
        </Provider>
      );
      expect(
        screen.queryByTestId('DiagnosticCardList|Actions')
      ).not.toBeInTheDocument();
    });
  });

  describe('Edit diagnostic action', () => {
    beforeEach(() => {
      window.setFlag('redox', false);
      window.setFlag('redox-iteration-1', false);
      window.setFlag('pm-diagnostic-ga-enhancement', true);
    });
    afterEach(() => {
      window.setFlag('redox', false);
      window.setFlag('redox-iteration-1', false);
      window.setFlag('pm-diagnostic-ga-enhancement', false);
    });

    it('opens "Edit diagnostic" side panel', () => {
      const openAddDiagnosticSidePanel = jest.fn();
      render(
        <Provider store={store}>
          <DiagnosticCardList
            {...props}
            openAddDiagnosticSidePanel={openAddDiagnosticSidePanel}
          />
        </Provider>
      );
      screen.getByRole('button').click();
      const menu = screen.getByRole('tooltip');
      const editItem = within(menu).getByRole('button', {
        name: 'Edit diagnostic',
      });
      editItem.click();
      const first = props.diagnostics[0];
      expect(openAddDiagnosticSidePanel).toHaveBeenCalledWith({
        diagnosticId: first.id,
        isAthleteSelectable: false,
        athleteId: first.athlete.id,
      });
    });
  });
});
