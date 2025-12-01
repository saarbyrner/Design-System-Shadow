import { renderHook, act } from '@testing-library/react-hooks';
import useProcedureForm, { initialFormState } from '../useProcedureForm';

describe('useMedicalAlertForm', () => {
  it('returns correct state on CLEAR_FORM', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState).toEqual(initialFormState);

    act(() => {
      dispatch({
        type: 'ADD_ANOTHER_PROCEDURE',
        athleteId: 21,
      });
    });
    expect(result.current.formState.queuedProcedures.length).toEqual(2);

    act(() => {
      dispatch({
        type: 'CLEAR_FORM',
      });
    });
    expect(result.current.formState).toEqual(initialFormState);
    expect(result.current.formState.queuedProcedures.length).toEqual(1);
  });

  it('returns correct state on SET_ATHLETE_ID', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.athleteId).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_ATHLETE_ID',
        athleteId: 21,
      });
    });
    expect(result.current.formState.athleteId).toEqual(21);
  });

  it('returns correct state on SET_PROCEDURE_DATE', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureDate).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_DATE',
        index: 0,
        procedureDate: '2022-11-18T08:00:00+00:00',
      });
    });
    expect(result.current.formState.queuedProcedures[0].procedureDate).toEqual(
      '2022-11-18T08:00:00+00:00'
    );
  });

  it('returns correct state on SET_PROCEDURE_ORDER_DATE', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureOrderDate).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_ORDER_DATE',
        index: 0,
        procedureOrderDate: '2022-11-18T08:00:00+00:00',
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureOrderDate
    ).toEqual('2022-11-18T08:00:00+00:00');
  });

  it('returns correct state on SET_LOCATION_ID', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.locationId).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_LOCATION_ID',
        locationId: 19,
      });
    });
    expect(result.current.formState.locationId).toEqual(19);
  });

  it('returns correct state on SET_PROVIDER_SGID', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].providerSgid).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROVIDER_SGID',
        index: 0,
        providerSgid: '76',
      });
    });
    expect(result.current.formState.queuedProcedures[0].providerSgid).toEqual(
      '76'
    );
  });

  it('returns correct state on SET_OTHER_PROVIDER', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].otherProvider).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_OTHER_PROVIDER',
        index: 0,
        otherProvider: 'Jonathan Doe',
      });
    });
    expect(result.current.formState.queuedProcedures[0].otherProvider).toEqual(
      'Jonathan Doe'
    );
  });

  it('returns correct state on SET_PROCEDURE_TYPE', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureType).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_TYPE',
        index: 0,
        procedureType: { value: 19, label: 'Mock procedure type' },
      });
    });
    expect(result.current.formState.queuedProcedures[0].procedureType).toEqual({
      value: 19,
      label: 'Mock procedure type',
    });
  });

  it('returns correct state on SET_PROCEDURE_DESCRIPTION', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureDescription).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_DESCRIPTION',
        index: 0,
        procedureDescription:
          'A sample description of what the procedure entails',
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureDescription
    ).toEqual('A sample description of what the procedure entails');
  });

  it('returns correct state on SET_PROCEDURE_REASON', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureReason).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_REASON',
        index: 0,
        procedureReason: 4,
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureReason
    ).toEqual(4);
  });

  it('returns correct state on SET_PROCEDURE_REASON_OTHER', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureReasonOther).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_REASON_OTHER',
        index: 0,
        procedureReasonOther: 'Other Procedure reason goes here',
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureReasonOther
    ).toEqual('Other Procedure reason goes here');
  });

  it('returns correct state on SET_PROCEDURE_COMPLICATION_ID', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureComplicationIds).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_COMPLICATION_IDS',
        index: 0,
        procedureComplicationIds: [1],
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureComplicationIds
    ).toEqual([1]);
  });

  it('returns correct state on SET_PROCEDURE_COMPLICATION_OTHER', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureComplicationOther).toEqual(
      ''
    );

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_COMPLICATION_OTHER',
        index: 0,
        procedureComplicationOther: 'Other unknown complication',
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureComplicationOther
    ).toEqual('Other unknown complication');
  });

  it('returns correct state on SET_BODY_AREA_ID', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].bodyAreaId).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_BODY_AREA_ID',
        index: 0,
        bodyAreaId: 2,
      });
    });
    expect(result.current.formState.queuedProcedures[0].bodyAreaId).toEqual(2);
  });

  it('returns correct state on SET_INJURY_IDS', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].injuryIds).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_INJURY_IDS',
        index: 0,
        injuryIds: [3, 8, 15],
      });
    });
    expect(result.current.formState.queuedProcedures[0].injuryIds).toEqual([
      3, 8, 15,
    ]);
  });

  it('returns correct state on SET_ILLNESS_IDS', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].illnessIds).toEqual([]);

    act(() => {
      dispatch({
        type: 'SET_ILLNESS_IDS',
        index: 0,
        illnessIds: [26, 29, 8],
      });
    });
    expect(result.current.formState.queuedProcedures[0].illnessIds).toEqual([
      26, 29, 8,
    ]);
  });

  it('returns correct state on SET_PROCEDURE_TIMING', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureTiming).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_TIMING',
        index: 0,
        procedureTiming: 'pre-game',
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureTiming
    ).toEqual('pre-game');
  });

  it('returns correct state on SET_PROCEDURE_TIMING_OTHER', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureTimingOther).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_TIMING_OTHER',
        index: 0,
        procedureTimingOther: 'Minutes before kick-off',
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureTimingOther
    ).toEqual('Minutes before kick-off');
  });

  it('returns correct state on SET_PROCEDURE_START_TIME', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureStartTime).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_START_TIME',
        index: 0,
        procedureStartTime: '2022-12-09T20:41:16Z',
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureStartTime
    ).toEqual('2022-12-09T20:41:16Z');
  });

  it('returns correct state on SET_PROCEDURE_DURATION', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureDuration).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_DURATION',
        index: 0,
        procedureDuration: 60,
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureDuration
    ).toEqual(60);
  });

  it('returns correct state on SET_PROCEDURE_IV_AMOUNT', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureAmount).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_IV_AMOUNT',
        index: 0,
        procedureAmount: 100.5,
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureAmount
    ).toEqual(100.5);
  });

  it('returns correct state on SET_PROCEDURE_IV_AMOUNT_USED', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureAmountUsed).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_IV_AMOUNT_USED',
        index: 0,
        procedureAmountUsed: 44.3,
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureAmountUsed
    ).toEqual(44.3);
  });

  it('returns correct state on SET_PROCEDURE_IV_URINE_GRAVITY', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].procedureUrineGravity).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_PROCEDURE_IV_URINE_GRAVITY',
        index: 0,
        procedureUrineGravity: 0.05,
      });
    });
    expect(
      result.current.formState.queuedProcedures[0].procedureUrineGravity
    ).toEqual(0.05);
  });

  it('returns correct state on SET_NOTE_CONTENT', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].noteContent).toEqual(null);

    act(() => {
      dispatch({
        type: 'SET_NOTE_CONTENT',
        index: 0,
        noteContent: 'This is a sample note of a Procedural nature.',
      });
    });
    expect(result.current.formState.queuedProcedures[0].noteContent).toEqual(
      'This is a sample note of a Procedural nature.'
    );
  });

  it('returns correct state on UPDATE_QUEUED_ATTACHMENTS', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].queuedAttachments).toEqual([]);

    act(() => {
      dispatch({
        type: 'UPDATE_QUEUED_ATTACHMENTS',
        index: 0,
        queuedAttachments: [
          {
            original_filename: 'lovelydogs.png',
            filesize: 16170,
            filetype: 'image/png',
          },
          {
            original_filename: 'verylovelydogs.png',
            filesize: 123982938,
            filetype: 'image/png',
          },
        ],
      });
    });

    expect(
      result.current.formState.queuedProcedures[0].queuedAttachments
    ).toEqual([
      {
        original_filename: 'lovelydogs.png',
        filesize: 16170,
        filetype: 'image/png',
      },
      {
        original_filename: 'verylovelydogs.png',
        filesize: 123982938,
        filetype: 'image/png',
      },
    ]);
  });

  it('returns correct state on SET_LINK_TITLE', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].linkTitle).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_LINK_TITLE',
        index: 0,
        linkTitle: 'Premier League',
      });
    });

    expect(result.current.formState.queuedProcedures[0].linkTitle).toEqual(
      'Premier League'
    );
  });

  it('returns correct state on SET_LINK_URI', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].linkUri).toEqual('');

    act(() => {
      dispatch({
        type: 'SET_LINK_URI',
        index: 0,
        linkUri: 'https://www.premierleague.com',
      });
    });

    expect(result.current.formState.queuedProcedures[0].linkUri).toEqual(
      'https://www.premierleague.com'
    );
  });

  it('returns correct state on UPDATE_QUEUED_LINKS', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].queuedLinks).toEqual([]);

    act(() => {
      dispatch({
        type: 'UPDATE_QUEUED_LINKS',
        index: 0,
        queuedLinks: [
          {
            id: 0,
            title: 'RTE',
            uri: 'https://rte.ie',
          },
        ],
      });
    });

    expect(result.current.formState.queuedProcedures[0].queuedLinks).toEqual([
      {
        id: 0,
        title: 'RTE',
        uri: 'https://rte.ie',
      },
    ]);
  });

  it('returns correct state on REMOVE_QUEUED_LINK', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].queuedLinks).toEqual([]);

    act(() => {
      dispatch({
        type: 'UPDATE_QUEUED_LINKS',
        index: 0,
        queuedLinks: [
          {
            id: 0,
            title: 'RTE',
            uri: 'https://rte.ie',
          },
        ],
      });

      dispatch({
        type: 'REMOVE_QUEUED_LINK',
        index: 0,
        id: 0,
      });
    });

    expect(result.current.formState.queuedProcedures[0].queuedLinks).toEqual(
      []
    );
  });

  it('returns correct state on CLEAR_QUEUED_LINKS', () => {
    const { result } = renderHook(() => useProcedureForm());
    const { formState, dispatch } = result.current;

    expect(formState.queuedProcedures[0].queuedLinks).toEqual([]);

    act(() => {
      dispatch({
        type: 'CLEAR_QUEUED_LINKS',
        index: 0,
        queuedLinks: [],
      });
    });

    expect(result.current.formState.queuedProcedures[0].queuedLinks).toEqual(
      []
    );
  });
});
