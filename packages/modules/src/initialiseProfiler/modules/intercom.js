/*
 * Initiates Intercom on the single page application
 * Based on: https://developers.intercom.com/installing-intercom/docs/basic-javascript
 */

export default (intercomSettings) => {
  if (!intercomSettings?.is_intercom_enabled) return;

  const APP_ID = intercomSettings.app_id;

  window.intercomSettings = {
    app_id: APP_ID,
    company: intercomSettings.company,
    excluded_user: intercomSettings.excluded_user,
    hide_default_launcher: intercomSettings.hide_default_launcher,
    ...(intercomSettings.user ?? {}),
  };

  /* eslint-disable */
  // prettier-ignore
  (function(){var w=window;var ic=w.Intercom;if(typeof ic==="function"){ic('reattach_activator');ic('update',w.intercomSettings);}else{var d=document;var i=function(){i.c(arguments);};i.q=[];i.c=function(args){i.q.push(args);};w.Intercom=i;var l=function(){var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://widget.intercom.io/widget/' + APP_ID;var x=d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);};if(document.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}}})();
};
