// @flow
import classNames from 'classnames';

type Props = {
  customClassname?: string,
  rightNavBtnClasses: string,
  onLeftBtnClick: Function,
  onRightBtnClick: Function,
};

const NavArrows = (props: Props) => {
  return (
    <div
      role="navigation"
      className={classNames('navArrows', {
        // $FlowFixMe if props.customClassname exists it's a string
        [props.customClassname]: props.customClassname,
      })}
    >
      <div className="navArrows__leftBtn isDisabled">
        <button
          type="button"
          onClick={() => props.onLeftBtnClick()}
          className="icon-next-left"
        />
      </div>
      <div className={props.rightNavBtnClasses}>
        <button
          type="button"
          onClick={() => props.onRightBtnClick()}
          className="icon-next-right"
        />
      </div>
    </div>
  );
};

export default NavArrows;
