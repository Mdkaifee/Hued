import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const BackArrowSvg = props => (
  <Svg
    width={23}
    height={14}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M5.994.988a1 1 0 0 0-.687.303L.309 6.295a1 1 0 0 0 0 1.41l4.998 5.006a1.002 1.002 0 0 0 1.418-1.418L3.434 8.002H21A1 1 0 1 0 21 6H3.426l3.299-3.291a1 1 0 0 0-.73-1.72Z"
      fill={props.color ? props.color : '#272727'}
    />
  </Svg>
);

export default BackArrowSvg;
