import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import FormsList from '../index';

// Mock ReactDataGrid component
jest.mock('@kitman/components/src/ReactDataGrid', () => {
  const ReactDataGrid = ({ tableHeaderData, tableBodyData }) => (
    <div data-testid="react-data-grid">
      <div data-testid="table-header-data">
        {JSON.stringify(tableHeaderData)}
      </div>
      <div data-testid="table-body-data">{JSON.stringify(tableBodyData)}</div>
    </div>
  );
  return ReactDataGrid;
});

describe('<FormsList />', () => {
  const props = {
    isLoading: false,
    showAthleteInformation: false,
    forms: [
      {
        completionDate: '2022-07-12T00:00:00Z',
        editorFullName: 'John Smith',
        formType: 'Concussion incident',
        id: 75,
        athlete: {
          id: 1,
          firstname: 'Test',
          lastname: 'Athlete',
          fullname: 'Test Athlete',
          avatar_url: 'https://example.com/avatar1.jpg',
          availability: 'available',
        },
      },
      {
        completionDate: '2022-07-15T00:00:00Z',
        editorFullName: 'John Smith',
        formType: 'Concussion incident',
        id: 76,
        athlete: {
          id: 2,
          firstname: 'Another',
          lastname: 'Athlete',
          fullname: 'Another Athlete',
          avatar_url: 'https://example.com/avatar2.jpg',
          availability: 'injured',
        },
      },
    ],
    t: i18nextTranslateStub(),
  };

  it('renders the FormsList component', () => {
    render(<FormsList {...props} />);
    expect(screen.getByTestId('react-data-grid')).toBeInTheDocument();
  });

  it('renders data grid', () => {
    render(<FormsList {...props} />);
    expect(screen.getByTestId('react-data-grid')).toBeInTheDocument();
  });

  it('renders the correct columns', () => {
    render(<FormsList {...props} />);
    const headerData = JSON.parse(
      screen.getByTestId('table-header-data').textContent
    );
    expect(headerData.length).toBe(4);
  });

  it('renders the correct columns if athlete id is provided', () => {
    const athleteLevelProps = {
      ...props,
      athleteId: 154,
    };
    render(<FormsList {...athleteLevelProps} />);
    const headerData = JSON.parse(
      screen.getByTestId('table-header-data').textContent
    );
    expect(headerData.length).toBe(3);
  });

  it('renders the correct rows', () => {
    render(<FormsList {...props} />);
    const bodyData = JSON.parse(
      screen.getByTestId('table-body-data').textContent
    );
    expect(bodyData.length).toBe(2);
  });
});
