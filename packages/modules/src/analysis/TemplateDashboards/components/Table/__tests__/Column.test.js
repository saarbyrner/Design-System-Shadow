import { render, screen } from '@testing-library/react';
import { colors } from '@kitman/common/src/variables';
import Column from '../Column/Column';
import { formatToDate } from '../utils';
import { mockRows } from './testUtils';

const mockRowData = mockRows[0];

const mockAthlete = {
  fullname: 'Test athlete',
};

const emptyCellColours = {
  backgroundColor: colors.white,
  color: colors.grey_300,
};

const renderComponentWithAdjustedRowData = (
  { rowData, athlete } = { rowData: null, athlete: null }
) => {
  return render(
    <Column rowData={{ ...mockRowData, ...rowData }} athlete={athlete} />
  );
};

describe('<Column />', () => {
  beforeEach(() => {
    window.featureFlags = {
      'g-and-m-new-columns': true,
      'mirwald-calculation': true,
      'growth-and-maturation-pl-configuration': true,
    };
  });

  it('should populate the table with athlete name', () => {
    renderComponentWithAdjustedRowData({ rowData: null, athlete: mockAthlete });

    const athleteName = screen.getByText('Test athlete');
    expect(athleteName).toBeVisible();
  });

  it('should populate row data formatted', () => {
    renderComponentWithAdjustedRowData();

    const mostRecentMeasurement = screen.getAllByText(
      formatToDate(mockRowData.most_recent_measurement)
    );
    expect(mostRecentMeasurement[0]).toBeVisible();
    expect(mostRecentMeasurement[1]).not.toBeVisible();
  });

  describe('conditional formatting', () => {
    describe('% adult height attained', () => {
      it('should format the cell red when >= 90 and <= 93', () => {
        renderComponentWithAdjustedRowData({
          rowData: { g_and_m_percent_adult_height_att: 92 },
        });

        const adultHeight = screen.getByText('92.0');
        expect(adultHeight).toHaveStyle({
          backgroundColor: colors.red_200,
          color: colors.white,
        });
      });

      it('should format the cell grey when value is not a number', () => {
        renderComponentWithAdjustedRowData({
          rowData: { g_and_m_percent_adult_height_att: null },
        });

        const adultHeight = screen.getByText('N/A');
        expect(adultHeight).toHaveStyle(emptyCellColours);
      });
    });

    describe('Height velocity', () => {
      it('should format the cell red when > 8', () => {
        renderComponentWithAdjustedRowData({
          rowData: { g_and_m_height_velocity: 14 },
        });

        const heightVelocity = screen.getByText('14.00');
        expect(heightVelocity).toHaveStyle({
          backgroundColor: colors.red_200,
          color: colors.white,
        });
      });

      it('should format the cell grey when null', () => {
        renderComponentWithAdjustedRowData({
          rowData: { g_and_m_height_velocity: null },
        });

        const heightVelocity = screen.getAllByText('-')[3];
        expect(heightVelocity).toHaveStyle(emptyCellColours);
      });
    });

    describe('Weight velocity', () => {
      it('should format the cell red when > 8', () => {
        renderComponentWithAdjustedRowData({
          rowData: { g_and_m_weight_velocity: 14 },
        });

        const weightVelocity = screen.getByText('14.00');
        expect(weightVelocity).toHaveStyle({
          backgroundColor: colors.red_200,
          color: colors.white,
        });
      });

      it('should format the cell grey when null', () => {
        renderComponentWithAdjustedRowData({
          rowData: { g_and_m_weight_velocity: null },
        });

        const weightVelocity = screen.getAllByText('-')[3];
        expect(weightVelocity).toHaveStyle(emptyCellColours);
      });
    });
  });
});
