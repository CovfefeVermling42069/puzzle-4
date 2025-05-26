import React, { useState, useRef, useCallback } from "react";
import puzzleImage from "./Puzzle_4.jpg";
import leftImage from "./Left.png";
import rightImage from "./Right.png";
import topLeftImage from "./TopLeft.png";
import topRightImage from "./TopRight.png";
import bottomLeftImage from "./BottomLeft.png";
import bottomRightImage from "./BottomRight.png";
import "./App.css";

// Define a type for puzzle pieces
interface PuzzlePiece {
  id: string;
  image: string;
  alt: string;
  width: string;
  top: string;
  left: string;
}

function App() {
  // Define all puzzle pieces with their positions
  const puzzlePieces: PuzzlePiece[] = [
    {
      id: "left",
      image: leftImage,
      alt: "Left Piece",
      width: "25.5%",
      top: "35.5%",
      left: "17%",
    },
    {
      id: "right",
      image: rightImage,
      alt: "Right Piece",
      width: "25.5%",
      top: "24%",
      left: "64%",
    },
    {
      id: "topLeft",
      image: topLeftImage,
      alt: "Top Left Piece",
      width: "25.5%",
      top: "5.5%",
      left: "21%",
    },
    {
      id: "topRight",
      image: topRightImage,
      alt: "Top Right Piece",
      width: "25.5%",
      top: "3%",
      left: "46%",
    },
    {
      id: "bottomLeft",
      image: bottomLeftImage,
      alt: "Bottom Left Piece",
      width: "25.5%",
      top: "60%",
      left: "33%",
    },
    {
      id: "bottomRight",
      image: bottomRightImage,
      alt: "Bottom Right Piece",
      width: "25.5%",
      top: "55%",
      left: "57%",
    },
  ];

  // State to track rotation angles for each piece
  const [rotations, setRotations] = useState<Record<string, number>>(
    puzzlePieces.reduce((acc, piece) => ({ ...acc, [piece.id]: 0 }), {})
  );

  // State to track which piece is being dragged
  const [activePiece, setActivePiece] = useState<string | null>(null);

  // References for drag handling
  const startPointRef = useRef({ x: 0, y: 0 });
  const startRotationRef = useRef(0);
  const pieceRefs = useRef<Record<string, HTMLImageElement | null>>({});

  // Handle mouse down to start rotation
  const handleMouseDown = (
    e: React.MouseEvent<HTMLImageElement>,
    pieceId: string
  ) => {
    e.preventDefault();
    setActivePiece(pieceId);

    // Store starting point
    startPointRef.current = {
      x: e.clientX,
      y: e.clientY,
    };

    // Store starting rotation
    startRotationRef.current = rotations[pieceId];
  };

  // Handle mouse move for rotation
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!activePiece || !pieceRefs.current[activePiece]) return;

      const pieceElement = pieceRefs.current[activePiece];

      // Get image center coordinates
      const rect = pieceElement!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate angles
      const startAngle = Math.atan2(
        startPointRef.current.y - centerY,
        startPointRef.current.x - centerX
      );
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX);

      // Calculate rotation in degrees
      let newRotation =
        startRotationRef.current +
        ((currentAngle - startAngle) * 180) / Math.PI;

      // Update rotation state for the active piece
      setRotations((prev) => ({
        ...prev,
        [activePiece]: newRotation,
      }));
    },
    [activePiece]
  );

  // Handle mouse up to end rotation
  const handleMouseUp = useCallback(() => {
    setActivePiece(null);
  }, []);

  // Add event listeners to document
  React.useEffect(() => {
    if (activePiece) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [activePiece, handleMouseMove, handleMouseUp]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="gothic-header">Puzzle 4</h1>
        <div
          style={{
            margin: "20px 0",
            maxWidth: "80%",
            position: "relative",
          }}
        >
          {/* Container for all puzzle pieces */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
            }}
          >
            {/* Render all puzzle pieces */}
            {puzzlePieces.map((piece) => (
              <img
                key={piece.id}
                ref={(el) => {
                  pieceRefs.current[piece.id] = el;
                  return undefined;
                }}
                src={piece.image}
                alt={piece.alt}
                style={{
                  width: piece.width,
                  position: "absolute",
                  top: piece.top,
                  left: piece.left,
                  transform: `rotate(${rotations[piece.id]}deg)`,
                  cursor: activePiece === piece.id ? "grabbing" : "grab",
                  transition:
                    activePiece === piece.id
                      ? "none"
                      : "transform 0.1s ease-out",
                  transformOrigin: "center center",
                }}
                onMouseDown={(e) => handleMouseDown(e, piece.id)}
              />
            ))}
          </div>

          {/* Original puzzle image */}
          <img
            src={puzzleImage}
            alt="Puzzle 4"
            style={{
              maxWidth: "100%",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      </header>
    </div>
  );
}

export default App;
