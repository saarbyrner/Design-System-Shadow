import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import selectEvent from 'react-select-event';
import FormFilters from '../index';

setI18n(i18n);

describe('<FormFilters />', () => {
  const defaultProps = {
    selectedFormTypeId: undefined,
    formTypes: [
      {
        value: 1,
        label: 'Concussion incident',
      },
      {
        value: 2,
        label: 'Concussion RTP',
      },
    ],
    onChangeSelectedFormTypeId: jest.fn(),
    t: i18nextTranslateStub(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders a form filter dropdown', () => {
    render(<FormFilters {...defaultProps} />);
    const formTypeSelect = screen.getByText('Form Type');
    selectEvent.openMenu(formTypeSelect);
    expect(screen.getByText('Concussion incident')).toBeInTheDocument();
    expect(screen.getByText('Concussion RTP')).toBeInTheDocument();
  });

  it('calls the correct function when selecting a form', async () => {
    const user = userEvent.setup();
    render(<FormFilters {...defaultProps} />);
    const formTypeSelect = screen.getByText('Form Type');
    selectEvent.openMenu(formTypeSelect);
    expect(screen.getByText('Concussion incident')).toBeInTheDocument();
    await user.click(screen.getByText('Concussion incident'));

    expect(defaultProps.onChangeSelectedFormTypeId).toHaveBeenCalledTimes(1);
    expect(defaultProps.onChangeSelectedFormTypeId).toHaveBeenCalledWith(1);
  });
});
