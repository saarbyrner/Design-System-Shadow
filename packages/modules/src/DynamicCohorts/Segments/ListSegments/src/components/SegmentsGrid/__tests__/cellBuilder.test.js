import { render, screen } from '@testing-library/react';
import { segmentResponse as segment } from '@kitman/services/src/mocks/handlers/dynamicCohorts/Segments/createSegment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import { buildCellContent, ROW_KEY } from '../cellBuilder';

describe('buildCellContent', () => {
  it('returns the correct cell content for name key', () => {
    render(buildCellContent({ row_key: ROW_KEY.name, segment }));
    expect(screen.getByText(segment.name)).toBeInTheDocument();
  });
  it('returns the correct cell content for created by key', () => {
    render(buildCellContent({ row_key: ROW_KEY.createdBy, segment }));
    expect(screen.getByText(segment.created_by.fullname)).toBeInTheDocument();
  });
  it('returns the correct cell content for created on key', () => {
    render(buildCellContent({ row_key: ROW_KEY.createdOn, segment }));
    const expectedDate = formatStandard({
      date: moment(segment.created_on),
    });
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});
