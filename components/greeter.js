import { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const secondsInDay = 1000 * 60 * 60 * 24

const Greeter = ({ text }) => {
  const [ lastVisit, setLastVisit ] = useLocalStorage('last-visit')
  const [ greeting, setGreeting ] = useState('')
  useEffect(() => {
    const revisit = lastVisit && secondsInDay > Date.now() - +lastVisit
    const hours = new Date().getHours()
    const greeting = revisit ? 'Hi again!' :
      hours < 12 ? 'Good morning!' :
      hours < 18 ? 'Howdy!' :
      'Good evening!'
    setGreeting(greeting)
    setLastVisit(+Date.now())
  }, [ lastVisit, setLastVisit ])
  const editable = text.match(/{(\w+)}/)[1]
  const __html = text.split(/{(\w+)}/)
    .map((str, index) => index === 1 ? greeting : str)
    .join('')
  return __html && <span dangerouslySetInnerHTML={{__html}} />
}

export default Greeter