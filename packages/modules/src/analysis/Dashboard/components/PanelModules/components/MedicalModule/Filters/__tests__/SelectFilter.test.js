import i18n from 'i18next';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SelectFilter from '../SelectFilter';

const defaultOptions = [
  {
    label: 'Medical Filter',
    value: 2,
  },
  {
    label: 'Another Medical Filter',
    value: 1,
  },
  {
    label: 'Third Filter',
    value: 3,
  },
];

const extraOptions = [
  {
    label: 'Fourth Filter',
    value: 4,
  },
  {
    label: 'Fifth Filter',
    value: 5,
  },
  {
    label: 'Sixth Filter',
    value: 6,
  },
];

describe('<SelectFilter />', () => {
  const i18nT = i18nextTranslateStub(i18n);
  const props = {
    t: i18nT,
    untranslatedLabel: 'Title',
    options: [],
    value: [],
    onChange: jest.fn(),
    onClickRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<SelectFilter {...props} />);

    expect(screen.getByText('Title')).toBeInTheDocument();
  });

  it('renders the checkbox list when options are short', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    const testProps = {
      ...props,
      value: [1, 2, 3],
      onChange,
      options: defaultOptions,
    };

    render(<SelectFilter {...testProps} />);

    expect(screen.getByText('Medical Filter')).toBeInTheDocument();
    expect(screen.getByText('Another Medical Filter')).toBeInTheDocument();
    expect(screen.getByText('Third Filter')).toBeInTheDocument();

    const medicalFilterCheckbox = screen.getByRole('checkbox', {
      name: 'Medical Filter',
    });
    await user.click(medicalFilterCheckbox);

    expect(onChange).toHaveBeenCalled();
  });

  it('renders the select filter when options are long', () => {
    const onChange = jest.fn();
    const testProps = {
      ...props,
      value: [1, 2, 3],
      onChange,
      options: [...defaultOptions, ...extraOptions],
    };

    render(<SelectFilter {...testProps} />);

    expect(
      screen.getByText('Medical Filter, Another Medical Filter, Third Filter')
    ).toBeInTheDocument();
  });

  it('renders the select filter when grouped options are long', () => {
    const onChange = jest.fn();
    const testProps = {
      ...props,
      value: [1, 2, 3],
      onChange,
      options: [
        {
          label: 'Group',
          options: defaultOptions,
        },
        {
          label: 'Group 2',
          options: extraOptions,
        },
      ],
    };

    render(<SelectFilter {...testProps} />);

    expect(
      screen.getByText('Medical Filter, Another Medical Filter, Third Filter')
    ).toBeInTheDocument();
  });

  it('renders the Select option with isLoading prop if component is loading', () => {
    const testProps = {
      ...props,
      value: [1, 2, 3],
      isLoading: true,
    };

    render(<SelectFilter {...testProps} />);

    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(
      document.querySelector('.kitmanReactSelect__loading-indicator')
    ).toBeInTheDocument();
  });
});
