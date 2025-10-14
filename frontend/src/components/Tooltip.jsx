import React, { useState } from "react";

const Tooltip = ({ children, content, position = "top" }) => {
  const [visible, setVisible] = useState(false);

  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {visible && (
        <div
          className={`absolute ${positionClasses[position]} bg-gray-800 text-white text-sm rounded px-2 py-1 z-50 whitespace-nowrap`}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
