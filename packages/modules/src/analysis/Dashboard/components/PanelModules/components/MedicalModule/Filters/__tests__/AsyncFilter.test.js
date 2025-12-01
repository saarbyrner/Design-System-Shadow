import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import { searchCoding } from '@kitman/services';
import {
  AsyncSelectFilter,
  IllnessCode,
  IllnessPathology,
  InjuryCode,
  InjuryPathology,
} from '../AsyncFilters';

jest.mock('@kitman/modules/src/analysis/Dashboard/redux/services/medical');
jest.mock('@kitman/services');

jest.mock('../FilterDefinitions', () => ({
  defaultDataProcessor: jest.fn(),
  withSelectFilter: jest
    .fn()
    .mockImplementation(() => () => <div data-testid="withSelectFilter" />),
}));

jest.mock(
  '@kitman/modules/src/Medical/shared/redux/services/medicalShared',
  () => ({
    useGetPathologiesByIdsQuery: jest.fn().mockReturnValue({
      data: [],
    }),
  })
);

describe('<AsyncSelectFilter>', () => {
  const defaultProps = {
    label: 'Pathology',
    value: undefined,
    placeholder: 'Search body part, body area, injury type...',
    onChange: jest.fn(),
    onClickRemove: jest.fn(),
    coding: codingSystemKeys.ICD,
    queryArgs: [codingSystemKeys.ICD],
  };

  it('renders with correct initial state', () => {
    render(<AsyncSelectFilter {...defaultProps} />);

    expect(screen.getByText('Pathology')).toBeVisible();
    expect(screen.getByText(defaultProps.placeholder)).toBeVisible();
    expect(screen.getByRole('button')).toBeVisible();
    expect(screen.getByRole('textbox', defaultProps.placeholder)).toBeVisible();
  });

  it('loads options asynchronously', async () => {
    const mockOptions = [
      {
        value: {
          icd_id: 1,
        },
        label: 'Option 1',
      },
    ];

    searchCoding.mockResolvedValueOnce({
      results: mockOptions,
    });

    render(<AsyncSelectFilter {...defaultProps} />);

    const searchInput = screen.getByRole('textbox', defaultProps.placeholder);
    fireEvent.change(searchInput, { target: { value: 'Custom option' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('Custom option');
    });

    await waitFor(() => {
      expect(searchCoding).toHaveBeenCalledWith({
        filter: 'Custom option',
        codingSystem: defaultProps.coding,
      });
    });

    const mockReturnValue = await searchCoding.mock.results[0].value;
    expect(mockReturnValue).toEqual({ results: mockOptions });
  });

  it('does not pass injuryType prop to searchCoding when not provided', async () => {
    const mockOptions = [
      {
        value: {
          icd_id: 1,
        },
        label: 'Option 1',
      },
    ];

    searchCoding.mockResolvedValueOnce({
      results: mockOptions,
    });

    render(<AsyncSelectFilter {...defaultProps} />);

    const searchInput = screen.getByRole('textbox', defaultProps.placeholder);
    fireEvent.change(searchInput, { target: { value: 'Custom option' } });

    await waitFor(() => {
      expect(searchCoding).toHaveBeenCalledWith({
        filter: 'Custom option',
        codingSystem: defaultProps.coding,
      });
    });
  });
});

describe('OSICS_10 system', () => {
  const defaultProps = {
    label: 'Pathology',
    value: undefined,
    placeholder: 'Search body part, body area, injury type...',
    onChange: jest.fn(),
    onClickRemove: jest.fn(),
  };

  it('renders InjuryOsicsPathology when coding is OSICS_10', () => {
    render(
      <InjuryPathology {...defaultProps} coding={codingSystemKeys.OSICS_10} />
    );

    expect(screen.getByTestId('withSelectFilter')).toBeInTheDocument();
  });

  it('renders InjuryOsicsCode when coding is OSICS_10', () => {
    render(<InjuryCode {...defaultProps} coding={codingSystemKeys.OSICS_10} />);

    expect(screen.getByTestId('withSelectFilter')).toBeInTheDocument();
  });

  it('does not render IllnessOsicsPathology when coding is not OSICS_10', () => {
    render(
      <IllnessPathology {...defaultProps} coding={codingSystemKeys.ICD} />
    );

    expect(screen.queryByTestId('withSelectFilter')).not.toBeInTheDocument();
  });

  it('render AsyncSelectFilter when coding is not OSICS_10', () => {
    render(<IllnessCode {...defaultProps} coding={codingSystemKeys.ICD} />);

    expect(screen.queryByTestId('withSelectFilter')).not.toBeInTheDocument();
    expect(screen.getByText('Pathology')).toBeVisible();
  });
});
