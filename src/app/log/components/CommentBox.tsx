import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { faCheckCircle, faXmarkCircle } from "@fortawesome/free-regular-svg-icons";

const CommentBox = ({ onClose, onSave, onDelete }: { onClose: () => void; onSave: (comment: string) => void; onDelete: () => void }) => {
  const [comment, setComment] = useState("");

  const handleSave = () => {
    if (comment.trim()) {
      onSave(comment);
    }
  };

  const handleDelete = () => {
    setComment("");
    onDelete();
  };

  return (
    <div className="min-w-48 w-auto h-10 border rounded-full flex flex-row py-3 px-2 items-center justify-between outline-none">
      <input
        type="text"
        placeholder="any notes?"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-36 border rounded-full bg-gray-200 focus:outline-none pl-2 text-sm md:text-base"
      />
      {comment.length > 0 && (
        <button className="text-green-600 ml-2 text-sm sm:text-base md:text-lg" onClick={handleSave}>
          <FontAwesomeIcon icon={faCheckCircle} />
        </button>
      )}
      <button className="text-gray-700 ml-2 text-sm sm:text-base md:text-lg" onClick={handleDelete}>
        <FontAwesomeIcon icon={faXmarkCircle} />
      </button>
    </div>
  );
};

export default CommentBox;
