import React from 'react';
import PropTypes from 'prop-types';

import SimpleTooltip from '../shared/SimpleTooltip';
import DistributionGraph from './DistributionGraph';

import { displayNumber } from './helpers';

const TableAverage = ({ value, stddev, stddevpct, replicates }) => {
  let tooltipText;
  if (replicates.length > 1) {
    tooltipText = `Runs: < ${replicates.join(' ')} > ${displayNumber(
      stddev,
    )} = ${displayNumber(stddevpct)}% standard deviation)`;
  } else if (replicates.length === 1) {
    tooltipText = 'Only one run (consider more for greater confidence)';
  }
  return (
    <td>
      {tooltipText ? (
        <SimpleTooltip
          textClass="detail-hint"
          text={`${displayNumber(value)} ${'\u00B1'} ${displayNumber(stddevpct)}`}
          tooltipText={
            replicates.length &&
            <DistributionGraph replicates={replicates} />
          }
          placement="top"
          tooltipClassName={
            replicates.length > 1 ? 'compare-table-tooltip' : ''
          }
        />
      ) : (
        <span className="text-muted">No results</span>
      )}
    </td>
  );
};

TableAverage.propTypes = {
  value: PropTypes.number.isRequired,
  stddev: PropTypes.number.isRequired,
  stddevpct: PropTypes.number.isRequired,
  replicates: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default TableAverage;
// <!-- Show standard deviation if >1 run -->
// <span class="detail-hint" ng-if="$ctrl.replicates.length > 1"
//       uib-tooltip-template="'partials/perf/tooltipgraphs.html'" tooltip-class="compare-table-tooltip">
//   {{$ctrl.value|displayNumber}} &#177; {{$ctrl.stddevpct|displayNumber}}%
// </span>
// <!-- View for only 1 run (no stddev) -->
// <span class="detail-hint" ng-if="$ctrl.replicates.length === 1"
//       uib-tooltip="Only one run (consider more for greater confidence)">
//   {{$ctrl.value|displayNumber}}
// </span>
// <span class="text-muted" ng-if="!$ctrl.replicates || $ctrl.replicates.length == 0">
//   No results
// </span>
