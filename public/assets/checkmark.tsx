import React from "react";

interface CheckmarkIconProps extends React.SVGProps<SVGSVGElement> {}

const CheckmarkIcon: React.FC<CheckmarkIconProps> = ({
  className,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-5 h-5 ${className}`}
      {...props}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
};

export default CheckmarkIcon;
