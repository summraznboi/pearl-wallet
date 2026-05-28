import { Row } from '../Row';

// Pearl wordmark SVG (995x310 viewBox, ~3.2:1 aspect). Sized by height; the
// `width: auto` lets the aspect drive the horizontal extent. Both presets
// share the same asset and only differ in height. Opacity 0.8 matches the
// `colors.white_muted3` tone used by the "Enter your password" title so the
// wordmark doesn't outshine the surrounding text on the lock screen.
const ASPECT = 995 / 310;

export function Logo(props: { preset?: 'large' | 'small' }) {
  const height = props.preset === 'large' ? 56 : 36;
  return (
    <Row justifyCenter itemsCenter>
      <img
        src="./images/logo/pearl-wordmark.svg"
        alt="Pearl"
        style={{ height, width: height * ASPECT, display: 'block', opacity: 0.8 }}
      />
    </Row>
  );
}
