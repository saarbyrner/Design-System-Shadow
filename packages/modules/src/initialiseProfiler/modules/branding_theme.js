import kitmanColors from '../../../../common/src/variables/colors';

export default (branding) => {
  $(document).ready(() => {
    if (window.featureFlags['ip-login-branding']) {
      const root = document.documentElement;
      root.style.setProperty(
        '--theme-primary-color',
        branding?.colors?.primary || kitmanColors.blue_200
      );
      root.style.setProperty(
        '--theme-secondary-color',
        branding?.colors?.secondary || kitmanColors.blue_100
      );
      root.style.setProperty(
        '--theme-primary-1-gradient',
        branding?.colors?.primary_gradient_1 || kitmanColors.grey_300
      );
      root.style.setProperty(
        '--theme-primary-2-gradient',
        branding?.colors?.primary_gradient_2 || kitmanColors.grey_300
      );
      root.style.setProperty(
        '--theme-primary-3-gradient',
        branding?.colors?.primary_gradient_3 || kitmanColors.grey_400
      );
      root.style.setProperty(
        '--theme-primary-4-gradient',
        branding?.colors?.primary_gradient_4 || kitmanColors.grey_400
      );
    }
  });
};
