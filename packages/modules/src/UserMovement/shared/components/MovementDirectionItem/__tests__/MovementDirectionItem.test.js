import { screen, render } from '@testing-library/react';

import { response as MOCK_ORGS } from '../../../redux/services/mocks/data/mock_search_movement_organisation_list';

import MovementDirectionItem from '..';

const props = {
  label: 'Label text',
  organisation: MOCK_ORGS[0],
};

describe('<MovementDirectionItem/>', () => {
  it('renders the organisation', () => {
    render(<MovementDirectionItem {...props} />);
    expect(screen.getByText(/Label text/i)).toBeInTheDocument();
    expect(screen.getByText(/Manchester United/i)).toBeInTheDocument();
  });
  it('renders the unassigned organisation', () => {
    const localProps = {
      ...props,
      organisation: {
        ...props.organisation,
        unassigned_org_name: 'Unassigned',
      },
    };
    render(<MovementDirectionItem {...localProps} />);
    expect(screen.getByText(/Unassigned/i)).toBeInTheDocument();
  });
  it('renders the organisation name if unassigned_org_name is not provided', () => {
    const localProps = {
      ...props,
      organisation: { ...props.organisation, unassigned_org_name: undefined },
    };
    render(<MovementDirectionItem {...localProps} />);
    expect(screen.getByText(/Manchester United/i)).toBeInTheDocument();
  });
});
