import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SeverityLabel from '..';

describe('<SeverityLabel/>', () => {
  const props = {
    label: 'Ibuprofen Allergy',
    severity: 'severe',
    t: i18nextTranslateStub(),
  };

  it('renders the label with correct allergy title', async () => {
    render(<SeverityLabel {...props} />);
    expect(screen.getByTestId('SeverityLabel|Title')).toHaveTextContent(
      'Ibuprofen Allergy'
    );
  });
});
