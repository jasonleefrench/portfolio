const prettyDate = date => new Date(date).toLocaleDateString('en-gb', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

const prettyTitle = title => title.split('-').join(' ')

export { prettyDate, prettyTitle }