import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { gsap } from 'gsap';

interface TextTypeProps extends HTMLAttributes<HTMLElement> {
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

/**
 * A small typing treatment for headings. The text remains available through
 * aria-label, while the visual typing is progressively enhanced on the client.
 */
export default function TextType({
  text,
  as: Component = 'div',
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
  cursorClassName = '',
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text],
  );
  const fullText = textArray.join(' ');

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    return (
      Math.random() * (variableSpeed.max - variableSpeed.min) +
      variableSpeed.min
    );
  }, [typingSpeed, variableSpeed]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () =>
      setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () =>
      mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(textArray[0] ?? '');
      setCurrentCharIndex(textArray[0]?.length ?? 0);
      setIsDeleting(false);
      return;
    }

    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion, startOnVisible, textArray]);

  useEffect(() => {
    if (!showCursor || prefersReducedMotion || !cursorRef.current) return;

    const tween = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut',
    });

    return () => {
      tween.kill();
    };
  }, [cursorBlinkDuration, prefersReducedMotion, showCursor]);

  useEffect(() => {
    if (prefersReducedMotion || !isVisible) return;

    let timeout: ReturnType<typeof setTimeout> | undefined;
    const currentText = textArray[currentTextIndex] ?? '';
    const processedText = reverseMode
      ? [...currentText].reverse().join('')
      : currentText;

    if (isDeleting) {
      if (displayedText === '') {
        setIsDeleting(false);
        if (currentTextIndex === textArray.length - 1 && !loop) return;

        onSentenceComplete?.(currentText, currentTextIndex);
        setCurrentTextIndex((index) => (index + 1) % textArray.length);
        setCurrentCharIndex(0);
        return;
      }

      timeout = setTimeout(() => {
        setDisplayedText((value) => value.slice(0, -1));
      }, deletingSpeed);
    } else if (currentCharIndex < processedText.length) {
      const typingDelay =
        currentCharIndex === 0 && displayedText === ''
          ? initialDelay + getRandomSpeed()
          : getRandomSpeed();
      timeout = setTimeout(() => {
        setDisplayedText((value) => value + processedText[currentCharIndex]);
        setCurrentCharIndex((index) => index + 1);
      }, typingDelay);
    } else if (loop || currentTextIndex < textArray.length - 1) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [
    currentCharIndex,
    currentTextIndex,
    deletingSpeed,
    displayedText,
    getRandomSpeed,
    initialDelay,
    isDeleting,
    isVisible,
    loop,
    onSentenceComplete,
    pauseDuration,
    prefersReducedMotion,
    reverseMode,
    textArray,
  ]);

  const currentColor = textColors.length
    ? textColors[currentTextIndex % textColors.length]
    : undefined;
  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < (textArray[currentTextIndex]?.length ?? 0) ||
      isDeleting);

  return createElement(
    Component,
    {
      ...props,
      ref: containerRef,
      className: `inline-block whitespace-pre-wrap tracking-tight ${className}`,
      'aria-label': props['aria-label'] ?? fullText,
    },
    <span className="inline" style={{ color: currentColor }}>
      {prefersReducedMotion ? textArray[0] : displayedText}
    </span>,
    showCursor && !prefersReducedMotion && (
      <span
        ref={cursorRef}
        className={`ml-1 inline-block ${shouldHideCursor ? 'hidden' : ''} ${cursorClassName}`}
        aria-hidden="true"
      >
        {cursorCharacter}
      </span>
    ),
  );
}
