import { render, screen } from '@testing-library/react';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment';
import { formatStandard } from '@kitman/common/src/utils/dateFormatter';
import ElectronicFileDetails from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/ElectronicFileDetails';
import { MENU_ITEM } from '@kitman/modules/src/ElectronicFiles/shared/redux/slices/sidebarSlice';
import { data as inboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchInboundElectronicFileList.mock';
import { data as outboundData } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/searchOutboundElectronicFileList.mock';
import { getContactDisplayText } from '@kitman/modules/src/ElectronicFiles/shared/utils';

const defaultProps = {
  t: i18nextTranslateStub(),
};

const renderComponent = (props = defaultProps) =>
  render(<ElectronicFileDetails {...props} />);

describe('<ElectronicFileDetails />', () => {
  it('renders inbound details correctly', () => {
    const props = {
      ...defaultProps,
      selectedMenuItem: MENU_ITEM.inbox,
      electronicFile: inboundData.data[0],
    };

    renderComponent(props);

    const electronicFile = props.electronicFile;
    const fromText = getContactDisplayText({
      firstName: electronicFile.received_from.first_name,
      lastName: electronicFile.received_from.last_name,
      companyName: electronicFile.received_from.company_name,
      faxNumber: electronicFile.received_from.fax_number.number,
    });

    expect(screen.getByText(fromText)).toBeInTheDocument();
    expect(
      screen.getByText(formatStandard({ date: moment(electronicFile.date) }))
    ).toBeInTheDocument();
  });

  it('renders outbound details correctly', () => {
    const props = {
      ...defaultProps,
      selectedMenuItem: MENU_ITEM.sent,
      electronicFile: outboundData.data[0],
    };

    renderComponent(props);

    expect(
      screen.getByText(
        formatStandard({ date: moment(props.electronicFile.date) })
      )
    ).toBeInTheDocument();

    expect(screen.getByText(props.electronicFile.title)).toBeInTheDocument();
    expect(screen.getByText(props.electronicFile.message)).toBeInTheDocument();
  });
});
