import renderWithProviders from '@kitman/common/src/utils/renderWithProviders';
import * as redux from 'react-redux';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Toasts from '@kitman/modules/src/Toasts';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import moment from 'moment';
import { initialState as initialCreateMovementState } from '@kitman/modules/src/UserMovement/shared/utils/index';
import { REDUCER_KEY as createMovementReducerKey } from '@kitman/modules/src/UserMovement/shared/redux/slices/createMovementSlice';
import { useCreateMovementRecordMutation } from '@kitman/modules/src/UserMovement/shared/redux/services';
import {
  TRADE,
  MULTI_ASSIGN,
  RELEASE,
  RETIRE,
  MEDICAL_TRIAL,
} from '@kitman/modules/src/UserMovement/shared/constants';
import useEventTracking from '@kitman/common/src/hooks/useEventTracking';
import ModalActions from '..';

jest.mock('@kitman/modules/src/UserMovement/shared/redux/services', () => ({
  ...jest.requireActual(
    '@kitman/modules/src/UserMovement/shared/redux/services'
  ),
  useCreateMovementRecordMutation: jest.fn(),
}));

jest.mock(
  '@kitman/modules/src/UserMovement/shared/redux/services/api/createMovementRecord'
);

jest.mock('@kitman/common/src/hooks/useEventTracking', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const onCreateMovementRecord = jest.fn();

const ninthOfFebruary = new Date('2024-02-09T00:00:01Z');
jest.useFakeTimers().setSystemTime(ninthOfFebruary);
moment.tz.setDefault('UTC');

const i18nT = i18nextTranslateStub();
const props = {
  t: i18nT,
};

const getDefaultStore = (transferType = 'trade') => {
  return {
    [createMovementReducerKey]: {
      ...initialCreateMovementState,
      form: {
        user_id: null,
        transfer_type: transferType,
        join_organisation_ids: [],
        join_squad_ids: [],
        leave_organisation_ids: [],
        joined_at: null,
      },
    },
    toastsSlice: {
      value: [],
    },
  };
};

const movementTypes = [TRADE, MULTI_ASSIGN, RELEASE, RETIRE, MEDICAL_TRIAL];

const transferTypeText = {
  trade: 'Trade',
  multi_assign: 'Multi Assign',
  release: 'Release',
  retire: 'Retire',
  medical_trial: 'Medical Trial',
};

const renderComponentWithProviders = (state = getDefaultStore()) =>
  renderWithProviders(
    <>
      <ModalActions {...props} />
      <Toasts />
    </>,
    {
      preloadedState: state,
    }
  );

const getButton = (name) => {
  return screen.getByRole('button', { name });
};

describe('<ModalActions/>', () => {
  let mockTrackEvent;
  beforeEach(() => {
    mockTrackEvent = jest.fn();
    useEventTracking.mockReturnValue({ trackEvent: mockTrackEvent });
  });

  describe('basic render', () => {
    beforeEach(() => {
      onCreateMovementRecord.mockReturnValue({
        unwrap: () => Promise.resolve({}),
      });
      useCreateMovementRecordMutation.mockReturnValue([
        onCreateMovementRecord,
        { isError: false, isLoading: false, isSuccess: false, data: null },
      ]);
      renderComponentWithProviders(getDefaultStore());
    });
    it('renders', async () => {
      expect(getButton('Cancel')).toBeInTheDocument();
      expect(getButton('Confirm')).toBeInTheDocument();
    });
  });

  describe('button state', () => {
    beforeEach(() => {
      onCreateMovementRecord.mockReturnValue({
        unwrap: () => Promise.resolve({}),
      });
      useCreateMovementRecordMutation.mockReturnValue([
        onCreateMovementRecord,
        { isLoading: true },
      ]);
      renderComponentWithProviders(getDefaultStore());
    });
    it('should disable the buttons when the mutation query is loading', () => {
      expect(getButton('Confirm')).toBeDisabled();
      expect(getButton('Cancel')).toBeDisabled();
    });
  });

  describe('Toasts', () => {
    beforeEach(() => {
      useCreateMovementRecordMutation.mockReturnValue([
        onCreateMovementRecord,
        { isError: true, isLoading: false, isSuccess: false, data: null },
      ]);
    });

    describe.each(movementTypes)('test the %p transfer type', (movement) => {
      beforeEach(() => {
        onCreateMovementRecord.mockReturnValue({
          unwrap: () => Promise.resolve({}),
        });
        renderComponentWithProviders(getDefaultStore(movement));
      });
      it('renders success toast on creation of a movement record', async () => {
        const confirmButton = await getButton('Confirm');
        await fireEvent.click(confirmButton);
        expect(
          screen.getByText(`${transferTypeText[movement]} successfully created`)
        ).toBeInTheDocument();
      });
    });

    describe('failure', () => {
      beforeEach(() => {
        onCreateMovementRecord.mockReturnValue({
          unwrap: jest.fn().mockRejectedValue(new Error()),
        });
        renderComponentWithProviders(getDefaultStore());
      });
      it('renders error toast on creation of a movement record failure', async () => {
        const confirmButton = await getButton('Confirm');
        await fireEvent.click(confirmButton);
        await waitFor(() => {
          expect(screen.getByText('Error creating Trade')).toBeInTheDocument();
        });
      });
    });
  });

  describe('button interactions', () => {
    let useDispatchSpy;
    let mockDispatch;

    beforeEach(() => {
      useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      mockDispatch = jest.fn();
      useDispatchSpy.mockReturnValue(mockDispatch);

      useCreateMovementRecordMutation.mockReturnValue([
        onCreateMovementRecord,
        { isError: false, isLoading: false, isSuccess: true },
      ]);
      renderComponentWithProviders(getDefaultStore());
    });

    afterEach(() => {
      useDispatchSpy.mockClear();
    });

    it('should dispatch ontoggleModal when cancel is clicked', async () => {
      const cancelButton = await getButton('Cancel');
      await fireEvent.click(cancelButton);

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalledWith({
          payload: undefined,
          type: 'UserMovement.slice.createMovement/onToggleModal',
        });
      });
    });

    it('should call trackEvent when confirm is clicked', async () => {
      onCreateMovementRecord.mockReturnValue({
        unwrap: () => Promise.resolve({}),
      });

      const confirmButton = await getButton('Confirm');
      await fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(mockTrackEvent).toHaveBeenCalledWith('Move Player', {
          Type: ['Trade'],
        });
      });
    });
  });
});
