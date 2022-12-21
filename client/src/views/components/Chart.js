// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { useSearchParams } from 'react-router-dom';
import { sub } from 'date-fns';
import * as V from 'victory';
import {
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryTheme,
  VictoryScatter,
  VictoryAxis,
  VictoryZoomContainer,
} from 'victory';
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
import valuesService from '../../services/values.service';

const Chart = ({ property, nodesToCompare }) => {
  const ref = useRef();
  const [searchParams, setSearchParams] = useSearchParams();

  let startRange = '';
  let startX = 0;

  const [selectedSensorsData, setSelectedSensorsData] = useState([]);

  const query = Object.fromEntries([...searchParams]);

  const getNodeData = async (node) => {
    const dateFrom = !!parseInt(query.from)
      ? new Date(parseInt(query.from))
      : sub(new Date(), {
          years: 1,
        });
    const dateTo = !!parseInt(query.to)
      ? new Date(parseInt(query.to))
      : new Date();
    try {
      let res = await valuesService.get(node, dateFrom, dateTo);
      console.log('res', await res);
      return res;
    } catch (err) {
      console.log('err', err);
    }
  };

  const getDataFromNodes = async (nodes) => {
    Promise.all(nodes.map(async (n) => await getNodeData(n))).then((res) => {
      setSelectedSensorsData(
        res.map((r) => ({ id: r.node_id, value: getData(r) }))
      );
    });
  };

  useEffect(() => {
    if (
      nodesToCompare.some(
        (node) =>
          (node.type.toLowerCase() === 'humitempmoisture' &&
            ['moisture', 'temperature', 'humidity'].includes(property)) ||
          node.type === property
      )
    ) {
      getDataFromNodes(nodesToCompare);
    }
  }, [nodesToCompare]);

  const getData = (value) => {
    let v = value.sort((a, b) => a.time.localeCompare(b.time));
    if (v.length > 100) {
      const k = Math.ceil(v.length / 50);
      return v.filter((d, i) => i % k === 0);
    }
    return v;
  };

  const getMax = (selectedSensorsData, type) => {
    const max = Math.max(
      ...selectedSensorsData.map((e) =>
        Math.max(
          ...e?.value
            ?.filter((v) => (type === 'temperature' ? v[property] < 30 : !!v))
            .map((v) => v[property])
        )
      )
    );

    return max;
  };

  return (
    <>
      <h3 className={styles.title}>{`${property
        .substring(0, 1)
        .toUpperCase()}${property.substring(1).toLowerCase()}`}</h3>
      {!!selectedSensorsData.length ? (
        <VictoryChart
          maxDomain={{ y: getMax(selectedSensorsData, property) * 1.2 }}
          containerComponent={<VictoryZoomContainer />}
        >
          <VictoryGroup colorScale={'qualitative'}>
            {!!selectedSensorsData.length &&
              selectedSensorsData.map((sensorData, index) => {
                const data = sensorData.value.map((v) => ({
                  ...v,
                  time: new Date(Date.parse(v.time)),
                }));
                return (
                  data && (
                    <VictoryLine
                      y={property}
                      x="time"
                      style={{
                        data: {
                          stroke: `rgb(${38 * index}, ${155 * index}, ${
                            96 * index
                          })`,
                        },
                        parent: { border: '1p x solid #ccc' },
                      }}
                      data={data}
                    />
                  )
                );
              })}
          </VictoryGroup>
        </VictoryChart>
      ) : (
        <p style={{ textAlign: 'center' }}>(keine Daten vorhanden)</p>
      )}
    </>
  );
};

Chart.propTypes = {
  property: PropTypes.string.isRequired,
  nodesToCompare: PropTypes.array,
};

export default Chart;
