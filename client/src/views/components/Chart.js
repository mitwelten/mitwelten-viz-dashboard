// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import getValues from '../../state/selectors/values.selector';
import {
  setTimeEnd,
  setTimeRangeEnd,
  setTimeRangeStart,
  setTimeStart,
} from '../../state/actions/time.action';
import { getEndTime, getStartTime } from '../../state/selectors/time.selector';
import styles from './Chart.module.scss';

const Chart = ({ property }) => {
  const ref = useRef();

  let startRange = '';
  let startX = 0;

  const dispatch = useDispatch();

  const values = useSelector(getValues);
  const startTime = useSelector(getStartTime);
  const endTime = useSelector(getEndTime);

  const valuesExist = () => {
    return values.length > 0 && values.some((value) => value[property] != null);
  };

  const drawChart = () => {
    d3.select(`svg#${property}`).remove();

    if (valuesExist()) {
      const dataSet = [...values]
        .map((data) => ({
          date: d3.isoParse(new Date(data.time).toISOString()),
          value: data[property],
        }))
        .filter((data) => data.date != null && data.value != null);

      const margin = { top: 25, right: 2, bottom: 20, left: 25 };
      const width = ref.current.clientWidth - 25 - margin.left - margin.right;
      const height = 250 - margin.top - margin.bottom;

      const svg = d3
        .select(ref.current)
        .append('svg')
        .attr('id', property)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .style('user-select', 'none')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const x = d3
        .scaleTime()
        .domain(d3.extent(dataSet, (data) => data.date))
        .range([0, width]);

      svg
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x));

      const minValue = d3.min(dataSet, (data) => +data.value);
      const maxValue = d3.max(dataSet, (data) => +data.value);
      const yStart = minValue - (maxValue - minValue) * 0.1;

      const y = d3.scaleLinear().domain([yStart, maxValue]).range([height, 0]);

      svg.append('g').call(d3.axisLeft(y));

      svg
        .append('text')
        .attr('text-anchor', 'end')
        .attr('x', 0)
        .attr('y', -10)
        .attr('font-size', 'small')
        .text(`[${values[0][`${property}Unit`]}]`);

      const gradient = svg
        .append('defs')
        .append('linearGradient')
        .attr('id', 'chartGradient')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', 0)
        .attr('y2', 1);

      gradient
        .append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#15A413')
        .attr('stop-opacity', '30%');
      gradient
        .append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'white');

      svg
        .append('path')
        .datum(dataSet)
        .attr('fill', 'url(#chartGradient)')
        .attr('stroke', '#15A413')
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .area()
            .x((data) => x(data.date))
            .y0(y(yStart))
            .y1((data) => y(data.value))
        );

      const focus = svg
        .append('g')
        .append('circle')
        .style('fill', '#15A413')
        .attr('stroke', 'none')
        .attr('r', 4)
        .style('opacity', 0);

      const focusRect = svg
        .append('g')
        .append('rect')
        .style('opacity', 0)
        .style('filter', 'drop-shadow(rgba(0, 0, 0, 0.25) 0px 5px 3px)')
        .attr('stroke', '#ddd')
        .attr('fill', 'white')
        .attr('width', '10px')
        .attr('height', '10px');

      const focusText = svg
        .append('g')
        .append('text')
        .style('opacity', 0)
        .attr('fill', '#9C9C9C')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle');

      const timeSelection = svg
        .append('rect')
        .style('fill', 'black')
        .style('opacity', 0)
        .style('pointer-events', 'all')
        .style('cursor', 'crosshair')
        .attr('width', 0)
        .attr('height', height);

      svg
        .append('rect')
        .style('fill', 'none')
        .style('pointer-events', 'all')
        .style('cursor', 'crosshair')
        .attr('width', width)
        .attr('height', height)
        .on('mousemove', (event) => {
          const x0 = x.invert(d3.pointer(event)[0]);

          const copy = [...dataSet];
          copy.push({ date: x0 });
          copy.sort((a, b) => (a.date > b.date ? 1 : -1));
          const idx = copy.findIndex((data) => data.date === x0);
          const i = Math.max(idx - 1, 0);

          const selectedData = copy[i];

          if (selectedData.date != null && selectedData.value != null) {
            focusText.html(
              `${selectedData.value} ${values[0][`${property}Unit`]}`
            );

            const labelX = x(selectedData.date);
            const labelY = y(selectedData.value) - 15;

            focus.attr('cx', labelX).attr('cy', labelY + 15);

            const frameWidth = focusText.node().getBBox().width;
            const frameHeight = focusText.node().getBBox().height;

            const labelXOffsetted = Math.max(
              Math.min(width - frameWidth / 2, labelX),
              frameWidth / 2 + 1
            );

            focusText.attr('x', labelXOffsetted).attr('y', labelY);

            focusRect
              .attr('x', labelXOffsetted - frameWidth / 2 - 3)
              .attr('y', labelY - frameHeight / 2 - 2)
              .attr('width', frameWidth + 6)
              .attr('height', frameHeight);

            focus.style('opacity', 1);
            focusRect.style('opacity', 1);
            focusText.style('opacity', 1);

            if (startRange) {
              timeSelection
                .style('opacity', 0.5)
                .attr('width', Math.abs(startX - labelX))
                .attr('x', Math.min(startX, labelX));
            } else {
              timeSelection.style('opacity', 0);
            }
          } else {
            focus.style('opacity', 0);
            focusRect.style('opacity', 0);
            focusText.style('opacity', 0);
          }
        })
        .on('mouseout', () => {
          focus.style('opacity', 0);
          focusRect.style('opacity', 0);
          focusText.style('opacity', 0);
        })
        .on('mousedown', (event) => {
          startRange = x.invert(d3.pointer(event)[0]);

          const copy = [...dataSet];
          copy.push({ date: startRange });
          copy.sort((a, b) => (a.date > b.date ? 1 : -1));
          const idx = copy.findIndex((data) => data.date === startRange);
          const i = Math.max(idx - 1, 0);

          startX = x(copy[i].date);

          timeSelection.attr('x', startX);
        })
        .on('mouseup', (event) => {
          const endRange = x.invert(d3.pointer(event)[0]);
          if (startRange && timeSelection.node().getBBox().width > 0) {
            const start = new Date(
              Math.min(
                new Date(startRange).getTime(),
                new Date(endRange).getTime()
              )
            );
            const end = new Date(
              Math.max(
                new Date(startRange).getTime(),
                new Date(endRange).getTime()
              )
            );
            dispatch(setTimeStart(start));
            dispatch(setTimeEnd(end));
          }
          startRange = '';
        })
        .on('wheel', (event) => {
          event.preventDefault();
          const difference = endTime.getTime() - startTime.getTime();
          const zoomDirection = event.wheelDelta < 0 ? 1 : -1;
          const delta = zoomDirection * Math.round(difference * 0.1);
          dispatch(setTimeStart(new Date(startTime.getTime() - delta)));
          dispatch(setTimeEnd(new Date(endTime.getTime() + delta)));
          dispatch(setTimeRangeStart(new Date(startTime.getTime() - delta)));
          dispatch(setTimeRangeEnd(new Date(endTime.getTime() + delta)));
        });
    }
  };

  const changedEvent = () => drawChart();

  useEffect(() => {
    drawChart();

    window.addEventListener('resize', changedEvent, false);

    return () => {
      window.removeEventListener('resize', changedEvent, false);
    };
  }, []);

  useEffect(() => drawChart(), [values]);

  return (
    <>
      {valuesExist() && (
        <>
          <h3 className={styles.title}>{`${property
            .substring(0, 1)
            .toUpperCase()}${property.substring(1).toLowerCase()}`}</h3>
          <div ref={ref} />
        </>
      )}
    </>
  );
};

Chart.propTypes = {
  property: PropTypes.string.isRequired,
};

export default Chart;
