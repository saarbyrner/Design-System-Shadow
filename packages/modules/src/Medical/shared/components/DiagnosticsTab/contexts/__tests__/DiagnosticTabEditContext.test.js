import { renderHook, act } from '@testing-library/react-hooks';
import {
  useDiagnosticTabEdit,
  DiagnosticTabEditContextProvider,
} from '../DiagnosticTabEditContext';

const wrapper = ({ children }) => (
  <DiagnosticTabEditContextProvider>
    {children}
  </DiagnosticTabEditContextProvider>
);

describe('<DiagnosticTabEditStateContext/>', () => {
  it('returns correct state on TOGGLE_EDIT', () => {
    const { result } = renderHook(() => useDiagnosticTabEdit(), { wrapper });
    expect(result.current.diagnosticTabEditState.isEditing).toBeFalsy();
    act(() => {
      result.current.toggleEdit();
    });

    expect(result.current.diagnosticTabEditState.isEditing).toBeTruthy();
  });
});
