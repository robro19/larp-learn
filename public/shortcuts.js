const typingTags=/^(INPUT|TEXTAREA|SELECT)$/;
const nativeEnterTags=/^(BUTTON|A|INPUT|TEXTAREA|SELECT|SUMMARY)$/;
const isTyping=el=>Boolean(el)&&(el.isContentEditable||typingTags.test(el.tagName));
const pageShortcuts={
  campaign:{
    choices:'[data-scene-choice]:not([disabled])',
    footer:'[data-action="scene-check"]:not([disabled]),[data-action="scene-next"]:not([disabled])'
  },
  lesson:{
    choices:'[data-choice]:not([disabled])',
    footer:'[data-action="check"]:not([disabled]),[data-action="next"]:not([disabled])'
  }
};

export function handleShortcut(event,{page,root=document,activeElement=root.activeElement}={}){
  const shortcuts=pageShortcuts[page];
  if(!shortcuts||event.repeat||event.ctrlKey||event.metaKey||event.altKey)return false;
  if(isTyping(event.target)||isTyping(activeElement))return false;
  if(/^[1-9]$/.test(event.key)){
    const choices=[...root.querySelectorAll(shortcuts.choices)];
    const choice=choices[Number(event.key)-1];
    if(!choice)return false;
    event.preventDefault();
    choice.click();
    return true;
  }
  if(event.key==='Enter'){
    if(activeElement&&nativeEnterTags.test(activeElement.tagName))return false;
    const footer=root.querySelector(shortcuts.footer);
    if(!footer)return false;
    event.preventDefault();
    footer.click();
    return true;
  }
  return false;
}
