import React from 'react';
import { Table } from 'reactstrap';
import { react2angular } from 'react2angular/index.es2015';
import PropTypes from 'prop-types';

import perf from '../js/perf';
import SimpleTooltip from '../shared/SimpleTooltip';

import { displayNumber } from './helpers';
import TableAverage from './TableAverage';

export default class CompareTable extends React.Component {
  getCompareClass = (data, type) => {
    if (data.isEmpty) return 'subtest-empty';
    if (type === 'row' && data.highlightedTest)
      return 'active subtest-highlighted';
    if (type === 'bar' && data.isRegression) return 'bar-regression';
    if (type === 'bar' && data.isImprovement) return 'bar-improvement';
    if (type === 'bar' || type === 'row') return '';
    return data.className;
  };

  deltaTooltipText = (delta, percentage, improvement) =>
    `Mean difference: ${displayNumber(delta)} (= ${Math.abs(
      displayNumber(percentage),
    )}% ${improvement ? 'better' : 'worse'})`;

  render() {
    const { compareResults } = this.props;

    return Object.entries(compareResults).map(([testName, data]) => (
      <Table sz="small" className="compare-table" key={testName}>
        <thead>
          <tr className="subtest-header">
            <th className="text-left">
              <span className="word-wrap break-word">{testName}</span>
            </th>
            <th style={{ width: '140px' }}>Base</th>
            {/* empty for less than/greater than data */}
            <th style={{ width: '30px' }} />
            <th style={{ width: '140px' }}>New</th>
            <th style={{ width: '80px' }}>Delta</th>
            {/* empty for graphical difference */}
            <th style={{ width: '120px' }} />
            <th style={{ width: '100px' }}>Confidence</th>
            <th className="num-runs" style={{ width: '80px' }}>
              # Runs
            </th>
            {/* empty for warning message, if not enough data */}
            <th className="text-left" style={{ width: '30px' }} />
          </tr>
        </thead>
        <tbody>
          {data.map(results => (
            <tr
              key={results.name}
              className={this.getCompareClass(results, 'row')}
            >
              <th className="text-left font-weight-normal">
                {results.name}
                {results.links && (
                  <span className="result-links">
                    {results.links.map(link => (
                      <span key={link.title}>
                        <a href={link.href}>{` ${link.title}`}</a>
                      </span>
                    ))}
                  </span>
                )}
              </th>
              <TableAverage
                value={results.originalValue}
                stddev={results.originalStddev}
                stddevpct={results.originalStddevPct}
                replicates={results.originalRuns}
              />
              <td>
                {results.originalValue < results.newValue && (
                  <span className={this.getCompareClass(results)}>&lt;</span>
                )}
                {results.originalValue > results.newValue && (
                  <span className={this.getCompareClass(results)}>&gt;</span>
                )}
              </td>
              <td>
                {/* <ph-average value="{{compareResult.newValue}}"
                        stddev="{{compareResult.newStddev}}"
                        stddevpct="{{compareResult.newStddevPct}}"
                        replicates="compareResult.newRuns"></ph-average> */}
              </td>
              <td className={this.getCompareClass(results)}>
                {results.delta &&
                  Math.abs(displayNumber(results.deltaPercentage)) !== 0 && (
                    <SimpleTooltip
                      textClass="detail-hint"
                      text={displayNumber(results.deltaPercentage)}
                      tooltipText={this.deltaTooltipText(
                        results.delta,
                        results.deltaPercentage,
                        results.newIsBetter,
                      )}
                      placement="top"
                    />
                  )}
                {results.delta &&
                  Math.abs(displayNumber(results.deltaPercentage)) === 0 && (
                    <span>{displayNumber(results.deltaPercentage)}</span>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    ));
  }
}

CompareTable.propTypes = {
  titles: PropTypes.shape({}).isRequired,
  compareResults: PropTypes.shape({}).isRequired,
  // testList: PropTypes.arrayOf(PropTypes.string).isRequired,
  // frameworks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  // filterOptions: PropTypes.shape({}).isRequired,
  // filterByFramework: PropTypes.number.isRequired,
};

perf.component(
  'compareTable',
  react2angular(
    CompareTable,
    [
      'compareResults',
      'titles',
      'testList',
      'frameworks',
      'filterOptions',
      'filterByFramework',
    ],
    [],
  ),
);
