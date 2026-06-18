import '@testing-library/jest-dom'

// JSDOM does not implement the Web Animations API used by HeroUI tab indicators
if (typeof Element !== 'undefined' && !Element.prototype.getAnimations) {
  Element.prototype.getAnimations = () => []
}

// JSDOM does not implement matchMedia (used by @heroui-pro/react Sheet component)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
