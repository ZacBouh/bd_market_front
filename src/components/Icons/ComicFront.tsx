const ComicFront = ({ size = 24, color = "currentColor" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 22 H72 V78 H22 Z" />
    <path d="M72 22 L78 28 V78 H72" />
  </svg>
);

export default ComicFront;
