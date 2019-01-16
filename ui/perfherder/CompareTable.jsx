import React from 'react';
import { Table, UncontrolledTooltip } from 'reactstrap';
import { react2angular } from 'react2angular/index.es2015';
import PropTypes from 'prop-types';

import perf from '../js/perf';
import { displayNumber } from './helpers';
import SimpleTooltip from '../shared/SimpleTooltip';

export default class CompareTable extends React.Component {
  getCompareClass = (data, type) => {  
    if (data.isEmpty) return 'subtest-empty';
    if (type === 'row' && data.highlightedTest) return 'active subtest-highlighted';
    if (type === 'bar' && data.isRegression) return 'bar-regression';
    if (type === 'bar' && data.isImprovement) return 'bar-improvement';
    if (type === 'bar' || type === 'row') return '';
    return data.className;
  }

  deltaTooltipText = (delta, deltaPercentage) => `Mean difference: ${delta} (= ${deltaPercentage}% better)`;

  render() {
    const { compareResults } = this.props;
    return (
      Object.entries(compareResults).map(([testName, data]) =>
      <Table sz="small" className="compare-table" key={testName}>
        <thead>
          <tr className="subtest-header">
            <th className="text-left"><span className="word-wrap break-word">{testName}</span></th>
            <th style={{ width: "140px" }}>Base</th>
            {/* empty for less than/greater than data */}
            <th style={{ width: "30px" }} />
            <th style={{ width: "140px" }}>New</th>
            <th style={{ width: "80px" }}>Delta</th>
            {/* empty for graphical difference */}
            <th style={{ width: "120px" }} />
            <th style={{ width: "100px" }}>Confidence</th>
            <th className="num-runs" style={{ width: "80px" }}># Runs</th>
            {/* empty for warning message, if not enough data */}
            <th className="text-left" style={{ width: "30px" }} />
          </tr>
        </thead>
        <tbody>
        {data.map((results, index) =>
        <tr key={index} className={this.getCompareClass(results, 'row')}>
          <th className="text-left font-weight-normal">{results.name}
            {results.links &&
            <span className="result-links">
              {results.links.map(link => <span key={link.title}><a href={link.href}>{` ${link.title}`}</a></span>)}
            </span>}
          </th>
          <td>
          {/* <ph-average value="{{compareResult.originalValue}}"
                      stddev="{{compareResult.originalStddev}}"
                      stddevpct="{{compareResult.originalStddevPct}}"
                      replicates="compareResult.originalRuns"></ph-average> */}
          </td>
          <td>
            {results.originalValue < results.newValue &&
            <span className={this.getCompareClass(results)}>
              &lt;
            </span>}
            {results.originalValue > results.newValue &&
            <span className={this.getCompareClass(results)}>
              &gt;
            </span>}
          </td>
          <td>
            {/* <ph-average value="{{compareResult.newValue}}"
                        stddev="{{compareResult.newStddev}}"
                        stddevpct="{{compareResult.newStddevPct}}"
                        replicates="compareResult.newRuns"></ph-average> */}
          </td>
          <td className={this.getCompareClass(results)}>
          {results.delta && results.newIsBetter &&
          <SimpleTooltip 
            textClass="detail-hint"
            text={displayNumber(results.deltaPercentage)}
            tooltipText={this.deltaTooltipText(displayNumber(results.delta), Math.abs(results.deltaPercentage))}
            placement="top"
          />}
          {/* <span ng-if="compareResult.delta  && !compareResult.newIsBetter" class="detail-hint" uib-tooltip="Mean difference: {{compareResult.delta|displayNumber}} (= {{compareResult.deltaPercentage|absoluteValue|displayNumber}}% worse)">
            {{compareResult.deltaPercentage|displayNumber}}%
          </span> */}
        </td>

        </tr>)}
        </tbody>
      </Table>)
    );
  }
}

CompareTable.propTypes = {
  titles: PropTypes.shape({}).isRequired,
  compareResults: PropTypes.shape({}).isRequired,
  testList: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  frameworks: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  filterOptions: PropTypes.shape({}).isRequired,
  filterByFramework: PropTypes.number.isRequired,
};

perf.component(
  'compareTable',
  react2angular(CompareTable, ['compareResults', 'titles', 'testList', 'frameworks', 'filterOptions', 'filterByFramework'], []),
);
