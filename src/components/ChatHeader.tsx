
import React from "react";
import OctopusAvatar from "./OctopusAvatar";

const ChatHeader = () => (
  <div className="bg-gradient-to-r from-ocean-600 to-ocean-700 p-4 border-b border-cyan-500">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30">
        <OctopusAvatar />
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">Ollie</h3>
        <p className="text-cyan-200 text-sm">Your diving companion</p>
      </div>
    </div>
  </div>
);

export default ChatHeader;
