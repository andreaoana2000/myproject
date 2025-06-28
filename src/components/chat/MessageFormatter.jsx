
import React from 'react';

export default function MessageFormatter({ content, styles = {} }) {
  const { activeStyles = [], textColor, fontSize } = styles;

  // Parse markdown-style formatting
  const parseMarkdown = (text) => {
    if (!text) return text;

    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic: *text*
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
    
    // Underline: __text__
    text = text.replace(/__(.*?)__/g, '<u>$1</u>');
    
    // Strikethrough: ~~text~~
    text = text.replace(/~~(.*?)~~/g, '<del>$1</del>');
    
    // Code: `text`
    text = text.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 rounded font-mono text-sm">$1</code>');
    
    // Quote: > text
    text = text.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-3 italic text-muted-foreground">$1</blockquote>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');

    return text;
  };

  const getClasses = () => {
    let classes = 'whitespace-pre-wrap break-words';
    
    if (fontSize === 'small') classes += ' text-sm';
    else if (fontSize === 'large') classes += ' text-lg';
    else if (fontSize === 'xl') classes += ' text-xl';
    
    return classes;
  };

  const getStyles = () => {
    const inlineStyles = {};
    if (textColor && textColor !== '#ffffff') {
      inlineStyles.color = textColor;
    }
    return inlineStyles;
  };

  return (
    <div 
      className={getClasses()}
      style={getStyles()}
      dangerouslySetInnerHTML={{ 
        __html: parseMarkdown(content) 
      }}
    />
  );
}
