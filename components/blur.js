const shimmer = (width, height, primary = '#3498db', secondary = '#8e44ad') => `
<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="${primary}" offset="0%" />
      <stop stop-color="#fff" offset="50%" />
      <stop stop-color="${secondary}" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="white" />
  <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="5s" repeatCount="indefinite"  />
</svg>`

const toBase64 = str =>
    typeof window === 'undefined'
        ? Buffer.from(str).toString('base64')
        : window.btoa(str)

const blur = (width, height, [primary, secondary]) =>
    toBase64(shimmer(width, height, primary, secondary))

export default blur
