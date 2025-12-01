// @flow

export type NewEventAttachmentCategory = {
  name: string,
};

export type EventAttachmentCategoryCommon = $Exact<{
  name: string,
  archived: boolean,
  created_at: string,
  updated_at: string,
}>;

export type EventAttachmentCategory = $Exact<{
  id: number,
  ...EventAttachmentCategoryCommon,
}>;
