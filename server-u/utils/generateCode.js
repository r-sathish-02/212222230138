export default function generateCode(length = 6) {
  return Math.random().toString(36).substr(2, length);
}
