/**
 * Custom page transitions for Ionic
 * Implements simple horizontal slide for all page transitions
 */

import { Animation, createAnimation } from '@ionic/vue'

// Type for transition options
interface TransitionOptions {
  enteringEl?: HTMLElement
  leavingEl?: HTMLElement
  direction?: 'forward' | 'back'
}

/**
 * Slide horizontal animation (entering page slides from right, leaving page slides to left)
 */
export const pageTransition = (baseEl: HTMLElement, opts?: TransitionOptions): Animation => {
  const DURATION = 250 // Fast transition
  const EASING = 'cubic-bezier(0.4, 0.0, 0.2, 1)'

  const enteringEl = opts?.enteringEl
  const leavingEl = opts?.leavingEl

  const rootAnimation = createAnimation()
    .duration(DURATION)
    .easing(EASING)

  // Entering page animation (slides in from right)
  if (enteringEl) {
    const enteringAnimation = createAnimation()
      .addElement(enteringEl)
      .fromTo('transform', 'translateX(100%)', 'translateX(0)')
      .fromTo('opacity', '0', '1')

    rootAnimation.addAnimation(enteringAnimation)
  }

  // Leaving page animation (slides out to left)
  if (leavingEl) {
    const leavingAnimation = createAnimation()
      .addElement(leavingEl)
      .fromTo('transform', 'translateX(0)', 'translateX(-100%)')
      .fromTo('opacity', '1', '0')

    rootAnimation.addAnimation(leavingAnimation)
  }

  return rootAnimation
}

/**
 * Backwards slide animation (for back navigation)
 */
export const pageTransitionBackwards = (baseEl: HTMLElement, opts?: TransitionOptions): Animation => {
  const DURATION = 250
  const EASING = 'cubic-bezier(0.4, 0.0, 0.2, 1)'

  const enteringEl = opts?.enteringEl
  const leavingEl = opts?.leavingEl

  const rootAnimation = createAnimation()
    .duration(DURATION)
    .easing(EASING)

  // Entering page animation (slides in from left)
  if (enteringEl) {
    const enteringAnimation = createAnimation()
      .addElement(enteringEl)
      .fromTo('transform', 'translateX(-100%)', 'translateX(0)')
      .fromTo('opacity', '0', '1')

    rootAnimation.addAnimation(enteringAnimation)
  }

  // Leaving page animation (slides out to right)
  if (leavingEl) {
    const leavingAnimation = createAnimation()
      .addElement(leavingEl)
      .fromTo('transform', 'translateX(0)', 'translateX(100%)')
      .fromTo('opacity', '1', '0')

    rootAnimation.addAnimation(leavingAnimation)
  }

  return rootAnimation
}
