import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

/**
 * AnimatedHeart komponens:
 * - Szív animáció like / unlike esetén
 * - Csillag effekttel (csak like-ra)
 * - Nincs árnyék, nincs felesleges mozgás reloadkor
 */

const AnimatedHeart = ({ isLiked, onClick, disabled, likeCount }) => {
  const [animate, setAnimate] = useState(false);
  const [showSparkle, setShowSparkle] = useState(false);
  const prevLiked = useRef(isLiked);

  // Like gomb kattintás
  const handleClick = () => {
    setAnimate(true);

    // ✨ Csillag csak akkor, ha új like történik
    if (!isLiked) {
      setShowSparkle(true);
      setTimeout(() => setShowSparkle(false), 500);
    }

    onClick();

    // Animáció reset
    setTimeout(() => setAnimate(false), 400);
  };

  // Csak a kattintás utáni változásra reagáljon, ne renderkor
  useEffect(() => {
    prevLiked.current = isLiked;
  }, [isLiked]);

  return (
    <motion.button
      className="heart-btn-modal"
      onClick={handleClick}
      disabled={disabled}
      whileTap={{ scale: 0.9 }}
      style={{
        position: "relative",
        border: "none",
        background: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: 0,
      }}
    >
      <motion.div
        initial={false}
        animate={
          animate
            ? {
                scale: isLiked ? [1, 1.4, 1] : [1, 0.7, 1],
                rotate: isLiked ? [0, 10, -10, 0] : [0, 0, 0, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <Heart
          size={26}
          fill={isLiked ? "#e84118" : "none"}
          color="#e84118"
          style={{
            transition: "fill 0.25s ease",
            filter: "none", // nincs piros árnyék
          }}
        />
      </motion.div>

      {/* ✨ Csillag effekt – csak LIKE esetén */}
      <AnimatePresence>
        {showSparkle && (
          <motion.span
            key="sparkle"
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: [0, 1.3, 1],
              opacity: [1, 0.8, 0],
              y: [-5, -15, -25],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#ff7675",
              fontSize: "14px",
              pointerEvents: "none",
            }}
          >
            ✨
          </motion.span>
        )}
      </AnimatePresence>

      {/* Like szám */}
      <span
        className="ms-1"
        style={{
          color: "#111",
          fontSize: "14px",
          verticalAlign: "middle",
          marginLeft: "6px",
        }}
      >
        {likeCount}
      </span>
    </motion.button>
  );
};

export default AnimatedHeart;
