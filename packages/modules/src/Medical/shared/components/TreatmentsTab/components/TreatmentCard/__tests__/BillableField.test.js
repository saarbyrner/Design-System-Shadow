import { render, screen } from '@testing-library/react';

import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import BillableField from '../BillableField';

setI18n(i18n);

describe('<BillableField />', () => {
  const t = i18nextTranslateStub(i18n);
  const baseProps = {
    isEditing: false,
    billable: false,
    isDisabled: false,
    onUpdateBillable: jest.fn(),
    t,
  };

  test('renders the correct content', () => {
    render(<BillableField {...baseProps} />);
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  describe('when isEditing', () => {
    test('renders a select with the initial value', () => {
      render(<BillableField {...baseProps} isEditing />);
      // The select shows the current value's label
      expect(screen.getByText('No')).toBeInTheDocument();
    });
  });
});
