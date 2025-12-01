// @flow

export type FormState = Object;

export type OnCancel = Function;

export type Status = 'DONE' | 'PENDING' | 'SUCCESS' | 'ERROR';

export type UpdateStatus = (
  status: Status,
  title: string,
  description: string
) => void;

export type OnSave = (formState: FormState, updateStatus: UpdateStatus) => void;
