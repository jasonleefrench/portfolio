import { useEffect, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

const secondsInHalfDay = (1000 * 60 * 60 * 24) / 2

const Greeter = ({ text }) => {
  const [ lastVisit, setLastVisit ] = useLocalStorage('last-visit')
  const [ greeting, setGreeting ] = useState('')
  useEffect(() => {
    const revisit = lastVisit && (secondsInHalfDay > Date.now() - +lastVisit)
    const hours = new Date().getHours()
    const greeting = revisit ? 'Hi again!' :
      hours < 12 ? 'Good morning!' :
      hours < 18 ? 'Howdy!' :
      'Good evening!'
    setGreeting(greeting)
    setLastVisit(+Date.now())
  }, [])
  const editable = text.match(/{(.+)}/)[1]
  const __html = text.split(/{(.+)}/)
    .map((str, index) => index === 1 ? greeting : str)
    .join('')
  return __html && <span dangerouslySetInnerHTML={{__html}} />
}

export default Greeter