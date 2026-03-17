import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";

export default function MemberDashBoard() {
  const navigate = useNavigate();
  const { documentId } = useParams(); // 👈 MUST HAVE EVENT ID

  useEffect(() => {
    const socket = io("https://api.regeve.in");

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);

      socket.emit("join:event", documentId); // ✅ SAME NAME
    });

    socket.on("user:present", (data) => {
      console.log("🔥 Realtime:", data);

      navigate(
        `/${data.adminId}/member-details/${data.documentId}/${data.Member_ID}`,
      );
    });

    return () => socket.disconnect();
  }, [documentId]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Live Event Dashboard</h1>
      <p>Waiting for users...</p>
    </div>
  );
}
