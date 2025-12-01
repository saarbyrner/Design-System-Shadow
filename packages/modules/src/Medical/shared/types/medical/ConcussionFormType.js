// @flow
export type ConcussionFormType = {
  id: number,
  category: string,
  group: string,
  key: string,
  name: string,
  fullname?: ?string,
  form_type?: ?string,
  enabled: boolean,
  created_at: string,
  updated_at: string,
};
