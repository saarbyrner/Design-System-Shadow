import { render, screen } from '@testing-library/react';

import RiskLevelBands from '../index';
import { mockTCFGraphData } from '../../topContributingFactors/resources/chartDummyData';

describe('Risk Advisor <RiskLevelBands /> component', () => {
  const exampleDatum = mockTCFGraphData[0];
  const props = {
    datum: {
      tooltipData: {
        datumByKey: {
          top_contributing_factors: {
            datum: exampleDatum,
            index: 1,
            key: 'top_contributing_factors',
          },
        },
        nearestDatum: {
          datum: exampleDatum,
          distance: 57.634101838760586,
          index: 1,
          key: 'top_contributing_factors',
        },
      },
    },
    t: (key) => key,
  };

  it('renders', () => {
    render(<RiskLevelBands {...props} />);
    expect(
      screen.getByText(
        'RPE x Duration - Training stress balance from today - 7:28'
      )
    ).toBeInTheDocument();
  });

  describe('when there is no data', () => {
    it('displays the correct title', () => {
      render(<RiskLevelBands {...props} datum={null} />);
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('does not display the content', () => {
      render(<RiskLevelBands {...props} datum={null} />);
      expect(screen.queryByText('Acute period')).not.toBeInTheDocument();
      expect(screen.queryByText('Chronic period')).not.toBeInTheDocument();
    });
  });

  describe('when the data does not contain first period', () => {
    const datumWithoutFirstPeriod = {
      ...props.datum,
      tooltipData: {
        ...props.datum.tooltipData,
        nearestDatum: {
          ...props.datum.tooltipData.nearestDatum,
          datum: {
            ...props.datum.tooltipData.nearestDatum.datum,
            parts: {
              ...props.datum.tooltipData.nearestDatum.datum.parts,
              period_1: null,
            },
          },
        },
      },
    };

    it('displays the correct subtitle', () => {
      render(<RiskLevelBands {...props} datum={datumWithoutFirstPeriod} />);
      expect(screen.queryByText('Acute period')).not.toBeInTheDocument();
    });
  });

  describe('when the data does not contain second period', () => {
    const datumWithoutSecondPeriod = {
      ...props.datum,
      tooltipData: {
        ...props.datum.tooltipData,
        nearestDatum: {
          ...props.datum.tooltipData.nearestDatum,
          datum: {
            ...props.datum.tooltipData.nearestDatum.datum,
            parts: {
              ...props.datum.tooltipData.nearestDatum.datum.parts,
              period_2: null,
            },
          },
        },
      },
    };

    it('displays the correct subtitle', () => {
      render(<RiskLevelBands {...props} datum={datumWithoutSecondPeriod} />);
      expect(screen.queryByText('Chronic period')).not.toBeInTheDocument();
    });
  });

  describe('when the data does not contain a severe injury risk zone', () => {
    const datumWithoutSevereRiskZone = {
      ...props.datum,
      tooltipData: {
        ...props.datum.tooltipData,
        nearestDatum: {
          ...props.datum.tooltipData.nearestDatum,
          datum: {
            ...props.datum.tooltipData.nearestDatum.datum,
            normalized_risk_bands: {
              ...props.datum.tooltipData.nearestDatum.datum
                .normalized_risk_bands,
              bands: [
                { xstart: 0, xend: 0.3032644982516329, zone: 'lightred' },
                {
                  xstart: 0.3032644982516329,
                  xend: 0.4258164544434914,
                  zone: 'lightred',
                },
                {
                  xstart: 0.4258164544434914,
                  xend: 0.7316223527083197,
                  zone: 'yellow',
                },
                {
                  xstart: 0.7316223527083197,
                  xend: 0.8938906115986012,
                  zone: 'lightyellow',
                },
                { xstart: 0.8938906115986012, xend: 1, zone: 'lightred' },
              ],
            },
            risk_bands: [
              { xstart: 0, xend: 919.316, zone: 'lightred' },
              { xstart: 1290.82, xend: 2217.84, zone: 'yellow' },
              { xend: 2709.74, xstart: 2217.84, zone: 'lightyellow' },
              { xstart: 2709.74, xend: 3031.4, zone: 'lightred' },
            ],
          },
        },
      },
    };

    it('does not display the risk level notification', () => {
      render(<RiskLevelBands {...props} datum={datumWithoutSevereRiskZone} />);
      expect(
        screen.queryByText('Increase in injury risk when the value is between:')
      ).not.toBeInTheDocument();
    });
  });

  describe('when the data contains a severe injury risk zone', () => {
    it('displays the correct risk level notification', () => {
      render(<RiskLevelBands {...props} />);
      expect(screen.getByText('919.3 - 1290.8')).toBeInTheDocument();
    });
  });
});
