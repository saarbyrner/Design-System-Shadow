import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';
import moment from 'moment';

import StartDate from '../StartDate';

const i18nT = i18nextTranslateStub();

const props = {
  value: moment('2023-12-06T10:31:47+00:00'),
  mode: 'VIEW',
  t: i18nT,
};

describe('<StartDate/> VIEW mode', () => {
  it('renders the <StartDate/>', () => {
    render(
      <LocalizationProvider>
        <StartDate {...props} />
      </LocalizationProvider>
    );

    expect(screen.getByText('Sharing start date')).toBeInTheDocument();
    expect(screen.getByText('Dec 6, 2023')).toBeInTheDocument();
  });
});

describe('<StartDate/> EDIT mode', () => {
  it('renders the <StartDate/>', () => {
    render(
      <LocalizationProvider>
        <StartDate {...props} mode="EDIT" />
      </LocalizationProvider>
    );

    expect(screen.getAllByText('Sharing start date').at(0)).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Choose date, selected date is Dec 6, 2023',
      })
    ).toBeInTheDocument();
  });
});
