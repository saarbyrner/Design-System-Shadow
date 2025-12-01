import { render, screen } from '@testing-library/react';
import { setI18n } from 'react-i18next';
import i18n from '@kitman/common/src/utils/i18n';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { Provider } from 'react-redux';
import { storeFake } from '@kitman/common/src/utils/renderWithRedux';
import { data as mockOutbound } from '@kitman/modules/src/ElectronicFiles/shared/services/mocks/data/fetchOutboundElectronicFile.mock';
import OutboundContent from '@kitman/modules/src/ElectronicFiles/ViewElectronicFile/src/components/OutboundContent';

setI18n(i18n);

const props = {
  electronicFile: mockOutbound.data,
  t: i18nextTranslateStub(),
};

const renderComponent = () =>
  render(
    <Provider store={storeFake({})}>
      <OutboundContent {...props} />
    </Provider>
  );

describe('<OutboundContent />', () => {
  it('renders correctly', () => {
    renderComponent();

    expect(screen.getByText('liverpool.jpg - 34.7 kB')).toBeInTheDocument();
  });
});
