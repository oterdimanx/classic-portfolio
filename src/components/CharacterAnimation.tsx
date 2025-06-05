import React from "react";

const frames = [
  "/char_frame_00.png",
  "/char_frame_01.png",
  "/char_frame_02.png",
  "/char_frame_03.png",
  "/char_frame_04.png",
  "/char_frame_05.png",
  "/char_frame_06.png",
  "/char_frame_07.png",
];

export const CharacterAnimation = () => {
  return (
    <div className="w-[32px] h-[79px] relative overflow-hidden">
      <div className="absolute top-10 left-0 w-full h-full animate-character" />
      <style jsx>{`
        @keyframes characterFrames {
          0% { background-image: url(${frames[0]}); }
          12.5% { background-image: url(${frames[1]}); }
          25% { background-image: url(${frames[2]}); }
          37.5% { background-image: url(${frames[3]}); }
          50% { background-image: url(${frames[4]}); }
          62.5% { background-image: url(${frames[5]}); }
          75% { background-image: url(${frames[6]}); }
          87.5% { background-image: url(${frames[7]}); }
          100% { background-image: url(${frames[0]}); }
        }

        .animate-character {
          animation: characterFrames 1.2s steps(1) infinite;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center;
        }
      `}</style>
    </div>
  );
};