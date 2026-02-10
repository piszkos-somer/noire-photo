import React from "react";
import "../css/UserResultCard.css";

const fallbackAvatar =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2b2b2b"/>
        <stop offset="1" stop-color="#111"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="80" cy="62" r="28" fill="#444"/>
    <rect x="32" y="102" width="96" height="44" rx="22" fill="#333"/>
  </svg>
`);

export default function UserResultCard({ user, onOpenProfile }) {
  const avatarUrl = user?.profile_picture
    ? `http://localhost:3001${user.profile_picture}`
    : fallbackAvatar;

  return (
    <div className="u-card" onClick={onOpenProfile} role="button" tabIndex={0}>
      <div className="u-glow" />

      <div className="u-left">
        <div className="u-avatar-wrap">
          <img
            className="u-avatar"
            src={avatarUrl}
            alt={user?.username || "user"}
            onError={(e) => {
              e.currentTarget.src = fallbackAvatar;
            }}
          />
          <div className="u-avatar-ring" />
        </div>
      </div>

      <div className="u-mid">
        <div className="u-title-row">
          <div className="u-name">{user?.username}</div>

          <div className="u-badges">
            {typeof user?.imageCount !== "undefined" && (
              <span className="u-pill">{user.imageCount} kép</span>
            )}
          </div>
        </div>

        <div className="u-bio" title={user?.bio || ""}>
          {user?.bio ? user.bio : "No bio yet"}
        </div>
      </div>

      <div className="u-right">
        <div className="u-cta">
          <span>Megtekintés</span>
          <span className="u-arrow">↗</span>
        </div>
      </div>
    </div>
  );
}
