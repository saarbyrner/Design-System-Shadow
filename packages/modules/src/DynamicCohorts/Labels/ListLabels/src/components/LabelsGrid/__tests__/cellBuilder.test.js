import { render, screen } from '@testing-library/react';
import { labelResponse } from '@kitman/services/src/mocks/handlers/OrganisationSettings/DynamicCohorts/Labels/createLabel';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import moment from 'moment-timezone';
import { buildCellContent, ROW_KEY } from '../cellBuilder';

describe('buildCellContent', () => {
  it('returns the correct cell content for name key', () => {
    render(buildCellContent({ row_key: ROW_KEY.name, label: labelResponse }));
    expect(screen.getByText(labelResponse.name)).toBeInTheDocument();
  });
  it('returns the correct cell content for description key', () => {
    render(
      buildCellContent({ row_key: ROW_KEY.description, label: labelResponse })
    );
    expect(screen.getByText(labelResponse.description)).toBeInTheDocument();
  });
  it('returns the correct cell content for created by key', () => {
    render(
      buildCellContent({ row_key: ROW_KEY.createdBy, label: labelResponse })
    );
    expect(
      screen.getByText(labelResponse.created_by.fullname)
    ).toBeInTheDocument();
  });
  it('returns the correct cell content for created on key', () => {
    render(
      buildCellContent({ row_key: ROW_KEY.createdOn, label: labelResponse })
    );
    const expectedDate = formatStandard({
      date: moment(labelResponse.created_on),
    });
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
  });
});
