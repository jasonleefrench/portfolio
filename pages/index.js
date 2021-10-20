import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'
import data from '../data/data'

import Intro from './Intro'
import Projects from './Projects'
import Skills from './Skills'
import Socials from './Socials'

const Home = () => (
  <div className={styles.container}>
    <Head>
      <title>Jason Lee French</title>
      <meta name='description' content='a funky-fresh portfolio' />
      <link rel='icon' href='/favicon.ico' />
      <link rel='preconnect' href='https://fonts.googleapis.com' />
      <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
      <link href='https://fonts.googleapis.com/css2?family=Roboto:wght@300;500&display=swap' rel='stylesheet' />
    </Head>
    <Intro data={data.intro} />
    <article>
      <Projects data={data.projects} />
      <Skills data={data.skills} />
      <Socials data={data.socials} />
    </article>
    <footer className={styles.footer}>❤️</footer>
  </div>
)

export default Home