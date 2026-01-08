/**
 * @typedef {import("@reduxjs/toolkit/dist/configureStore").ToolkitStore} ToolkitStore
 */
// @flow
import { render } from '@testing-library/react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';

import { storeMock } from './consts';

/**
 * @param {Node} children
 * @param {ToolkitStore} store
 */
export const mountWithProvider = (
  children: Node,
  store?: any // I couldn't find a type using Flow)
) => mount(<Provider store={store ?? storeMock}>{children}</Provider>);

/**
 * @param {Node} children
 * @param {ToolkitStore} store
 */
export const renderWithProvider = (
  children: Node,
  store?: any // I couldn't find a type using Flow
) => render(<Provider store={store ?? storeMock}>{children}</Provider>);
