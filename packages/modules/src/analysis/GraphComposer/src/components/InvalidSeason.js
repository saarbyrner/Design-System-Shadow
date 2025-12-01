// @flow
import { withNamespaces } from 'react-i18next';
import type { I18nProps } from '@kitman/common/src/types/i18n';

window.intercomContact = () => {
  // $FlowFixMe global variable
  if (typeof Intercom !== 'undefined') {
    // eslint-disable-next-line no-undef
    Intercom('showNewMessage');
  }
};

const InvalidSeason = (props: I18nProps<{}>) => {
  return (
    <div className="row">
      <div className="col-lg-12 text-center km-padding-bottom">
        <h2 className="mt-5">{props.t('No Seasons Defined')}</h2>
        <p
          className="km-light-text"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: props.t(
              'This feature requires valid seasons. Please {{- link}} to get them set up for you.',
              {
                link: `<a onclick="window.intercomContact();"> ${props.t(
                  'contact us'
                )}</a>`,
              }
            ),
          }}
        />
      </div>
    </div>
  );
};

export const InvalidSeasonTranslated = withNamespaces()(InvalidSeason);
export default InvalidSeason;
