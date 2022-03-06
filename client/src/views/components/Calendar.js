// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Calendar.module.scss';
import { getEndTime, getStartTime } from '../../state/selectors/time.selector';
import {
  setTimeEnd,
  setTimeRangeEnd,
  setTimeRangeStart,
  setTimeStart,
} from '../../state/actions/time.action';
import { filterNodes } from '../../state/actions/nodes.action';

const ONE_SECOND = 1000;

const Calendar = ({ showCalendar }) => {
  const startTime = useSelector(getStartTime);
  const endTime = useSelector(getEndTime);

  const dispatch = useDispatch();

  const formatDate = (timestamp) => {
    const day = `${timestamp.getDate() < 10 ? '0' : ''}${timestamp.getDate()}`;
    const monthValue = timestamp.getMonth() + 1;
    const month = `${monthValue < 10 ? '0' : ''}${monthValue}`;
    let year = timestamp.getFullYear();
    if (year < 10) {
      year = `000${year}`;
    } else if (year < 100) {
      year = `00${year}`;
    } else if (year < 1000) {
      year = `0${year}`;
    }
    const date = `${year}-${month}-${day}`;
    return `${date}T${timestamp.toTimeString().split(' ')[0]}`;
  };

  const validDate = (date) => {
    return date && !Number.isNaN(date);
  };

  const changeRangeStart = (event) => {
    const rangeDate = new Date(event.target.value);
    if (
      validDate(rangeDate) &&
      rangeDate.getTime() < endTime.getTime() - ONE_SECOND
    ) {
      dispatch(setTimeStart(rangeDate));
      dispatch(setTimeRangeStart(rangeDate));
      dispatch(filterNodes);
    }
  };

  const changeRangeEnd = (event) => {
    const rangeDate = new Date(event.target.value);
    if (
      validDate(rangeDate) &&
      startTime.getTime() + ONE_SECOND < rangeDate.getTime()
    ) {
      dispatch(setTimeEnd(rangeDate));
      dispatch(setTimeRangeEnd(rangeDate));
      dispatch(filterNodes);
    }
  };

  return (
    <div
      className={`${styles.container} ${
        showCalendar ? '' : styles.containerHidden
      }`}
    >
      <label
        htmlFor="rangeStartInput"
        className={`${styles.labelFrom} ${styles.label}`}
      >
        Von:
        <input
          id="rangeStartInput"
          type="datetime-local"
          value={formatDate(startTime)}
          onChange={changeRangeStart}
          max={formatDate(new Date(new Date(endTime).getTime() - ONE_SECOND))}
        />
      </label>
      <label
        htmlFor="rangeEndInput"
        className={`${styles.labelTo} ${styles.label}`}
      >
        Bis:
        <input
          id="rangeEndInput"
          type="datetime-local"
          value={formatDate(endTime)}
          onChange={changeRangeEnd}
          min={formatDate(new Date(new Date(startTime).getTime() - ONE_SECOND))}
        />
      </label>
    </div>
  );
};

Calendar.propTypes = {
  showCalendar: PropTypes.bool,
};

Calendar.defaultProps = {
  showCalendar: false,
};

export default Calendar;
