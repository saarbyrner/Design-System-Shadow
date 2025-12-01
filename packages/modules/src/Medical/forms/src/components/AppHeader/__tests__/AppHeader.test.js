import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';

import i18n from '@kitman/common/src/utils/i18n';
import {
  renderWithUserEventSetup,
  i18nextTranslateStub,
} from '@kitman/common/src/utils/test_utils';
import PermissionsContext, {
  DEFAULT_CONTEXT_VALUE,
} from '@kitman/common/src/contexts/PermissionsContext';
import { data as mockAthleteData } from '@kitman/services/src/mocks/handlers/getAthleteData';

import AppHeader from '../index';

jest.mock('@kitman/common/src/hooks/useHistoryGo');

setI18n(i18n);

describe('<AppHeader />', () => {
  const defaultPermissions = DEFAULT_CONTEXT_VALUE.permissions.medical;
  const defaultConcussionPermissions =
    DEFAULT_CONTEXT_VALUE.permissions.concussion;

  const props = {
    formInfo: {
      category: 'concussion',
      created_at: '2022-09-12T10:14:51Z',
      enabled: true,
      form_type: 'test',
      fullname: 'PAC - Concussion incident form',
      group: 'test',
      id: 45,
      key: 'test',
      name: 'Concussion incident form',
      updated_at: '2022-09-12T10:14:51Z',
    },
    openDeleteModal: jest.fn(),
    athleteData: { id: 1, ...mockAthleteData },
    t: i18nextTranslateStub(),
  };

  const renderWithPermissions = (
    medicalPermissions,
    concussionPermissions,
    passedProps = props
  ) => {
    return renderWithUserEventSetup(
      <PermissionsContext.Provider
        value={{
          permissions: {
            medical: {
              ...defaultPermissions,
              ...medicalPermissions,
            },
            concussion: {
              ...defaultConcussionPermissions,
              ...concussionPermissions,
            },
          },
          permissionsRequestStatus: 'SUCCESS',
        }}
      >
        <AppHeader {...passedProps} />
      </PermissionsContext.Provider>
    );
  };

  describe('default permissions', () => {
    it('renders the correct content', () => {
      render(<AppHeader {...props} />);

      expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'https://kitman-staging.imgix.net/avatar.jpg'
      );

      expect(
        screen.getByRole('heading', {
          name: 'John Doe - PAC - Concussion incident form',
        })
      ).toBeInTheDocument();

      expect(screen.queryByTestId('TextTag')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Delete' })
      ).not.toBeInTheDocument();
    });
  });

  describe('[permissions] permissions.concussion.canDeleteConcussionAssessments', () => {
    it('renders the correct content', async () => {
      const medical = defaultPermissions;
      const { user } = renderWithPermissions(medical, {
        canDeleteConcussionAssessments: true,
      });
      const deleteBtn = screen.getByRole('button', { name: 'Delete' });
      expect(deleteBtn).toBeInTheDocument();
      await user.click(deleteBtn);
      expect(props.openDeleteModal).toHaveBeenCalled();
    });
  });

  describe('[permissions] permissions.medical.allergies.canView', () => {
    const propsWithAllergies = {
      ...props,
      athleteData: {
        ...props.athleteData,
        allergies: [
          {
            id: 21,
            display_name: 'Ibuprofen allergy',
            severity: 'mild',
          },
          {
            id: 87,
            display_name: 'Peanut allergy',
            severity: 'severe',
          },
        ],
      },
    };

    it('renders the correct content', () => {
      renderWithPermissions(
        {
          issues: { canEdit: true },
          allergies: {
            canView: true,
          },
        },
        {},
        propsWithAllergies
      );

      expect(screen.getByText('Ibuprofen allergy')).toBeInTheDocument();
      expect(screen.getByText('Peanut allergy')).toBeInTheDocument();
    });
  });
});
