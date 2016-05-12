import React from 'react'
import { Link } from 'react-router'
import styles from './beta.css'

import BetaSignup from './signup.jsx'
import LogoText from '../logos/logotext-640x100.svg'

import ChatImage from './chat.svg'
import NetworkImage from './network.svg'
import PrizeImage from './prize.svg'
import ResolutionImage from './resolution.svg'
import WindowsImage from './windows.svg'

const FeatureSection = ({ title, titleStyle, body, image }) => {
  return (<div className={styles.feature}>
    <div className={styles.featureText}>
      <h3 className={titleStyle}>{title}</h3>
      <p className={styles.featureBody}>{body}</p>
    </div>
    <div className={styles.featureImage}>
      { image }
    </div>
  </div>)
}

export default class Splash extends React.Component {
  render() {
    const features = [
      {
        title: 'Modern operating system support',
        body: <span>
          Since the release of Windows Vista, Brood War players have struggled with a myriad
          of compatibility problems that have only gotten worse with each new Windows version.
          Struggle no longer&mdash;ShieldBattery offers full support for all Windows versions Vista
          and above: no batch files, registry tweaks, or command line arguments required.
        </span>,
        image: <WindowsImage/>,
      },
      {
        title: 'Brand new windowed mode',
        body: <span>
          Brood War's forced 640x480, full screen graphics mode might have made sense in 1998, but
          who wants to play like that today? ShieldBattery offers a completely new graphics backend
          supporting both DirectX and OpenGL, borderless and bordered windows, and fast, smooth
          scaling to tons of different resolutions. Smart mouse sensitivity is included, too, so you
          can get things just right for your muta micro. Should you want to broadcast your matches
          to all of your adoring fans, ShieldBattery's windowed mode also works great with streaming
          programs out of the box.
        </span>,
        image: <ResolutionImage/>,
      },
      {
        title: 'Improved networking',
        body: <span>
          Tired of doing battle with your router before you can play with your friends online? We
          were too, which is why ShieldBattery includes a brand new network stack that removes the
          need for port forwarding completing, and brings LAN latency settings by default, no
          plugin needed.
        </span>,
        image: <NetworkImage/>,
      },
      {
        title: 'Auto-matchmaking and ladder',
        body: <span>
          No modern multiplayer experience would be complete without a streamlined ladder system
          that doesn't require you to spam a chat channel to find opponents. ShieldBattery provides
          a fast, easy laddering experience and can automatically match you to similarly skilled
          opponents on a fresh, rotating map pool.
        </span>,
        image: <PrizeImage/>,
      },
      {
        title: 'Completely revamped multiplayer experience',
        body: <span>
          Chat channels? You wanted those, right? ShieldBattery has 'em, front and center. Join tons
          of channels simultaneously, chat with your friends and enemies, all from our simple web
          interface that you can connect to from anywhere. And when you're ready for a game, you can
          do that there, too, all without leaving chat.
        </span>,
        image: <ChatImage/>,
      }
    ]

    return (
      <div className={styles.splash}>
        <div className={styles.logoContainer}>
          <ul className={styles.topLinks}>
            <li>
              <a href='https://us.battle.net/shop/en/product/starcraft' target='_blank'
                  rel='nofollow noreferrer'>Buy Brood War</a>
            </li>
            <li><Link to='/faqs'>FAQs</Link></li>
            <li><Link to='/login'>Log in</Link></li>
          </ul>
          <img className={styles.logo} src='/images/splash-logo.png' />
          <LogoText className={styles.logotext} />
        </div>
        <div className={styles.intro}>
          <div className={styles.introContent}>
            <div className={styles.introText}>
              <h3 className={styles.introHeadline}>
                The Brood War gameplay you love, the multiplayer experience it deserves
              </h3>
              <p className={styles.introBody}>
                Playing Brood War online today feels like a chore. Whether it's modern operating
                system problems, port forwarding challenges, or graphical glitches, every player has
                experienced their share of frustration. Want to start having fun again? Brood War
                has a life of lively to live to life of full life thanks to ShieldBattery.
              </p>
            </div>
            <BetaSignup />
          </div>
        </div>

        <p className={styles.trademarkInfo}>
          StarCraft and Brood War are registered trademarks of Blizzard Entertainment.
          ShieldBattery is a community-driven project with no official support or endorsement by
          Blizzard Entertainment.
        </p>

        {
          features.map((f, i) => <FeatureSection title={f.title} body={f.body} image={f.image}
              key={`feature-${i}`}
              titleStyle={i % 2 === 0 ? styles.titleBlue : styles.titleAmber}/>)
        }
      </div>
    )
  }
}
