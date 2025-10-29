/**
 * Copy text to clipboard with fallback for when Clipboard API is blocked
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // Fallback method using textarea (works everywhere)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // Make the textarea invisible and out of viewport
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    textArea.style.opacity = '0';
    textArea.style.pointerEvents = 'none';
    
    document.body.appendChild(textArea);
    
    // Select the text
    textArea.focus();
    textArea.select();
    
    // For iOS compatibility
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    
    textArea.setSelectionRange(0, textArea.value.length);
    
    // Try to copy using execCommand
    let successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (err) {
      // Silently fail
    }
    
    // Clean up
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    return false;
  }
};
