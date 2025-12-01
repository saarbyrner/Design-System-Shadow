import { connect } from 'react-redux';
import i18n from '@kitman/common/src/utils/i18n';
import { NoResultsMessage } from '@kitman/components';

const mapStateToProps = (state) => ({
  innerHtml: () => (
    <div>
      <p>{i18n.t('No results found.')}</p>
    </div>
  ),
  isVisible: state.athletes.currentlyVisible === null,
});

const NoSearchResults = connect(mapStateToProps)(NoResultsMessage);

export default NoSearchResults;
