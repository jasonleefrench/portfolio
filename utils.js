const prettyDate = date => new Date(date).toLocaleDateString('en-gb', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

export { prettyDate }