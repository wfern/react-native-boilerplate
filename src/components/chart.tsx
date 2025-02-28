import * as React from 'react';
import { Platform } from 'react-native';
import {
  DashPathEffect,
  LinearGradient,
  matchFont,
  vec,
} from '@shopify/react-native-skia';
import {
  CartesianChart,
  Line,
  Area as VictoryArea,
  Bar as VictoryBar,
} from 'victory-native';
import { InputFields, NumericalFields } from 'victory-native/dist/types';

import { colors } from '@/constants/colors';

const fontFamily = Platform.select({ ios: 'Helvetica', default: 'Sans-Serif' });
const fontStyle = {
  fontFamily,
  fontSize: 11,
};
const font = matchFont(fontStyle);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockedData = Array.from({ length: 31 }, (_, i) => ({
  day: i,
  tmp: 40 + 30 * Math.random(),
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockedDataTwo = [...Array(31)].map((_, index) => ({
  date: `2025-01-${index + 1}`,
  amount: '0.00',
  quantity: index + 1,
}));

const defaultAreaXAxis = {
  font,
  lineColor: 'transparent',
  formatXLabel: (label: any) => (label ? label : ''),
};

const defaultAreaYAxis = {
  font,
  linePathEffect: <DashPathEffect intervals={[4, 4]} />,
};

export function AreaChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  data,

  xKey,
  yKeys,

  xAxis,
  yAxis,

  domainPadding,

  ...props
}: Omit<
  React.ComponentProps<typeof CartesianChart<RawData, XK, YK>>,
  'children'
> & {
  children?: React.ReactNode;
}) {
  // const [animatedData, setAnimatedData] = React.useState(
  //   data.map((item) => ({
  //     ...item,
  //     [yKeys[0]]: 0,
  //   })) as RawData[],
  // );

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setAnimatedData(data);
  //   }, 0);
  // }, [data]);

  return (
    <CartesianChart
      data={data}
      xKey={xKey}
      yKeys={yKeys}
      xAxis={{
        ...defaultAreaXAxis,
        ...xAxis,
      }}
      yAxis={
        yAxis?.map((axis) => ({
          ...defaultAreaYAxis,
          ...axis,
        })) ?? [defaultAreaYAxis]
      }
      domainPadding={{
        top: 12,
        bottom: 12,
        left: 12,
        right: 12,
        ...(typeof domainPadding === 'object' && domainPadding),
      }}
      {...props}
    >
      {({ points, chartBounds }) => (
        <>
          <Line
            points={points[yKeys[0]]}
            color={colors.primary}
            strokeWidth={3}
            curveType="monotoneX"
            // animate={{ type: 'timing', duration: 300 }}
          />
          <VictoryArea
            points={points[yKeys[0]]}
            y0={chartBounds.bottom}
            color={colors.primary}
            curveType="monotoneX"
            // animate={{ type: 'timing', duration: 300 }}
          >
            <LinearGradient
              start={vec(0, chartBounds.top)}
              end={vec(0, chartBounds.bottom)}
              colors={[colors.primary, colors.card]}
            />
          </VictoryArea>
        </>
      )}
    </CartesianChart>
  );
}

const defaultBarXAxis = {
  font,
  lineColor: 'transparent',
  disableClipping: true,
  formatXLabel: (label: any) => (label ? label : ''),
};

const defaultBarYAxis = {
  font,
  linePathEffect: <DashPathEffect intervals={[4, 4]} />,
};

export function BarChart<
  RawData extends Record<string, unknown>,
  XK extends keyof InputFields<RawData>,
  YK extends keyof NumericalFields<RawData>,
>({
  data,

  xKey,
  yKeys,

  xAxis,
  yAxis,

  domainPadding,

  ...props
}: Omit<
  React.ComponentProps<typeof CartesianChart<RawData, XK, YK>>,
  'children'
> & {
  children?: React.ReactNode;
}) {
  // const [animatedData, setAnimatedData] = React.useState(
  //   data.map((item) => ({
  //     ...item,
  //     [yKeys[0]]: 0,
  //   })) as RawData[],
  // );

  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setAnimatedData(data);
  //   }, 0);
  // }, [data]);

  return (
    <CartesianChart
      data={data}
      xKey={xKey}
      yKeys={yKeys}
      xAxis={{
        ...defaultBarXAxis,
        ...xAxis,
      }}
      yAxis={
        yAxis?.map((axis) => ({
          ...defaultBarYAxis,
          ...axis,
        })) ?? [defaultBarYAxis]
      }
      domainPadding={{
        left: 46,
        right: 46,
        top: 12,
        bottom: 12,
        ...(typeof domainPadding === 'object' && domainPadding),
      }}
      {...props}
    >
      {({ points, chartBounds }) => (
        <>
          <VictoryBar
            points={points[yKeys[0]]}
            chartBounds={chartBounds}
            innerPadding={0.85}
            roundedCorners={{
              topLeft: 6,
              topRight: 6,
            }}
            // animate={{ type: 'timing', duration: 300 }}
          >
            <LinearGradient
              start={vec(0, chartBounds.top)}
              end={vec(0, chartBounds.bottom + 20)}
              colors={[colors.primary, colors.card]}
            />
          </VictoryBar>
        </>
      )}
    </CartesianChart>
  );
}
