import { renderHook, act } from '@testing-library/react-hooks';
import moment from 'moment-timezone';

import useConcussionTestResultsForm, {
  getInitialFormState,
} from '../hooks/useConcussionTestResultsForm';

describe('useConcussionTestForm', () => {
  beforeEach(() => {
    moment.tz.setDefault('UTC');
    jest.useFakeTimers().setSystemTime(new Date('2021-03-20T03:20:00+00:00'));
  });

  afterEach(() => {
    moment.tz.setDefault();
    jest.useRealTimers();
  });

  describe('when the test protocol is NPC', () => {
    it('returns correct state on SET_ATHLETE_ID', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.athlete_id).toBe(null);

      act(() => {
        dispatch({
          type: 'SET_ATHLETE_ID',
          athleteId: 123,
        });
      });
      expect(result.current.formState.athlete_id).toBe(123);
    });

    it('returns correct state on SET_TEST_TYPE', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.test_type).toBe('baseline');

      act(() => {
        dispatch({
          type: 'SET_TEST_TYPE',
          testType: 'initial_assessment',
        });
      });
      expect(result.current.formState.test_type).toBe('initial_assessment');
    });

    it('returns correct state on SET_EXAMINATION_DATE', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      act(() => {
        dispatch({
          type: 'CLEAR_FORM',
        });
      });

      act(() => {
        dispatch({
          type: 'SET_EXAMINATION_DATE',
          examinationDate: '2022-04-20',
        });
      });

      expect(result.current.formState.examination_date).toBe(
        '2022-04-20T03:00:00+00:00'
      );
    });

    it('returns correct state on SET_EXAMINATION_TIME', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      act(() => {
        dispatch({
          type: 'SET_EXAMINATION_DATE',
          examinationDate: '2021-03-20',
        });
      });

      act(() => {
        dispatch({
          type: 'SET_EXAMINATION_TIME',
          examinationTime: '2022-04-28T11:30:00+00:00',
        });
      });

      expect(result.current.formState.examination_date).toBe(
        '2021-03-20T11:30:00+00:00'
      );
    });

    it('returns correct state on SET_LOCAL_TIMEZONE', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      act(() => {
        dispatch({
          type: 'SET_LOCAL_TIMEZONE',
          localTimezone: 'Europe/Dublin',
        });
      });
      expect(result.current.formState.local_timezone).toBe('Europe/Dublin');
    });

    it('returns correct state on SET_EXAMINER_ID', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.examiner_id).toBe(null);

      act(() => {
        dispatch({
          type: 'SET_EXAMINER_ID',
          examinerId: 2,
        });
      });
      expect(result.current.formState.examiner_id).toBe(2);
    });

    it('returns correct state on SET_ILLNESS_IDS', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.illness_occurrence_ids).toEqual([]);

      act(() => {
        dispatch({
          type: 'SET_ILLNESS_IDS',
          illnessIds: [1, 2, 3],
        });
      });
      expect(result.current.formState.illness_occurrence_ids).toEqual([
        1, 2, 3,
      ]);
    });

    it('returns correct state on SET_INJURY_IDS', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.injury_occurrence_ids).toEqual([]);

      act(() => {
        dispatch({
          type: 'SET_INJURY_IDS',
          injuryIds: [1, 2, 3],
        });
      });
      expect(result.current.formState.injury_occurrence_ids).toEqual([1, 2, 3]);
    });

    it('returns correct state on SET_NPC_DISTANCE_1', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.npc_distance_1).toBe(null);
      expect(result.current.formState.npc_average).toBe(null);

      dispatch({
        type: 'SET_NPC_DISTANCE_1',
        distance: '1',
      });
      expect(result.current.formState.npc_distance_1).toBe('1');
      expect(result.current.formState.npc_average).toBe(1);
    });

    it('returns correct state on SET_NPC_DISTANCE_2', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.npc_distance_2).toBe(null);
      expect(result.current.formState.npc_average).toBe(null);

      dispatch({
        type: 'SET_NPC_DISTANCE_2',
        distance: '3',
      });
      expect(result.current.formState.npc_distance_2).toBe('3');
      expect(result.current.formState.npc_average).toBe(3);
    });

    it('returns correct state on SET_NPC_DISTANCE_3', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.npc_distance_3).toBe(null);
      expect(result.current.formState.npc_average).toBe(null);

      dispatch({
        type: 'SET_NPC_DISTANCE_3',
        distance: '2',
      });
      expect(result.current.formState.npc_distance_3).toBe('2');
      expect(result.current.formState.npc_average).toBe(2);
    });

    it('returns correct state for NPC average', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.npc_distance_1).toBe(null);
      expect(result.current.formState.npc_distance_2).toBe(null);
      expect(result.current.formState.npc_distance_3).toBe(null);
      expect(result.current.formState.npc_average).toBe(null);

      act(() => {
        dispatch({
          type: 'SET_NPC_DISTANCE_1',
          distance: '1',
        });
      });
      expect(result.current.formState.npc_average).toBe(1);

      act(() => {
        dispatch({
          type: 'SET_NPC_DISTANCE_2',
          distance: '1.5',
        });
      });
      expect(result.current.formState.npc_average).toBe(1.25);

      act(() => {
        dispatch({
          type: 'SET_NPC_DISTANCE_3',
          distance: '2',
        });
      });
      expect(result.current.formState.npc_average).toBe(1.5);

      expect(result.current.formState.npc_distance_1).toBe('1');
      expect(result.current.formState.npc_distance_2).toBe('1.5');
      expect(result.current.formState.npc_distance_3).toBe('2');
    });

    it('returns correct state on UPDATE_QUEUED_ATTACHMENTS', () => {
      const files = [
        {
          lastModified: 1542706027020,
          lastModifiedDate: '2022-04-15T23:00:00Z',
          filename: 'sample.csv',
          fileSize: 124625,
          fileType: 'text/csv',
          webkitRelativePath: '',
        },
      ];

      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.queuedAttachments).toEqual([]);

      act(() => {
        dispatch({
          type: 'UPDATE_QUEUED_ATTACHMENTS',
          queuedAttachments: files,
        });
      });
      expect(result.current.formState.queuedAttachments).toEqual(files);
    });

    it('returns correct state on UPDATE_ATTACHMENT_TYPE', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState.queuedAttachmentTypes).toEqual([]);

      act(() => {
        dispatch({
          type: 'UPDATE_ATTACHMENT_TYPE',
          queuedAttachmentType: 'FILE',
        });
      });
      expect(result.current.formState.queuedAttachmentTypes).toEqual(['FILE']);
    });

    it('returns correct state on REMOVE_ATTACHMENT_TYPE', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      act(() => {
        dispatch({
          type: 'UPDATE_FILE_ATTACHMENT_QUEUE',
          queuedAttachmentTypes: 'FILE',
        });
      });

      act(() => {
        dispatch({
          type: 'REMOVE_ATTACHMENT_TYPE',
          attachmentType: 'FILE',
        });
      });
      expect(result.current.formState.queuedAttachmentTypes).toEqual([]);
    });

    it('returns correct state on CLEAR_FORM', () => {
      const { result } = renderHook(() => useConcussionTestResultsForm('NPC'));
      const { dispatch } = result.current;

      expect(result.current.formState).toEqual(getInitialFormState('NPC'));

      act(() => {
        dispatch({
          type: 'SET_TEST_TYPE',
          testType: 'initial_assessment',
        });
      });
      expect(result.current.formState.test_type).toBe('initial_assessment');

      act(() => {
        dispatch({
          type: 'CLEAR_FORM',
          testProtocol: 'NPC',
        });
      });
      expect(result.current.formState).toEqual(getInitialFormState('NPC'));
    });
  });

  describe('when the test protocol is KING-DEVICK', () => {
    it('returns correct state on SET_ATHLETE_ID', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.athlete_id).toBe(null);

      act(() => {
        dispatch({
          type: 'SET_ATHLETE_ID',
          athleteId: 123,
        });
      });
      expect(result.current.formState.athlete_id).toBe(123);
    });

    it('returns correct state on SET_TEST_TYPE', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.test_type).toBe('baseline');

      act(() => {
        dispatch({
          type: 'SET_TEST_TYPE',
          testType: 'initial_assessment',
        });
      });
      expect(result.current.formState.test_type).toBe('initial_assessment');
    });

    it('returns correct state on SET_EXAMINATION_DATE', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      dispatch({
        type: 'CLEAR_FORM',
      });

      dispatch({
        type: 'SET_EXAMINATION_DATE',
        examinationDate: '2022-04-20',
      });

      expect(result.current.formState.examination_date).toBe(
        '2022-04-20T03:00:00+00:00'
      );
    });

    it('returns correct state on SET_EXAMINATION_TIME', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      act(() => {
        dispatch({
          type: 'SET_EXAMINATION_DATE',
          examinationDate: '2021-03-20',
        });
      });

      act(() => {
        dispatch({
          type: 'SET_EXAMINATION_TIME',
          examinationTime: '2022-04-28T11:30:00+00:00',
        });
      });

      expect(result.current.formState.examination_date).toBe(
        '2021-03-20T11:30:00+00:00'
      );
    });

    it('returns correct state on SET_LOCAL_TIMEZONE', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      dispatch({
        type: 'SET_LOCAL_TIMEZONE',
        localTimezone: 'Europe/Dublin',
      });
      expect(result.current.formState.local_timezone).toBe('Europe/Dublin');
    });

    it('returns correct state on SET_EXAMINER_ID', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.examiner_id).toBe(null);

      act(() => {
        dispatch({
          type: 'SET_EXAMINER_ID',
          examinerId: 2,
        });
      });
      expect(result.current.formState.examiner_id).toBe(2);
    });

    it('returns correct state on SET_ILLNESS_IDS', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.illness_occurrence_ids).toEqual([]);

      act(() => {
        dispatch({
          type: 'SET_ILLNESS_IDS',
          illnessIds: [1, 2, 3],
        });
      });
      expect(result.current.formState.illness_occurrence_ids).toEqual([
        1, 2, 3,
      ]);
    });

    it('returns correct state on SET_INJURY_IDS', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.injury_occurrence_ids).toEqual([]);

      act(() => {
        dispatch({
          type: 'SET_INJURY_IDS',
          injuryIds: [1, 2, 3],
        });
      });
      expect(result.current.formState.injury_occurrence_ids).toEqual([1, 2, 3]);
    });

    it('returns correct state on SET_KING_DEVICK_SCORE', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.king_devick_score).toBe(null);

      act(() => {
        dispatch({
          type: 'SET_KING_DEVICK_SCORE',
          score: '1',
        });
      });
      expect(result.current.formState.king_devick_score).toBe('1');
    });

    it('returns correct state on SET_KING_DEVICK_ERRORS', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.king_devick_errors).toBe(null);

      act(() => {
        dispatch({
          type: 'SET_KING_DEVICK_ERRORS',
          errors: '3',
        });
      });
      expect(result.current.formState.king_devick_errors).toBe('3');
    });

    it('returns correct state on UPDATE_QUEUED_ATTACHMENTS', () => {
      const files = [
        {
          lastModified: 1542706027020,
          lastModifiedDate: '2022-04-15T23:00:00Z',
          filename: 'sample.csv',
          fileSize: 124625,
          fileType: 'text/csv',
          webkitRelativePath: '',
        },
      ];

      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.queuedAttachments).toEqual([]);

      act(() => {
        dispatch({
          type: 'UPDATE_QUEUED_ATTACHMENTS',
          queuedAttachments: files,
        });
      });
      expect(result.current.formState.queuedAttachments).toEqual(files);
    });

    it('returns correct state on UPDATE_ATTACHMENT_TYPE', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState.queuedAttachmentTypes).toEqual([]);

      act(() => {
        dispatch({
          type: 'UPDATE_ATTACHMENT_TYPE',
          queuedAttachmentType: 'FILE',
        });
      });
      expect(result.current.formState.queuedAttachmentTypes).toEqual(['FILE']);
    });

    it('returns correct state on REMOVE_ATTACHMENT_TYPE', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      act(() => {
        dispatch({
          type: 'UPDATE_FILE_ATTACHMENT_QUEUE',
          queuedAttachmentTypes: 'FILE',
        });
      });

      act(() => {
        dispatch({
          type: 'REMOVE_ATTACHMENT_TYPE',
          attachmentType: 'FILE',
        });
      });
      expect(result.current.formState.queuedAttachmentTypes).toEqual([]);
    });

    it('returns correct state on CLEAR_FORM', () => {
      const { result } = renderHook(() =>
        useConcussionTestResultsForm('KING-DEVICK')
      );
      const { dispatch } = result.current;

      expect(result.current.formState).toEqual(
        getInitialFormState('KING-DEVICK')
      );

      act(() => {
        dispatch({
          type: 'SET_TEST_TYPE',
          testType: 'initial_assessment',
        });
      });
      expect(result.current.formState.test_type).toBe('initial_assessment');

      act(() => {
        dispatch({
          type: 'CLEAR_FORM',
          testProtocol: 'KING-DEVICK',
        });
      });
      expect(result.current.formState).toEqual(
        getInitialFormState('KING-DEVICK')
      );
    });
  });
});
