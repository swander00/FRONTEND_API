export function getScrollableParents(element: HTMLElement) {
  const parents: HTMLElement[] = [];
  const seen = new Set<HTMLElement>();
  let current: HTMLElement | null = element.parentElement;

  while (current) {
    const style = window.getComputedStyle(current);
    const overflowY = style.overflowY || style.overflow;
    const isScrollable = /(auto|scroll|overlay)/.test(overflowY);

    if (isScrollable && current.scrollHeight > current.clientHeight && !seen.has(current)) {
      parents.push(current);
      seen.add(current);
    }

    current = current.parentElement;
  }

  const scrollingElement = document.scrollingElement as HTMLElement | null;
  if (scrollingElement && !seen.has(scrollingElement)) {
    parents.push(scrollingElement);
  }

  return parents;
}

