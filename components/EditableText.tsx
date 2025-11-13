
import React, { useState, useRef, useEffect } from 'react';
import { PencilIcon } from './icons';

interface EditableTextProps {
  isAdmin: boolean;
  initialText: string | null | undefined;
  onSave: (newText: string) => void;
  textarea?: boolean;
}

const EditableText: React.FC<EditableTextProps> = ({ isAdmin, initialText, onSave, textarea = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(initialText || '');
  }, [initialText]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
        // Move cursor to the end
        inputRef.current.selectionStart = inputRef.current.value.length;
        inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }, [isEditing]);
  
  const handleSave = () => {
    setIsEditing(false);
    if (text !== initialText) {
      onSave(text);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSave();
    } else if (e.key === 'Escape') {
        setIsEditing(false);
        setText(initialText || ''); // Revert changes
    }
  };

  if (!isAdmin) {
    const baseClasses = textarea 
      ? "text-gray-700 leading-relaxed" 
      : "text-2xl text-gray-800 font-bold bg-gray-100 p-6 rounded-lg leading-relaxed";
      
    const displayText = textarea ? (text || '').split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>) : text;

    return <div className={baseClasses}>{displayText}</div>;
  }

  if (isEditing) {
    return (
      <textarea
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans text-base leading-relaxed"
        rows={textarea ? 5 : 3}
      />
    );
  }

  return (
    <div className="relative group">
        <div className={textarea ? "text-gray-700 leading-relaxed" : "text-2xl text-gray-800 font-bold bg-gray-100 p-6 rounded-lg leading-relaxed"}>
         {textarea ? (text || '').split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>) : text}
        </div>
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-0 right-0 p-1 bg-gray-200 rounded-full text-gray-600 hover:bg-blue-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        title="تعديل"
      >
        <PencilIcon className="h-4 w-4" />
        <span className="sr-only">تعديل</span>
      </button>
    </div>
  );
};

export default EditableText;
