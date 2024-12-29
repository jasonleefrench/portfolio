import { useEffect, useState, useMemo, cloneElement } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Header from '../../components/header'
import useAuth from '../../hooks/useAuth'
import { prettyDate } from '../../utils'

const tags = [
    'whimsy',
    'quiz',
    'presentation',
    'data',
    'live',
    'chatgpt',
    'election',
]

const SignIn = ({ children }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [signInWithEmailAndPassword, user, loading, error, checkedAuth] =
        useAuth()

    const element = cloneElement(children, { user })

    if (!checkedAuth) {
        return <></>
    }

    if (error) {
        return (
            <div>
                <p>Error: {error.message}</p>
            </div>
        )
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (user) {
        return <div>{element}</div>
    }

    return (
        <div className="App">
            <form>
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    onClick={() => signInWithEmailAndPassword(email, password)}
                >
                    Sign In
                </Button>
                <input type="submit" hidden />
            </form>
        </div>
    )
}

const NewProject = () => {
    return (
        <div className={'wrapper'}>
            <Header title={'Projects'} />
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root, & .MuiButton-root': {
                        my: 1,
                        mx: 'auto',
                        display: 'inline-block',
                        width: '50ch',
                    },
                }}
                noValidate
                autoComplete="off"
            >
                <SignIn>
                    <Form />
                </SignIn>
            </Box>
        </div>
    )
}

const Form = ({ user }) => {
    const [url, setUrl] = useState('')
    const [data, setData] = useState({})
    const [error, setError] = useState('')
    const [selectedTags, setSelectedTags] = useState([])

    useEffect(() => {
        async function getData() {
            try {
                if (!url) {
                    return
                }
                const { pathname } = new URL(url)
                const id = pathname.split('/').at(-1)
                const res = await fetch(`/api/wsj?id=${id}`)
                const json = await res.json()
                setData(json)
                setError('')
            } catch (error) {
                setError('Error fetching URL')
            }
        }
        getData()
    }, [url])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const token = await user.getIdToken()
        const res = await fetch('/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...data, tags: selectedTags }),
        })

        if (res.ok) {
            setUrl('')
            setData({})
        }
    }

    return (
        <>
            <div>
                <TextField
                    required
                    label="URL"
                    defaultValue={url}
                    onBlur={(e) => setUrl(e.target.value)}
                />
            </div>
            <div>
                <Autocomplete
                    multiple
                    options={tags}
                    getOptionLabel={(option) => option}
                    value={selectedTags}
                    onChange={(event, newValue) => {
                        setSelectedTags(newValue)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            label="Tags"
                            placeholder="Tags"
                        />
                    )}
                />
            </div>
            <Button
                onClick={handleSubmit}
                variant="contained"
                disabled={!data.title || !data.timestamp}
            >
                Create project
            </Button>
            {!error && data.title && (
                <div>
                    <p>
                        <strong>Title</strong> {data.title}
                    </p>
                    <p>
                        <strong>URL</strong> <a href={url}>{url}</a>{' '}
                        {url &&
                            !new URL(url).searchParams.get('st') &&
                            '(gift mode not enabled)'}
                    </p>
                    <p>
                        <strong>Date</strong> {prettyDate(data.timestamp)}
                    </p>
                </div>
            )}
            <input type="submit" hidden />
            {error && <p>{error}</p>}
        </>
    )
}

export default NewProject
