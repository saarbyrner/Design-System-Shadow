// flow
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { useFetchShortRulesetsQuery } from '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields';
import RulesetsSelect from '../RulesetsSelect';

jest.mock(
  '@kitman/modules/src/ConditionalFields/shared/services/conditionalFields'
);

const renderComponent = (props = {}) => {
  const defaultProps = {
    t: i18nextTranslateStub(),
    onChange: jest.fn(),
    selectedRulesets: [],
    isDisabled: false,
  };

  return render(<RulesetsSelect {...defaultProps} {...props} />);
};

describe('RulesetsSelect', () => {
  it('renders options when hook returns an array', async () => {
    useFetchShortRulesetsQuery.mockReturnValue({
      data: [
        { id: 1, name: 'Ruleset 1' },
        { id: 2, name: 'Ruleset 2' },
      ],
      isFetching: false,
      isError: false,
    });

    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByLabelText('Rulesets');
    await user.click(input);

    expect(await screen.findByText('Ruleset 1')).toBeInTheDocument();
    expect(screen.getByText('Ruleset 2')).toBeInTheDocument();
  });

  it('renders options when hook returns an object-wrapped array', async () => {
    useFetchShortRulesetsQuery.mockReturnValue({
      data: {
        data: [
          { id: 3, name: 'Ruleset 3' },
          { id: 4, name: 'Ruleset 4' },
        ],
      },
      isFetching: false,
      isError: false,
    });

    const user = userEvent.setup();
    renderComponent();

    const input = screen.getByLabelText('Rulesets');
    await user.click(input);

    expect(await screen.findByText('Ruleset 3')).toBeInTheDocument();
    expect(screen.getByText('Ruleset 4')).toBeInTheDocument();
  });

  it('should call onChange when an option is selected', async () => {
    useFetchShortRulesetsQuery.mockReturnValue({
      data: [
        { id: 5, name: 'Ruleset 5' },
        { id: 6, name: 'Ruleset 6' },
      ],
      isFetching: false,
      isError: false,
    });

    const user = userEvent.setup();
    const onChange = jest.fn();
    renderComponent({ onChange });

    const input = screen.getByLabelText('Rulesets');
    await user.click(input);
    await user.click(screen.getByText('Ruleset 6'));

    expect(onChange).toHaveBeenCalled();
  });
});
