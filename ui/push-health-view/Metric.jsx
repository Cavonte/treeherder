import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-fontawesome';

import { resultColorMap } from './helpers';

export default class Metric extends React.PureComponent {
  constructor(props) {
    super(props);

    const { result } = this.props;

    this.state = {
      detailsShowing: result !== 'pass',
    };
  }

  toggleDetails = () => {
    this.setState({ detailsShowing: !this.state.detailsShowing });
  };

  render() {
    const { detailsShowing } = this.state;
    const { result, name, value, details } = this.props;
    const resultColor = resultColorMap[result];
    const expandIcon = detailsShowing ? 'minus-square-o' : 'plus-square-o';
    return (
      <td>
        <div className="d-flex flex-row">
          <div className={`${resultColor} pr-2 mr-2`} />
          <div>
            <h3>
              {name}
              <span onClick={this.toggleDetails} className="btn btn-lg">
                <Icon name={`${expandIcon}`} />
              </span>
            </h3>
            {detailsShowing && (
              <React.Fragment>
                <div>Confidence: {value}/10</div>
                {details.map(detail => (
                  <div key={detail} className="ml-3">
                    {detail}
                  </div>
                ))}
              </React.Fragment>
            )}
          </div>
        </div>
      </td>
    );
  }
}

Metric.propTypes = {
  result: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  details: PropTypes.array.isRequired,
};
