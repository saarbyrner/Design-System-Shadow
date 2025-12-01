import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import ExportFileName from '..';

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  value: 'test name',
  onUpdate: jest.fn(),
};

describe('<ExportFileName/>', () => {
  it('renders with value', async () => {
    render(<ExportFileName {...props} />);

    expect(screen.getByLabelText('File name')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('test name');
  });
});
