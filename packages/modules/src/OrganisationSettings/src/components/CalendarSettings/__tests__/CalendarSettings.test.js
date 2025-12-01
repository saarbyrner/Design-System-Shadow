import { screen, render } from '@testing-library/react';
import { UPLOAD_CATEGORIES_TITLE } from '@kitman/modules/src/OrganisationSettings/src/components/CalendarSettings/EventAttachmentCategories/utils/consts';
import CalendarSettings from '../index';

describe('<CalendarSettings />', () => {
  it('hides the event attachment category table when the FF is true', () => {
    window.featureFlags['hide-attachement-categories-settings-ip'] = true;
    expect(screen.queryByText(UPLOAD_CATEGORIES_TITLE)).not.toBeInTheDocument();
    window.featureFlags['hide-attachement-categories-settings-ip'] = false;
  });

  it('shows the event attachment category table when the FF is false', () => {
    render(<CalendarSettings />);
    expect(screen.getByText(UPLOAD_CATEGORIES_TITLE)).toBeInTheDocument();
  });
});
