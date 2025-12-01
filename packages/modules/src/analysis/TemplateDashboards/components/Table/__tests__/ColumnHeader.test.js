import { render, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { colors } from '@kitman/common/src/variables';
import ColumnHeader from '../ColumnHeader/ColumnHeader';

describe('TemplateDashboards|ColumnHeader', () => {
  const props = {
    column: { label: 'Athletes', id: 'athlete_id' },
    sortOrder: 'ASC',
    sortId: 'athlete_id',
    setSortOrder: jest.fn(),
    setSortId: jest.fn(),
    handleSortData: jest.fn(),
    t: i18nextTranslateStub(),
  };

  it('should render the column title', () => {
    const { getByText } = render(<ColumnHeader {...props} />);

    expect(getByText('Athletes')).toBeVisible();
  });

  it('should render the subheading if defined', () => {
    const updatedProps = {
      ...props,
      column: {
        label: 'Status',
        subheading: 'Khamis-Roche',
        id: 'g_and_m_khamis_roche_status',
      },
    };
    const { getByText } = render(<ColumnHeader {...updatedProps} />);

    expect(getByText('Khamis-Roche')).toBeVisible();
  });

  describe('when column is sorted', () => {
    it('should style column with sorted styling', () => {
      const { getByText } = render(<ColumnHeader {...props} />);
      expect(getByText('Athletes')).toHaveStyle({
        color: colors.p01,
      });
    });
  });

  describe('when column is not sorted', () => {
    const updatedProps = {
      ...props,
      column: { label: 'Chrono Age', id: 'chrono_age' },
    };

    it('should not style column with sorted styling', () => {
      const { getByText } = render(<ColumnHeader {...updatedProps} />);

      expect(getByText('Chrono Age')).not.toHaveStyle({
        color: colors.p01,
      });
    });
  });

  describe('when clicking to sort a column', () => {
    const updatedProps = {
      ...props,
      column: { label: 'Chrono Age', id: 'chrono_age' },
    };

    it('should render the sort options', () => {
      const { getByText } = render(<ColumnHeader {...updatedProps} />);

      const bioColumn = getByText('Chrono Age');
      // click column header
      fireEvent.click(bioColumn);

      expect(getByText('Sort by Asc')).toBeVisible();
      expect(getByText('Sort by Desc')).toBeVisible();
    });

    it('should trigger handleSort when clicking a sort option', () => {
      const { getByText } = render(<ColumnHeader {...updatedProps} />);

      const bioColumn = getByText('Chrono Age');
      // click column header
      fireEvent.click(bioColumn);

      const sortOption = getByText('Sort by Asc');

      // click sort option
      fireEvent.click(sortOption);

      expect(props.handleSortData).toHaveBeenCalled();
    });
  });
});
