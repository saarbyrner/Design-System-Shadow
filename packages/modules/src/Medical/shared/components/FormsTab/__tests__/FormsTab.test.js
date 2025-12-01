import { render, screen, act, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormsTab from '..';

describe('<FormsTab />', () => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const store = storeFake({
    medicalApi: {},
  });

  afterAll(() => {
    jest.clearAllMocks();
    window.featureFlags = {};
  });

  const props = {
    reloadData: false,
    athleteId: 116,
    t: i18nextTranslateStub(),
  };

  describe('When show-isu-registration-forms-in-emr feature flag is off', () => {
    beforeEach(() => {
      i18nextTranslateStub();
      window.featureFlags['show-isu-registration-forms-in-emr'] = false;
    });

    it('displays the correct data after loading', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <FormsTab {...props} />
          </Provider>
        );
      });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'All forms'
      );

      const grid = screen.getByRole('grid');
      const headers = within(grid).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Form Type');
      expect(headers[1]).toHaveTextContent('Completion Date');

      const rows = within(grid).getAllByRole('row');
      expect(rows).toHaveLength(5);

      const cellsFirstRow = within(rows[1]).getAllByRole('gridcell');
      expect(cellsFirstRow).toHaveLength(2);
      expect(cellsFirstRow[0]).toHaveTextContent('King Devick - Baseline');
      expect(cellsFirstRow[1]).toHaveTextContent('February 3, 2022');

      const cellsSecondRow = within(rows[2]).getAllByRole('gridcell');
      expect(cellsSecondRow).toHaveLength(2);
      expect(cellsSecondRow[0]).toHaveTextContent(
        'Near Point of Convergence - Baseline'
      );
      expect(cellsSecondRow[1].firstChild).toBeEmptyDOMElement();

      const cellsThirdRow = within(rows[3]).getAllByRole('gridcell');
      expect(cellsThirdRow).toHaveLength(2);
      expect(cellsThirdRow[0]).toHaveTextContent(
        'Near Point of Convergence - Baseline'
      );
      expect(cellsThirdRow[1].firstChild).toBeEmptyDOMElement();

      const cellsFourthRow = within(rows[4]).getAllByRole('gridcell');
      expect(cellsFourthRow).toHaveLength(2);
      expect(cellsFourthRow[0]).toHaveTextContent(
        'Baseline (Neurological Section Optional)'
      );
      expect(cellsFourthRow[1].firstChild).toBeEmptyDOMElement();
    });
  });

  describe('When show-isu-registration-forms-in-emr feature flag is on', () => {
    beforeEach(() => {
      i18nextTranslateStub();
      window.featureFlags['show-isu-registration-forms-in-emr'] = true;
    });

    afterEach(() => {
      window.featureFlags['show-isu-registration-forms-in-emr'] = false;
    });

    it('displays the correct data after loading', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <FormsTab {...props} />
          </Provider>
        );
      });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'All forms'
      );

      const grid = screen.getByRole('grid');
      const headers = within(grid).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Form Type');
      expect(headers[1]).toHaveTextContent('Completion Date');

      const rows = within(grid).getAllByRole('row');
      expect(rows).toHaveLength(5);

      const cellsFirstRow = within(rows[1]).getAllByRole('gridcell');
      expect(cellsFirstRow).toHaveLength(2);
      expect(cellsFirstRow[0]).toHaveTextContent(
        'Insurance Information and Verification'
      );
      expect(cellsFirstRow[1]).toHaveTextContent('May 22, 2023');

      const cellsSecondRow = within(rows[2]).getAllByRole('gridcell');
      expect(cellsSecondRow).toHaveLength(2);
      expect(cellsSecondRow[0]).toHaveTextContent(
        'Pre-Participation Medical History Questionnaire'
      );
      expect(cellsSecondRow[1]).toHaveTextContent('May 22, 2023');

      const cellsThirdRow = within(rows[3]).getAllByRole('gridcell');
      expect(cellsThirdRow).toHaveLength(2);
      expect(cellsThirdRow[0]).toHaveTextContent(
        'Consent for Treatment of a Minor'
      );
      expect(cellsThirdRow[1]).toHaveTextContent('May 19, 2023');

      const cellsFourthRow = within(rows[4]).getAllByRole('gridcell');
      expect(cellsFourthRow).toHaveLength(2);
      expect(cellsFourthRow[0]).toHaveTextContent(
        'Authorization for Release of Medical Information'
      );
      expect(cellsFourthRow[1]).toHaveTextContent('May 19, 2023');
    });
  });

  describe('When nba-show-demo feature flag is on', () => {
    beforeEach(() => {
      i18nextTranslateStub();
      window.featureFlags['show-isu-registration-forms-in-emr'] = false;
      window.featureFlags['nba-show-demo'] = true;
    });

    afterEach(() => {
      window.featureFlags['nba-show-demo'] = false;
    });

    it('displays the correct data after loading', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <FormsTab {...props} />
          </Provider>
        );
      });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'All forms'
      );

      const grid = screen.getByRole('grid');
      const headers = within(grid).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Form Type');
      expect(headers[1]).toHaveTextContent('Completion Date');

      const rows = within(grid).getAllByRole('row');
      expect(rows).toHaveLength(2);

      const cellsFirstRow = within(rows[1]).getAllByRole('gridcell');
      expect(cellsFirstRow).toHaveLength(2);
      expect(cellsFirstRow[0]).toHaveTextContent('Prophylactic Ankle Support');
      expect(cellsFirstRow[1]).toHaveTextContent('July 3, 2023');
    });
  });

  describe('When show-pl-forms-in-emr feature flag is on', () => {
    beforeEach(() => {
      i18nextTranslateStub();
      window.featureFlags['show-pl-forms-in-emr'] = true;
    });

    afterEach(() => {
      window.featureFlags['show-pl-forms-in-emr'] = false;
    });

    it('displays the correct data after loading', async () => {
      await act(async () => {
        render(
          <Provider store={store}>
            <FormsTab {...props} />
          </Provider>
        );
      });

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
        'All forms'
      );

      const grid = screen.getByRole('grid');
      const headers = within(grid).getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
      expect(headers[0]).toHaveTextContent('Form Type');
      expect(headers[1]).toHaveTextContent('Completion Date');

      const rows = within(grid).getAllByRole('row');
      expect(rows).toHaveLength(2);

      const cellsFirstRow = within(rows[1]).getAllByRole('gridcell');
      expect(cellsFirstRow).toHaveLength(2);
      expect(cellsFirstRow[0]).toHaveTextContent('Some PL form');
      expect(cellsFirstRow[1]).toHaveTextContent('July 3, 2023');
    });
  });
});
