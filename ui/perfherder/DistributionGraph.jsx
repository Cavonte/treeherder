import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'reactstrap';

export default class DistributionGraph extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.ctx = null;
    this.state = {
      minValue: null,
      maxValue: null,
    };
  }

  componentDidMount() {
    console.log(this.canvasRef);
    this.ctx = this.canvasRef.getContext('2d');
    this.ctx.globalAlpha = 0.3;
    const [minValue, maxValue] = this.calculateValues();
    this.setState({ minValue, maxValue });
  }

  componentDidUpdate() {
    this.plotValues();
  }
  calculateValues = () => {
    const { replicates } = this.props;
    let maxValue = Math.max.apply(null, replicates);
    let minValue = Math.min.apply(null, replicates);

    if (maxValue - minValue > 1) {
      maxValue = Math.ceil(maxValue * 1.001);
      minValue = Math.floor(minValue / 1.001);
    }
    return [minValue, maxValue];
  };

  plotValues = () => {
    const { maxValue, minValue } = this.state;
    this.props.replicates.forEach(value => {
      this.ctx.beginPath();
      this.ctx.arc(
        (180 / (maxValue - minValue)) * (value - minValue) + 5,
        18,
        5,
        0,
        360,
      );
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
    });
  };
  // TODO where does numberal come from?
  // abbreviatedNumber = num =>
  //   num.toString().length <= 5 ? num : numeral(num).format('0.0a');

  render() {
    const { minValue, maxValue } = this.state;

    return (
      <Table className="tooltip-table">
        {minValue && maxValue && 
        <tr>
          <td className="value-column">{minValue}</td>
          <td className="distribution-column">
            <canvas ref={this.canvasRef} width={190} height={30} />
          </td>
          <td className="value-column">{maxValue}</td>
        </tr>}
      </Table>
    );
  }
}

DistributionGraph.propTypes = {
  replicates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

// treeherder.component('distributionGraph', {
//   template: `
//       <table class="tooltip-table">
//           <tr>
//               <td class="value-column">{{$ctrl.minValue|abbreviatedNumber}}</td>
//               <td class="distribution-column"><canvas id="distribution-graph-new" width="190" height="30"></canvas></td>
//               <td class="value-column">{{$ctrl.maxValue|abbreviatedNumber}}</td>
//           </tr>
//       </table>`,
//   bindings: {
//       replicates: '<',
//   },
//   controller: [function () {
//       const ctrl = this;

//       ctrl.$onInit = function () {
//           const cvs = document.getElementById('distribution-graph-new');
//           const ctx = cvs.getContext('2d');
//           cvs.setAttribute('id', 'distribution-graph-current');
//           ctrl.maxValue = Math.max.apply(null, ctrl.replicates);
//           ctrl.minValue = Math.min.apply(null, ctrl.replicates);
//           if (ctrl.maxValue - ctrl.minValue > 1) {
//               ctrl.maxValue = Math.ceil(ctrl.maxValue * 1.001);
//               ctrl.minValue = Math.floor(ctrl.minValue / 1.001);
//           }
//           ctx.globalAlpha = 0.3;
//           ctrl.replicates.forEach((value) => {
//               ctx.beginPath();
//               ctx.arc(180 / (ctrl.maxValue - ctrl.minValue) * (value - ctrl.minValue) + 5, 18, 5, 0, 360);
//               ctx.fillStyle = 'white';
//               ctx.fill();
//           });
//       };
//   }],
