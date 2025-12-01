import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import SplitOptions from '@kitman/components/src/DocumentSplitter/src/sections/SplitOptions';
import {
  SPLIT_OPTIONS_DATA_KEY,
  SPLIT_DOCUMENT_MODES,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';

const mockHandleChange = jest.fn();
const mockData = {
  [SPLIT_OPTIONS_DATA_KEY.splitDocument]: SPLIT_DOCUMENT_MODES.everyX,
  [SPLIT_OPTIONS_DATA_KEY.numberOfSections]: 4,
  [SPLIT_OPTIONS_DATA_KEY.splitEvery]: 3,
  [SPLIT_OPTIONS_DATA_KEY.splitFrom]: 2,
};

const defaultProps = {
  data: mockData,
  validation: { hasErrors: false },
  handleChange: mockHandleChange,
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  render(<SplitOptions {...props} />);

describe('Split Options section', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders all data values correctly', () => {
    renderComponent();
    expect(
      screen.queryByText('Invalid document split')
    ).not.toBeInTheDocument();

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();

    const intoSectionsRadio = screen.getByRole('radio', {
      name: 'into sections',
    });
    expect(intoSectionsRadio).not.toBeChecked();

    const everyXRadio = screen.getByRole('radio', {
      name: "every 'x' pages",
    });
    expect(everyXRadio).toBeChecked();

    expect(
      screen.queryByLabelText('Number of Sections')
    ).not.toBeInTheDocument();

    const pages = screen.getByLabelText('Pages');
    expect(pages).toHaveValue('3');
    expect(pages).toBeValid();

    const page = screen.getByLabelText('Page');
    expect(page).toHaveValue('2');
    expect(page).toBeValid();
  });

  it('renders UI depending on mode: SPLIT_DOCUMENT_MODES.intoSections', () => {
    renderComponent({
      ...defaultProps,
      data: {
        ...defaultProps.data,
        [SPLIT_OPTIONS_DATA_KEY.splitDocument]:
          SPLIT_DOCUMENT_MODES.intoSections,
      },
    });
    expect(
      screen.queryByText('Invalid document split')
    ).not.toBeInTheDocument();

    const sections = screen.getByLabelText('Number of Sections');
    expect(sections).toHaveValue('4');
    expect(sections).toBeValid();

    const page = screen.getByLabelText('Page');
    expect(page).toHaveValue('2');
    expect(page).toBeValid();

    expect(screen.queryByLabelText('Pages')).not.toBeInTheDocument();
  });

  it('calls handleChange when mode radios toggled', async () => {
    const user = userEvent.setup();
    renderComponent({
      ...defaultProps,
      data: {
        ...defaultProps.data,
        [SPLIT_OPTIONS_DATA_KEY.splitDocument]: SPLIT_DOCUMENT_MODES.everyX,
      },
    });
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();

    const intoSectionsRadio = screen.getByRole('radio', {
      name: 'into sections',
    });
    expect(intoSectionsRadio).not.toBeChecked();

    await user.click(intoSectionsRadio);
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      [SPLIT_OPTIONS_DATA_KEY.splitDocument]: SPLIT_DOCUMENT_MODES.intoSections,
    });
  });

  it('calls handleChange with a number string value', async () => {
    const user = userEvent.setup();

    renderComponent({
      ...defaultProps,
      data: {
        ...defaultProps.data,
        [SPLIT_OPTIONS_DATA_KEY.splitDocument]:
          SPLIT_DOCUMENT_MODES.intoSections,
        [SPLIT_OPTIONS_DATA_KEY.numberOfSections]: null,
      },
    });

    const numberOfSections = screen.getByLabelText('Number of Sections');
    const numberTextInput = 'abc-9def'; // letters and minus won't register

    await user.type(numberOfSections, numberTextInput);
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith({
      [SPLIT_OPTIONS_DATA_KEY.numberOfSections]: 9,
    });
  });

  it('renders page TextField as invalid if validation failed', async () => {
    renderComponent({
      ...defaultProps,
      data: {
        ...defaultProps.data,
        [SPLIT_OPTIONS_DATA_KEY.splitDocument]:
          SPLIT_DOCUMENT_MODES.intoSections,
      },
      validation: {
        hasErrors: true,
        errors: {
          [SPLIT_OPTIONS_DATA_KEY.splitFrom]: [
            'Something wrong with split from page input',
          ],
        },
      },
    });

    expect(screen.getByText('Invalid document split')).toBeInTheDocument();
    expect(screen.getByLabelText('Page')).not.toBeValid();
    expect(screen.getByLabelText('Number of Sections')).toBeValid();
  });
});
