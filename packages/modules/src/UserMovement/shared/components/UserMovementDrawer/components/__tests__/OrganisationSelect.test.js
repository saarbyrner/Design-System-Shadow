import { render, screen, fireEvent } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';

import { response as data } from '../../../../redux/services/mocks/data/mock_search_movement_organisation_list';

import OrganisationSelect from '../OrganisationSelect';

const i18nT = i18nextTranslateStub();

const props = {
  type: 'medical_trial',
  options: data,
  value: 115,
  selectedOrganisaiton: {},
  currentOrganisation: {},
  mode: 'VIEW',
  onUpdate: jest.fn(),
  t: i18nT,
};

describe('<OrganisationSelect/> VIEW mode', () => {
  it('renders the <OrganisationSelect/>', () => {
    render(<OrganisationSelect {...props} />);
    expect(screen.getByText(/Medical trial with/i)).toBeInTheDocument();
    expect(screen.getByTestId('ArrowForwardIosIcon')).toBeInTheDocument();
  });
  it('renders the <OrganisationSelect/> and relevant organisations', () => {
    render(
      <OrganisationSelect
        {...props}
        currentOrganisation={{ name: 'Real Madrid' }}
        selectedOrganisaiton={{ name: 'Treaty United' }}
      />
    );
    expect(screen.getByText(/Medical trial with/i)).toBeInTheDocument();

    expect(screen.getByText(/Real Madrid/i)).toBeInTheDocument();
  });
});

describe('<OrganisationSelect/> EDIT mode', () => {
  it('renders the <OrganisationSelect/>', () => {
    render(
      <OrganisationSelect
        {...props}
        mode="EDIT"
        selectedOrganisation={{
          id: 115,
          logo_full_path:
            'https://ssl.gstatic.com/onebox/media/sports/logos/udQ6ns69PctCv143h-GeYw_48x48.png',
          name: 'Manchester United',
        }}
      />
    );

    expect(
      screen.getAllByText(/Medical trial with/i).at(0)
    ).toBeInTheDocument();

    expect(screen.getByRole('combobox')).toHaveValue('Manchester United');
    expect(
      screen.getByRole('button', {
        id: 'movement-type-select',
      })
    ).toBeInTheDocument();
  });
});

describe('<OrganisationSelect/> selecting an option', () => {
  it('selects the correct option', () => {
    render(<OrganisationSelect {...props} value={null} mode="EDIT" />);

    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    expect(
      screen.getByRole('img', { name: 'Manchester United' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Real Madrid' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: 'Inter Miami' })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('img', { name: 'Inter Miami' }));

    expect(props.onUpdate).toHaveBeenCalledTimes(1);
    expect(props.onUpdate).toHaveBeenCalledWith([117]);
  });
});

describe('<OrganisationSelect/> clear selected option', () => {
  it('clears the selected option', () => {
    render(<OrganisationSelect {...props} mode="EDIT" />);

    expect(screen.getByRole('combobox')).toHaveValue('Manchester United');
    fireEvent.click(screen.getByLabelText('Clear'));
    expect(screen.getByRole('combobox')).not.toHaveValue('Manchester United');
  });
});
