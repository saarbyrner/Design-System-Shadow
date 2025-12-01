import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import Breadcrumb from '..';

describe('<Breadcrumb />', () => {
  const props = {
    isEditingDashboard: false,
    t: i18nextTranslateStub(),
  };

  it('renders the component', () => {
    render(<Breadcrumb {...props} />);
    expect(screen.getByLabelText('Breadcrumb')).toBeInTheDocument();
  });

  it('when the user is editing a dashboard it renders dashboard name >> New Graph', () => {
    render(
      <Breadcrumb
        {...props}
        isEditingDashboard
        currentDashboard={{ id: 2, name: 'Dahboard Name' }}
      />
    );

    expect(
      screen
        .getByLabelText('Breadcrumb')
        .querySelectorAll('li.breadCrumb__item')[0]
    ).toHaveTextContent('Dahboard Name');

    expect(
      screen
        .getByLabelText('Breadcrumb')
        .querySelectorAll('li.breadCrumb__item')[0]
        .querySelector('a')
    ).toHaveAttribute('href', '/analysis/dashboard/2');

    expect(
      screen
        .getByLabelText('Breadcrumb')
        .querySelectorAll('li.breadCrumb__item')[1]
    ).toHaveTextContent('New Graph');
  });

  it('when the user is not editing a dashboard it renders enders New Graph', () => {
    render(<Breadcrumb {...props} />);

    expect(
      screen
        .getByLabelText('Breadcrumb')
        .querySelectorAll('li.breadCrumb__item')
    ).toHaveLength(1);

    expect(
      screen.getByLabelText('Breadcrumb').querySelector('li.breadCrumb__item')
    ).toHaveTextContent('New Graph');
  });

  it('when the user is editing a graph it renders Edit Graph', () => {
    render(<Breadcrumb {...props} isEditingGraph />);

    expect(
      screen
        .getByLabelText('Breadcrumb')
        .querySelectorAll('li.breadCrumb__item')
    ).toHaveLength(1);

    expect(
      screen.getByLabelText('Breadcrumb').querySelector('li.breadCrumb__item')
    ).toHaveTextContent('Edit Graph');
  });

  it('when the user is not editing a graph it renders New Graph', () => {
    render(<Breadcrumb {...props} />);

    expect(
      screen
        .getByLabelText('Breadcrumb')
        .querySelectorAll('li.breadCrumb__item')
    ).toHaveLength(1);

    expect(
      screen.getByLabelText('Breadcrumb').querySelector('li.breadCrumb__item')
    ).toHaveTextContent('New Graph');
  });
});
