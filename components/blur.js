const shimmer = (width, height) => `
<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#3498db" offset="0%" />
      <stop stop-color="#fff" offset="50%" />
      <stop stop-color="#8e44ad" offset="100%" />
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

const blur = (width, height) => toBase64(shimmer(width, height))

export default blur
