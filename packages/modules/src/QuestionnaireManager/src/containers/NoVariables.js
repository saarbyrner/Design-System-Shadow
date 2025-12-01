import { connect } from 'react-redux';
import { NoResultsMessage } from '@kitman/components';
import { sendIntercomMessage } from '@kitman/common/src/utils';

const contactUs = () => {
  sendIntercomMessage(`Can you help me setup some questionnaire variables on my account?
  I am getting an error message saying I have none`);
};

const mapStateToProps = (state) => {
  const variables = state.variables.currentlyVisible || {};

  return {
    innerHtml: () => (
      <div>
        <p>
          {'There are '}
          <span className="noResultsMessage__bold">
            no questionnaire variables
          </span>
          {' setup for this organisation.'}
        </p>
        <br />
        <p>
          Do you want to add some? &ensp;
          <a href="#intercom" onClick={contactUs}>
            Please contact us
          </a>
        </p>
      </div>
    ),
    isVisible: Object.keys(variables).length <= 0 || false,
  };
};

const NoVariables = connect(mapStateToProps)(NoResultsMessage);

export default NoVariables;
