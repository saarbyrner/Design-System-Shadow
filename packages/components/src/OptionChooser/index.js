// @flow

export type Props = {
  options: Array<{ value: any, image?: string, text?: string, icon?: string }>,
  value: any,
  onChange: Function,
};

const OptionChooser = (props: Props) => {
  const isSelected = (option) => props.value === option.value;

  const handleOptionClick = (option) => () => {
    if (props.value !== option.value) {
      props.onChange(option.value, option);
    }
  };

  const optionClassName = (option) => {
    const classNames = ['optionChooser__option'];
    if (isSelected(option)) {
      classNames.push('optionChooser__option--selected');
    }
    return classNames.join(' ');
  };

  const imageContent = (option) => {
    if (!option.image) {
      return null;
    }

    return (
      <div className="optionChooser__optionImage">
        <img src={option.image} alt="source" />
      </div>
    );
  };

  const optionContent = (option) => {
    const iconContent = option.icon ? (
      <div className={`optionChooser__optionIcon ${option.icon}`} />
    ) : null;
    const textContent = option.text ? (
      <div className="optionChooser__optionText">{option.text}</div>
    ) : null;

    return (
      <div
        className={optionClassName(option)}
        onClick={handleOptionClick(option)}
        value={option.value}
      >
        {imageContent(option)}
        {iconContent}
        {textContent}
      </div>
    );
  };

  const optionsContent = () =>
    props.options.map((option) => (
      <div className="optionChooser__optionWrapper" key={option.value}>
        {optionContent(option)}
      </div>
    ));

  return <div className="optionChooser__wrapper">{optionsContent()}</div>;
};

export default OptionChooser;
