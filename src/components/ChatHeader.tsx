
import React from "react";
import OctopusAvatar from "./OctopusAvatar";
import { Button } from "./ui/button";
import { Minus } from "lucide-react";

interface ChatHeaderProps {
  onMinimize: () => void;
}

const ChatHeader = ({ onMinimize }: ChatHeaderProps) => (
  <div className="relative bg-gradient-to-r from-ocean-600 to-ocean-700 p-4 border-b border-cyan-500">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30">
        <OctopusAvatar />
      </div>
      <div>
        <h3 className="text-white font-semibold text-lg">Ollie</h3>
        <p className="text-cyan-200 text-sm">Your diving companion</p>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-3 right-3 h-8 w-8 text-cyan-200 hover:text-white hover:bg-white/20"
      onClick={onMinimize}
      aria-label="Minimize chat"
    >
      <Minus className="h-5 w-5" />
    </Button>
  </div>
);

export default ChatHeader;
