// @flow
import $ from 'jquery';
import type { Action, ThunkAction } from '../types/actions';
import type { Annotation } from '../../types';

export const openNoteDetailModal = (): Action => ({
  type: 'OPEN_NOTE_DETAIL_MODAL',
});

export const closeNoteDetailModal = (): Action => ({
  type: 'CLOSE_NOTE_DETAIL_MODAL',
});

export const fetchNoteDetailSuccess = (annotation: Annotation): Action => ({
  type: 'FETCH_NOTE_DETAIL_SUCCESS',
  payload: { annotation },
});

export const fetchNoteDetailError = (): Action => ({
  type: 'FETCH_NOTE_DETAIL_ERROR',
});

export const fetchNoteDetail =
  (annotationId: number): ThunkAction =>
  (dispatch: (action: Action) => Action) => {
    $.ajax({
      method: 'GET',
      url: `/annotations/${annotationId}`,
      contentType: 'application/json',
    })
      .done((response) => {
        dispatch(fetchNoteDetailSuccess(response.annotation));
      })
      .fail(() => {
        dispatch(fetchNoteDetailError());
      });
  };
