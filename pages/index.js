import React from 'react'
import Head from 'next/head'

import styles from '../styles/Home.module.css'
import data from '../data/data'

import Intro from './Intro'
import Projects from './_Projects'
import Skills from './Skills'
import Socials from './Socials'

const Home = () => (
    <div className={styles.container}>
        <Head>
            <title>Jason Lee French</title>
            <meta name="description" content="a funky-fresh portfolio" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossOrigin="true"
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap"
                rel="stylesheet"
            />
        </Head>
        <Intro data={data.intro} />
        <Skills data={data.skills} />
        <footer className={styles.footer}>❤️</footer>
    </div>
)

export default Home
