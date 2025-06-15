
import React from "react";
import OctopusAvatar from "./OctopusAvatar";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export const MessageBubble = ({ msg }: { msg: Message }) => (
  <div
    className={
      "flex " +
      (msg.sender === "user" ? "justify-end" : "justify-start")
    }
  >
    {msg.sender === "ai" && (
      <div className="w-8 h-8 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
        <OctopusAvatar size={28} />
      </div>
    )}
    <div
      className={
        "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-lg " +
        (msg.sender === "user"
          ? "bg-cyan-600 text-white"
          : "bg-ocean-800 text-ocean-100 border border-ocean-700")
      }
    >
      {msg.text}
    </div>
  </div>
);
