import moment from 'moment-timezone';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import i18n from '@kitman/common/src/utils/i18n';
import {
  SPLIT_OPTIONS_DATA_KEY,
  SPLIT_DOCUMENT_MODES,
} from '@kitman/components/src/DocumentSplitter/src/shared/consts';
import {
  initialState,
  REDUCER_KEY,
} from '@kitman/components/src/DocumentSplitter/src/shared/redux/slices/splitSetupSlice';
import SplitSetup from '@kitman/components/src/DocumentSplitter/src/components/SplitSetup';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

const defaultProps = {
  players: [
    { id: 1, label: 'Player 1' },
    { id: 2, label: 'Player 2' },
  ],
  documentCategories: [
    { id: 1, label: 'Category 1' },
    { id: 2, label: 'Category 2' },
  ],
  isFetchingPlayers: false,
  isFetchingDocumentCategories: false,
  isBackAvailable: true,
  onNextCallback: jest.fn(),
  onBackCallback: jest.fn(),
  t: i18nextTranslateStub(),
};

const validSliceState = {
  documentDetails: {
    ...initialState.documentDetails,
    fileName: 'Test name',
    documentDate: '2024-04-03T00:00:00+00:00',
    documentCategories: [{ id: 2, label: 'Category 2' }],
    players: [{ id: 1, label: 'Player 1' }],
  },
  splitOptions: {
    ...initialState.splitOptions,
    [SPLIT_OPTIONS_DATA_KEY.splitDocument]: SPLIT_DOCUMENT_MODES.intoSections,
    [SPLIT_OPTIONS_DATA_KEY.numberOfSections]: 5,
    [SPLIT_OPTIONS_DATA_KEY.splitFrom]: 2,
  },
};

const mockDispatch = jest.fn();
const storeFake = (sliceState) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: mockDispatch,
  getState: () => ({
    globalApi: {},
    splitSetupSlice: { ...sliceState },
  }),
});

const renderComponent = (props = defaultProps, sliceState = initialState) =>
  render(
    <I18nextProvider i18n={i18n}>
      <Provider store={storeFake(sliceState)}>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en-gb">
          <SplitSetup {...props} />
        </LocalizationProvider>
      </Provider>
    </I18nextProvider>
  );

describe('SplitSetup', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
  });

  afterEach(() => {
    moment.tz.setDefault();
    mockDispatch.mockClear();
  });

  it('displays both documentDetails and minimal SplitOptions sections with initial state values', () => {
    renderComponent();

    // Document Details

    const fileNameInput = screen.getByLabelText('File name');
    expect(fileNameInput).toHaveValue('');

    const datePicker = screen.getByLabelText('Date of document');
    expect(datePicker).toHaveValue('');

    const playerSelect = screen.getByLabelText('Players');
    expect(playerSelect).toHaveValue('');

    const categorySelect = screen.getByLabelText('Categories');
    expect(categorySelect).toHaveValue('');

    // Split options

    const splitDocumentToggle = screen.getByRole('checkbox', {
      name: 'Split document',
    });
    expect(splitDocumentToggle).not.toBeChecked();

    expect(
      screen.queryByRole('radio', {
        name: 'into sections',
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByLabelText('Number of Sections')
    ).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Page')).not.toBeInTheDocument();
  });

  it('sets mode to intoSections on enabling split document toggle', async () => {
    const user = userEvent.setup();
    renderComponent();

    const splitDocumentToggle = screen.getByRole('checkbox', {
      name: 'Split document',
    });
    expect(splitDocumentToggle).not.toBeChecked();
    await user.click(splitDocumentToggle);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: `${REDUCER_KEY}/updateSplitOptions`,
      payload: {
        splitDocument: SPLIT_DOCUMENT_MODES.intoSections,
      },
    });
  });

  it('displays both documentDetails and SplitOptions sections with state values', () => {
    renderComponent(defaultProps, validSliceState);

    // Document Details

    const fileNameInput = screen.getByLabelText('File name');
    expect(fileNameInput).toHaveValue('Test name');

    const datePicker = screen.getByLabelText('Date of document');
    expect(datePicker).toHaveValue('03/04/2024');

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();

    // Split options

    const splitDocumentToggle = screen.getByRole('checkbox', {
      name: 'Split document',
    });
    expect(splitDocumentToggle).toBeChecked();

    const intoSectionsRadio = screen.getByRole('radio', {
      name: 'into sections',
    });
    expect(intoSectionsRadio).toBeChecked();

    const numberOfSections = screen.getByLabelText('Number of Sections');
    expect(numberOfSections).toHaveValue('5');

    const page = screen.getByLabelText('Page');
    expect(page).toHaveValue('2');
    expect(page).toBeValid();
  });

  it('dispatches updateDetails on editing DocumentDetails', async () => {
    const user = userEvent.setup();
    renderComponent();

    const fileNameInput = screen.getByLabelText('File name');
    const fileNameText = 'x';
    await user.type(fileNameInput, fileNameText);

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        fileName: fileNameText,
      },
      type: `${REDUCER_KEY}/updateDetails`,
    });

    const datePicker = screen.getByLabelText('Date of document');
    fireEvent.change(datePicker, {
      target: { value: '05/04/2024' }, // 5th April
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: {
        documentDate: '2024-04-05T00:00:00+00:00',
      },
      type: `${REDUCER_KEY}/updateDetails`,
    });
  });

  it('dispatches updateSplitOptions on editing SplitOptions', async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps, validSliceState);

    const splitDocumentToggle = screen.getByRole('checkbox', {
      name: 'Split document',
    });
    expect(splitDocumentToggle).toBeChecked();

    const radioEveryXMode = screen.getByRole('radio', {
      name: "every 'x' pages",
    });
    await user.click(radioEveryXMode);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: `${REDUCER_KEY}/updateSplitOptions`,
      payload: {
        splitDocument: SPLIT_DOCUMENT_MODES.everyX,
      },
    });
  });

  it('renders back button when isBackAvailable true', async () => {
    const user = userEvent.setup();
    renderComponent();

    const backButton = screen.getByRole('button', {
      name: 'Back',
    });
    expect(backButton).toBeInTheDocument();
    await user.click(backButton);
  });

  it('does not render back button when isBackAvailable false', () => {
    renderComponent({ ...defaultProps, isBackAvailable: false });

    const backButton = screen.queryByRole('button', {
      name: 'Back',
    });
    expect(backButton).not.toBeInTheDocument();
  });

  it('disables next button when validation fails', async () => {
    const user = userEvent.setup();
    renderComponent();

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    expect(nextButton).toBeInTheDocument();
    await user.click(nextButton);

    expect(nextButton).toBeDisabled();
    expect(defaultProps.onNextCallback).not.toHaveBeenCalled();
  });

  it('calls onNextCallback when validation passes', async () => {
    const user = userEvent.setup();
    renderComponent(defaultProps, validSliceState);

    const nextButton = screen.getByRole('button', {
      name: 'Next',
    });
    await user.click(nextButton);

    expect(defaultProps.onNextCallback).toHaveBeenCalled();
  });
});
