import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockLocalStorage } from '@kitman/common/src/utils/test_utils';
import AmaConfirmationModal, {
  amaConfirmationKey,
} from '@kitman/modules/src/Medical/shared/components/AmaConfirmationModal';
import { useGetOrganisationQuery } from '@kitman/common/src/redux/global/services/globalApi';
import { getIsLocalStorageAvailable } from '@kitman/common/src/utils';
import { organisationAssociations } from '@kitman/common/src/variables';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/common/src/utils');

describe('AmaConfirmationModal', () => {
  let resetEmptyMock;

  beforeEach(() => {
    jest.clearAllMocks();
    resetEmptyMock = mockLocalStorage();
  });

  afterEach(() => {
    resetEmptyMock();
  });

  it('renders the confirmation modal when associationMatch is true and amaConfirmationKey is not in local storage', () => {
    useGetOrganisationQuery.mockReturnValue({
      data: { association_name: organisationAssociations.nfl },
    });
    getIsLocalStorageAvailable.mockReturnValue(true);
    window.localStorage.getItem = jest.fn().mockReturnValue(null);

    render(<AmaConfirmationModal />);

    expect(
      screen.getByText(/American Medical Association. All rights reserved/)
    ).toBeInTheDocument();
  });

  it('sets amaConfirmationKey in local storage and closes the modal when confirmed', async () => {
    const user = userEvent.setup();
    useGetOrganisationQuery.mockReturnValue({
      data: { association_name: organisationAssociations.nfl },
    });
    getIsLocalStorageAvailable.mockReturnValue(true);
    render(<AmaConfirmationModal />);

    const setItemSpy = jest.spyOn(window.localStorage, 'setItem');
    await user.click(screen.getByText(/I acknowledge/));
    expect(setItemSpy).toHaveBeenCalledWith(amaConfirmationKey, 'confirmed');
  });

  it('does not render the confirmation modal when associationMatch is false', () => {
    useGetOrganisationQuery.mockReturnValue({
      data: { association_name: 'Some Other League' },
    });
    getIsLocalStorageAvailable.mockReturnValue(true);
    window.localStorage.getItem = jest.fn().mockReturnValue(null);

    render(<AmaConfirmationModal />);

    expect(
      screen.queryByText(/American Medical Association. All rights reserved/)
    ).not.toBeInTheDocument();
  });

  it('does not render the confirmation modal when amaConfirmationKey is set in local storage', () => {
    useGetOrganisationQuery.mockReturnValue({
      data: { association_name: organisationAssociations.nfl },
    });
    getIsLocalStorageAvailable.mockReturnValue(true);
    window.localStorage.getItem = jest.fn().mockReturnValue('confirmed');

    render(<AmaConfirmationModal />);

    expect(
      screen.queryByText(/American Medical Association. All rights reserved/)
    ).not.toBeInTheDocument();
  });
});
