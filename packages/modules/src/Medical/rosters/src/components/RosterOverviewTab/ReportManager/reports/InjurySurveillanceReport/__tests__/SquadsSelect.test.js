// flow
import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import userEvent from '@testing-library/user-event';
import { useGetPermittedSquadsQuery } from '@kitman/modules/src/Medical/shared/redux/services/medical';
import SquadsSelect from '../SquadsSelect';

jest.mock('@kitman/modules/src/Medical/shared/redux/services/medical');

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
  onChange: jest.fn(),
  selectedSquads: [],
};

describe('SquadsSelect', () => {
  beforeEach(() => {
    useGetPermittedSquadsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'First Squad' },
        { id: 2, name: 'Second Squad' },
      ],
      isLoading: false,
      isSuccess: true,
    });
  });

  it('should render correctly', () => {
    render(<SquadsSelect {...props} />);
    expect(screen.getByLabelText('Squads')).toBeInTheDocument();
  });

  it('should call onChange', async () => {
    const user = userEvent.setup();
    render(<SquadsSelect {...props} />);

    const label = screen.getByLabelText('Squads');
    await user.click(label);
    await user.click(screen.getByText('First Squad'));
    expect(props.onChange).toHaveBeenCalled();
  });
  it('should display chosen squad', () => {
    render(
      <SquadsSelect
        {...props}
        selectedSquads={[{ id: 2, label: 'First Squad' }]}
      />
    );
    expect(screen.getByText('First Squad')).toBeInTheDocument();
  });
});
