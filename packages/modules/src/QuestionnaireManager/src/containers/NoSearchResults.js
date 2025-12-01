import { connect } from 'react-redux';
import { NoResultsMessage } from '@kitman/components';

const getSquadOptionName = (squads, squadId) =>
  squads.find((squad) => squad.id === squadId).name;

const getText = (state) => {
  if (state.athletes.searchTerm && state.athletes.squadFilter !== null) {
    return (
      <p className="noResultMsg">
        {'There are no results found for '}
        <span className="noResultsMessage__bold">
          {state.athletes.searchTerm}
        </span>
        {' within '}
        <span className="noResultsMessage__bold">
          {getSquadOptionName(
            state.squadOptions.squads,
            state.athletes.squadFilter
          )}
        </span>
        .
      </p>
    );
  }

  if (!state.athletes.searchTerm && state.athletes.squadFilter !== null) {
    return (
      <p className="noResultMsg">
        {'There are no results found for '}
        <span className="noResultsMessage__bold">
          {getSquadOptionName(
            state.squadOptions.squads,
            state.athletes.squadFilter
          )}
        </span>
        .
      </p>
    );
  }

  return (
    <p className="noResultMsg">
      {'There are no results found for '}
      <span className="noResultsMessage__bold">
        {state.athletes.searchTerm}
      </span>
      {' within '}
      <span className="noResultsMessage__bold">All Squads</span>.
    </p>
  );
};

const getSubText = (state) => {
  if (state.athletes.searchTerm) {
    return (
      <div>
        <br />
        <p className="noResultMsgSubText">
          Please check if you have spelt the name correctly.
        </p>
      </div>
    );
  }

  return null;
};

const mapStateToProps = (state) => ({
  innerHtml: () => (
    <div>
      {getText(state)}
      {getSubText(state)}
    </div>
  ),
  isVisible: state.athletes.currentlyVisible === null,
});

const NoSearchResults = connect(mapStateToProps)(NoResultsMessage);

export default NoSearchResults;
