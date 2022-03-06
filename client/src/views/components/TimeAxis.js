// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { filterNodes } from '../../state/actions/nodes.action';
import {
  setTimeEnd,
  setTimeRangeEnd,
  setTimeRangeStart,
  setTimeStart,
} from '../../state/actions/time.action';
import {
  getTimeRangeStart,
  getTimeRangeEnd,
  getStartTime,
  getEndTime,
} from '../../state/selectors/time.selector';
import Calendar from './Calendar';
import styles from './TimeAxis.module.scss';

const twoDaysAgo = new Date(new Date().setDate(new Date().getDate() - 2));

const TimeAxis = () => {
  const [percentFrom, setPercentFrom] = useState(0);
  const [percentTo, setPercentTo] = useState(100);

  const [leftThumbHover, setLeftThumbHover] = useState(false);
  const [rightThumbHover, setRightThumbHover] = useState(false);
  const [leftThumbFocus, setLeftThumbFocus] = useState(false);
  const [rightThumbFocus, setRightThumbFocus] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);

  const rangeStart = useSelector(getTimeRangeStart);
  const rangeEnd = useSelector(getTimeRangeEnd);
  const startTime = useSelector(getStartTime);
  const endTime = useSelector(getEndTime);

  const [queryParams] = useSearchParams();

  const dispatch = useDispatch();

  const dateFromPercent = (percent) =>
    new Date(
      rangeStart.getTime() +
        (rangeEnd.getTime() - rangeStart.getTime()) * (percent / 100)
    );

  const percentFromDate = (date) => {
    return (
      ((new Date(date).getTime() - rangeStart.getTime()) /
        (rangeEnd.getTime() - rangeStart.getTime())) *
      100
    );
  };

  const onFromChange = (event) => {
    const min = Number.parseInt(event.target.min, 10);
    const max = percentTo - 1;
    const percent = Number.parseInt(event.target.value, 10);
    const newPercent = Math.max(min, Math.min(max, percent));
    const start = dateFromPercent(newPercent);
    dispatch(setTimeStart(start));
  };

  const onToChange = (event) => {
    const min = percentFrom + 1;
    const max = Number.parseInt(event.target.max, 10);
    const percent = Number.parseInt(event.target.value, 10);
    const newPercent = Math.max(min, Math.min(max, percent));
    const end = dateFromPercent(newPercent);
    dispatch(setTimeEnd(end));
  };

  useEffect(() => {
    setPercentFrom(percentFromDate(startTime));
  }, [rangeStart, startTime]);

  useEffect(() => {
    setPercentTo(percentFromDate(endTime));
  }, [rangeEnd, endTime]);

  useEffect(() => {
    const start = queryParams.get('from');
    const end = queryParams.get('to');
    if (start) {
      const startTimeStamp = new Date(Number.parseInt(start, 10));
      dispatch(setTimeRangeStart(startTimeStamp));
      dispatch(setTimeStart(startTimeStamp));
    } else {
      dispatch(setTimeRangeStart(twoDaysAgo));
      dispatch(setTimeStart(twoDaysAgo));
    }

    if (end) {
      const endTimeStamp = new Date(Number.parseInt(end, 10));
      dispatch(setTimeEnd(endTimeStamp));
      dispatch(setTimeRangeEnd(endTimeStamp));
    } else {
      dispatch(setTimeEnd(new Date()));
      dispatch(setTimeRangeEnd(new Date()));
    }
  }, []);

  return (
    <>
      <Calendar showCalendar={showCalendar} />
      <div className={styles.container}>
        <div
          className={styles.calendar}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <i className="far fa-calendar" />
        </div>
        <div className={styles.axisContainer}>
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="100"
            value={percentFrom}
            onChange={onFromChange}
            onMouseEnter={() => setLeftThumbHover(true)}
            onMouseLeave={() => setLeftThumbHover(false)}
            onMouseDown={() => setLeftThumbFocus(true)}
            onMouseUp={() => {
              setLeftThumbFocus(false);
              dispatch(filterNodes);
            }}
            onTouchStart={() => setLeftThumbFocus(true)}
            onTouchEnd={() => {
              setLeftThumbFocus(false);
              dispatch(filterNodes);
            }}
            onKeyUp={() => dispatch(filterNodes)}
          />
          <input
            className={styles.inputRange}
            type="range"
            min="0"
            max="100"
            value={percentTo}
            onChange={onToChange}
            onMouseEnter={() => setRightThumbHover(true)}
            onMouseLeave={() => setRightThumbHover(false)}
            onMouseDown={() => setRightThumbFocus(true)}
            onMouseUp={() => {
              setRightThumbFocus(false);
              dispatch(filterNodes);
            }}
            onTouchStart={() => setRightThumbFocus(true)}
            onTouchEnd={() => {
              setRightThumbFocus(false);
              dispatch(filterNodes);
            }}
            onKeyUp={() => dispatch(filterNodes)}
          />
          <div className={styles.slider}>
            <div className={styles.track} />
            <div
              className={styles.range}
              style={{ left: `${percentFrom}%`, right: `${100 - percentTo}%` }}
            />
            <div
              className={`${styles.thumb} ${styles.left} ${
                leftThumbHover ? styles.hover : ''
              } ${leftThumbFocus ? styles.focus : ''}`}
              style={{ left: `${percentFrom}%` }}
            />
            <div
              className={`${styles.thumb} ${styles.right} ${
                rightThumbHover ? styles.hover : ''
              } ${rightThumbFocus ? styles.focus : ''}`}
              style={{ right: `${100 - percentTo}%` }}
            />
          </div>

          <div className={styles.labelFrom}>{startTime.toLocaleString()}</div>
          <div className={styles.labelTo}>{endTime.toLocaleString()}</div>
        </div>
      </div>
    </>
  );
};

export default TimeAxis;
