
import React from "react";

const OctopusAvatar = ({ size = 48 }: { size?: number }) => (
  <div
    className="flex items-center justify-center select-none"
    style={{ width: size, height: size }}
  >
    <img
      src="/lovable-uploads/37109d82-72ca-42ab-82e2-b91042823a05.png"
      alt="Cute Octopus"
      className="object-contain rounded-full bg-transparent max-w-full max-h-full"
      draggable={false}
      width={size}
      height={size}
    />
  </div>
);

export default OctopusAvatar;
