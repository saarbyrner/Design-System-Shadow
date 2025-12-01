import { screen } from '@testing-library/react';
import { KITMAN_ICON_NAMES } from '@kitman/playbook/icons';
import { render } from '../../../../TemplateDashboards/testUtils';
import AnimatedCalculateLoader from '../AnimatedCalculateLoader';

const props = {
  iconList: [
    KITMAN_ICON_NAMES.RemoveIcon,
    KITMAN_ICON_NAMES.ArrowBack,
    KITMAN_ICON_NAMES.MailLockIcon,
    KITMAN_ICON_NAMES.CheckCircle,
  ],
};

describe('TemplateDashboards|AnimatedCalculateLoader', () => {
  it('renders the loader', () => {
    render(<AnimatedCalculateLoader />);
    expect(screen.getByTestId('AnimatedCalculateLoader')).toBeInTheDocument();
  });

  it('accepts custom icons', async () => {
    render(<AnimatedCalculateLoader {...props} />);
    const removeIcon = await screen.findByTestId('RemoveIcon');
    const arrowBackIcon = await screen.findByTestId('ArrowBackIcon');
    const mailLockIcon = await screen.findByTestId('MailLockIcon');
    const checkCircleIcon = await screen.findByTestId('CheckCircleIcon');

    expect(removeIcon).toBeInTheDocument();
    expect(arrowBackIcon).toBeInTheDocument();
    expect(mailLockIcon).toBeInTheDocument();
    expect(checkCircleIcon).toBeInTheDocument();
  });
});
