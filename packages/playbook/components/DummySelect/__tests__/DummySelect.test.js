import { screen } from '@testing-library/react';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import DummySelect from '../index';

const MockComponent = () => <div>This is another test</div>;

describe('<DummySelect />', () => {
  const defaultProps = {
    option: {
      value: [65, 100],
      label: 'This is a test',
    },
    children: <MockComponent />,
    t: i18nextTranslateStub(),
  };

  it('should render component with label', () => {
    renderWithUserEventSetup(<DummySelect {...defaultProps} />);
    expect(screen.getByText(defaultProps.option.label)).toBeInTheDocument();
  });

  it('should render children on click', async () => {
    const { user } = renderWithUserEventSetup(
      <DummySelect {...defaultProps} />
    );

    expect(screen.queryByText('This is another test')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button'));
    expect(screen.queryByText('This is another test')).toBeInTheDocument();
  });
});
