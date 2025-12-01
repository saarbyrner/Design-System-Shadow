import { render, screen } from '@testing-library/react';
import i18n from 'i18next';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { emptySquadAthletes } from '@kitman/modules/src/analysis/Dashboard/components/utils';
import LongitudinalColumn from '../LongitudinalColumn';

describe('LongitudinalColumn', () => {
  const i18nT = i18nextTranslateStub(i18n);

  const props = {
    t: i18nT,
    appliedRowDetails: [],
    calculation: 'sum',
    formattingRules: [],
    id: 999,
    isSorted: false,
    dataStatus: 'SUCCESS',
    data: [],
    name: 'Test Longitudinal Column',
    populationDetails: {
      ...emptySquadAthletes,
    },
    showSummary: true,
    summaryCalculation: '',
    squadAthletes: { position_groups: [] },
    selectedSquads: [],
  };

  describe('when FF rep-historic-reporting is on', () => {
    beforeEach(() => {
      window.setFlag('rep-historic-reporting', true);
    });

    afterEach(() => {
      window.setFlag('rep-historic-reporting', false);
    });

    it('shows the text Historical squad if historic is true in the population', () => {
      render(
        <LongitudinalColumn
          {...props}
          populationDetails={{ ...emptySquadAthletes, historic: true }}
        />
      );
      expect(screen.getByText('Historical squad')).toBeInTheDocument();
    });

    it('does not show the Historical squad text if historic is false in the population', () => {
      render(
        <LongitudinalColumn
          {...props}
          populationDetails={{ ...emptySquadAthletes }}
        />
      );
      expect(screen.queryByText('Historical squad')).not.toBeInTheDocument();
    });
  });

  it('renders caching loader when status is "CACHING"', () => {
    const cachingProps = {
      ...props,
      dataStatus: 'CACHING',
    };
    render(<LongitudinalColumn {...cachingProps} />);
    expect(screen.getByTestId('caching-loader')).toBeInTheDocument();
  });
});
