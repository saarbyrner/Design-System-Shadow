import { render } from '@testing-library/react';

import DataTable from '@kitman/modules/src/Medical/shared/components/DataTable';
import {
  data,
  reactTableColumns,
} from '@kitman/modules/src/Medical/issues/src/components/AssessmentTab/ResultsTableDummyData';

describe('<DataTable />', () => {
  const props = {
    columns: reactTableColumns,
    data,
  };

  test('renders', () => {
    render(<DataTable {...props} />);
    // Header cells are rendered
    expect(document.querySelectorAll('.dataTable__th').length).toBe(11);
  });

  test('renders the correct rows', () => {
    render(<DataTable {...props} />);
    expect(document.querySelectorAll('.dataTable__tr').length).toBe(5);
  });
});
