import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

/**
 * AnimatedCommentHeart:
 * - animál like és unlike esetén
 * - nincs csillag
 * - szív pirosra vált like-nál
 * - like szám fekete
 */

const AnimatedCommentHeart = ({ isLiked, onClick, disabled, likeCount }) => {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    onClick();
    setTimeout(() => setAnimate(false), 400);
  };

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
                scale: isLiked ? [1, 1.3, 1] : [1, 0.8, 1],
                rotate: isLiked ? [0, 8, -8, 0] : [0, 0, 0, 0],
              }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <Heart
          size={18}
          fill={isLiked ? "#e84118" : "none"}
          color="#e84118"
          style={{
            transition: "fill 0.25s ease",
            filter: "none",
          }}
        />
      </motion.div>

      <span
        className="ms-1"
        style={{
          color: "#000", // fekete
          fontSize: "13px",
          verticalAlign: "middle",
          marginLeft: "4px",
          userSelect: "none",
        }}
      >
        {likeCount}
      </span>
    </motion.button>
  );
};

export default AnimatedCommentHeart;
