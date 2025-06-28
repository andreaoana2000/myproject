import React from 'react';

export default function StyledMessageRenderer({ content }) {
  if (!content) return null;

  const renderStyledText = (text) => {
    // Handle bold text **text**
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');
    
    // Handle italic text *text*
    text = text.replace(/\*(.*?)\*/g, '<em class="italic text-foreground/90">$1</em>');
    
    // Handle underlined text __text__
    text = text.replace(/__(.*?)__/g, '<span class="underline decoration-primary decoration-2">$1</span>');
    
    // Handle strikethrough text ~~text~~
    text = text.replace(/~~(.*?)~~/g, '<span class="line-through text-muted-foreground">$1</span>');
    
    // Handle inline code `text`
    text = text.replace(/`(.*?)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border">$1</code>');
    
    // Handle code blocks ```text```
    text = text.replace(/```([\s\S]*?)```/g, '<pre class="bg-muted p-3 rounded-lg border overflow-x-auto"><code class="font-mono text-sm">$1</code></pre>');
    
    // Handle line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
  };

  return (
    <div
      className="styled-message whitespace-pre-wrap break-words"
      style={{ fontFamily: '"Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif' }}
      dangerouslySetInnerHTML={{ __html: renderStyledText(content) }}
    />
  );
}