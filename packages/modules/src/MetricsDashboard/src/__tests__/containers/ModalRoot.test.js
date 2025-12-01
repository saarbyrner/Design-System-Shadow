import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { storeFake } from '@kitman/common/src/utils/test_utils';
import ModalRoot from '../../containers/ModalRoot';

describe('ModalRoot', () => {
  it('renders nothing if ModalType is null', () => {
    const store = storeFake({ modal: { modalType: null, modalProps: {} } });
    const { container } = render(
      <Provider store={store}>
        <ModalRoot />
      </Provider>
    );
    expect(container).toBeEmptyDOMElement();
  });
});
