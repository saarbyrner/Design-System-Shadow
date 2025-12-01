// @jest-environment jsdom

import { render, screen } from '@testing-library/react';
import { AthletesListNewTranslated } from '../AthletesList';

// ---- mocks ----

jest.mock('react-i18next', () => ({
  withNamespaces: () => (Cmp) => Cmp,
}));

let lastRows = [];
jest.mock('@kitman/playbook/components/wrappers/DataGrid', () => {
  return ({ rows = [] }) => {
    lastRows = rows;
    return <div data-testid="data-grid">rows: {rows.length}</div>;
  };
});

jest.mock('@kitman/playbook/components', () => {
  // eslint-disable-next-line global-require
  const React = require('react');

  const Div = React.forwardRef(({ children, ...rest }, ref) => (
    <div ref={ref} {...rest}>
      {children}
    </div>
  ));
  // eslint-disable-next-line jsx-a11y/heading-has-content
  const H5 = (props) => <h5 {...props} />;

  return {
    Avatar: Div,
    Box: Div,
    Button: (props) => <button type="button" {...props} />,
    Checkbox: ({ checked }) => (
      <input type="checkbox" readOnly checked={!!checked} />
    ),
    FormControl: Div,
    InputLabel: (props) => <label {...props} />,
    MenuItem: ({ children, ...rest }) => <div {...rest}>{children}</div>,
    Select: ({ children, ...rest }) => (
      <div data-testid="select" {...rest}>
        {children}
      </div>
    ),

    TextField: ({ label, value = '', onChange = () => {} }) => (
      <input aria-label={label} value={value} onChange={onChange} />
    ),
    Typography: H5,
  };
});

jest.mock('@mui/material/Stack', () => (props) => <div {...props} />);
jest.mock('@mui/material/ListItemText', () => (props) => <span {...props} />);
jest.mock('@mui/material', () => ({
  InputAdornment: (props) => <span {...props} />,
}));
jest.mock('@mui/icons-material/Search', () => (props) => <span {...props} />);

// ---- fixtures ----

const t = (k) => k;

const athletes = [
  {
    id: 1,
    fullname: 'Tima Antoniuk',
    position: 'FW',
    availability: 'available',
    avatar_url: '',
  },
  {
    id: 2,
    fullname: 'John Doe',
    position: 'MF',
    availability: 'injured',
    avatar_url: '',
  },
];

// ---- tests ----

describe('AthletesListNew (smoke)', () => {
  it('renders title and passes rows to DataGrid', () => {
    render(<AthletesListNewTranslated athletes={athletes} t={t} />);

    expect(screen.getByText('Athletes List')).toBeInTheDocument();

    expect(screen.getByTestId('data-grid')).toHaveTextContent('rows: 2');

    expect(Array.isArray(lastRows)).toBe(true);
    expect(lastRows).toHaveLength(2);

    const names = lastRows.map((r) => r.fullname).sort();
    expect(names).toEqual(['John Doe', 'Tima Antoniuk']);
  });
});
