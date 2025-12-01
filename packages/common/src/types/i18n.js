// @flow

type TranslationOptions = { [key: string]: any };

export type Translation = (
  text: string,
  options?: TranslationOptions
) => string;

export type I18nProps<T> = T & { t: Translation };
