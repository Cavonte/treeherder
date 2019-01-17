import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'reactstrap';

export default class SimpleTooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltipOpen: false,
      target: null,
    };
  }

  updateTarget = target => {
    if (!this.state.target) {
      this.setState({ target });
    }
  };

  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };

  render() {
    const { text, tooltipText, placement, textClass, tooltipClass } = this.props;
    const { tooltipOpen, target } = this.state;
    return (
      <div>
        <span ref={this.updateTarget} className={textClass}>
          {text}
        </span>
        {target && (
          <Tooltip
            placement={placement}
            isOpen={tooltipOpen}
            target={target}
            toggle={this.toggle}
            className={tooltipClass}
          >
            {tooltipText}
          </Tooltip>
        )}
      </div>
    );
  }
}
SimpleTooltip.propTypes = {
  text: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string]).isRequired,
  tooltipText: PropTypes.oneOfType([PropTypes.shape({}), PropTypes.string])
    .isRequired,
  textClass: PropTypes.string,
  placement: PropTypes.string,
  tooltipClass: PropTypes.string,
};

SimpleTooltip.defaultProps = {
  textClass: '',
  placement: 'left',
  tooltipClass: 'tooltip',
};
