export default function encode(data) {
  const buf = Buffer.from(data);
  const base64 = buf.toString('base64');
  return base64;
}
