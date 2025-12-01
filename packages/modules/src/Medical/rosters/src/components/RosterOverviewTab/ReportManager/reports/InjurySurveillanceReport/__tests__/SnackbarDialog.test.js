import { screen, render } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SnackbarDialog from '../SnackbarDialog';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  openSnackbar: true,
  onSnackbarClose: jest.fn(),
  isSuccess: false,
};

describe('SnackbarDialog', () => {
  it('renders correctly when isSuccess is false', () => {
    render(<SnackbarDialog {...props} />);
    expect(screen.getByText('Export failed')).toBeInTheDocument();
  });

  it('renders correctly when isSuccess is true', () => {
    props.isSuccess = true;
    render(<SnackbarDialog {...props} />);
    expect(screen.getByText('Export successful')).toBeInTheDocument();
  });
});
