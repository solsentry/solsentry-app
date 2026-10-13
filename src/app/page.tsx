// solsentry.app — single landing for the SolSentry Android app.
// Facts on this page mirror the validation server (solsentry-mobile-core README); keep them in step.

import latest from "../../public/app/latest.json";
import styles from "./page.module.css";

// The APK button reads the release the app itself updates from, so the site never names a stale version.
const APK = { url: latest.url, version: latest.name };
const DEMO_URL = "https://youtu.be/ZeKmTckhfIg";
const DEMO_VIDEO_EMBED = "https://www.youtube-nocookie.com/embed/ZeKmTckhfIg";
const SOURCE_URL = "https://github.com/solsentry/solsentry-mobile";
const X_URL = "https://x.com/solsentryai";

const STEPS = [
  {
    title: "Get a task",
    body: "The app asks for one task. A task is the signature of one public mainnet transaction.",
  },
  {
    title: "Read it from the phone",
    body: "The phone reads that transaction through its RPC: the SolSentry relay, or your own Helius, QuickNode or Solami endpoint.",
  },
  {
    title: "Reduce it to a fact",
    body: "The response becomes a fixed fact that two honest readers on different providers must agree on, then a hash of that fact.",
  },
  {
    title: "Sign it in hardware",
    body: "The hash is signed by a key that lives in the phone's Android Keystore and never leaves it.",
  },
  {
    title: "Get a verdict",
    body: "The server compares the hash with its own read and answers accepted, diverged or unknown.",
  },
];

const ATTEST_PROVES = [
  "The signing key was created inside the phone's secure hardware (TEE) and never leaves it.",
  "The chain of certificates ends at Google's hardware attestation roots, checked against a revocation list.",
  "The device runs verified boot with a locked bootloader.",
];

const ATTEST_NOT = [
  "On its own, attestation does not say the phone is a Seeker. Seeker ownership is read from the Seeker Genesis Token in the linked wallet.",
  "An emulator fails attestation: it has no secure hardware to build that chain. It can still run tasks for base points, but never earns the attested bonus or SKR. We tested a real Seeker and an emulator.",
];

const POINTS = [
  "One point per transaction per device, for accepted, signed reads only.",
  "A daily cap per device.",
  "Bonuses that add up by class: attested device, attested device with the Seeker Genesis Token, and reads through your own RPC.",
  "In this test phase of the Seeker launch, wallets holding a Seeker Genesis Token claim SKR from a pool SolSentry funds, under per-device and per-wallet caps. Claiming does not spend points.",
  "You sign the claim and pay the network fee; the server confirms it on chain.",
  "Points have no cash value and are not a token. Caps and rates belong to this test phase and will change.",
  "Every point is a row in an append-only ledger that records the rule that produced it, so a rule change never rewrites past points.",
];

const CONTROL = [
  "Wi-Fi only and charging only are switches in the app.",
  "You choose the interval between tasks.",
  "Use your own RPC key or the SolSentry relay, and change it at any time.",
  "The app only reads public transactions. Linking a wallet is one signed message, never a transaction.",
];

const NEXT = [
  {
    title: "Wallet checks",
    status: "In development",
    body: "The same signed-read network, pointed at wallets: phones read the public history of an address so anyone can check a wallet before sending to it. Not live yet.",
  },
  {
    title: "Quorum with trap tasks",
    status: "Specified",
    body: "A fact counts only when readers with different owners on different RPC providers agree, with known-answer trap tasks.",
  },
  {
    title: "Open verifier (Rust)",
    status: "In development",
    body: "Reproduces each fact outside our code.",
  },
  {
    title: "Attestations on Solana Attestation Service",
    status: "Tested on devnet",
    body: "Verified facts as attestations on the Solana Attestation Service.",
  },
  {
    title: "Solana dApp Store",
    status: "In preparation",
    body: "The app is being prepared for the Solana dApp Store listing on Seeker.",
  },
];

const STRAIGHT = [
  "It is not a Solana consensus validator. It does not vote, stake or produce blocks.",
  "It is not trustless yet. The SolSentry server is the reference every result is compared against.",
  "SolSentry has no token of its own. Rewards are paid in SKR from a reward pool.",
];

const SCREENS = [
  {
    src: "/screens/home.webp",
    alt: "Home screen: verifying, matched results, SKR balance and Claim",
  },
  { src: "/screens/account.webp", alt: "Account screen: SKR rewards and how points add up" },
  {
    src: "/screens/result.webp",
    alt: "A matched result: the phone's read agrees with SolSentry's reference read",
  },
];

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <header className={styles.top}>
        <nav aria-label="Main" className={styles.nav}>
          <a href="#main" className={styles.brand}>
            <img src="/logo-3d.webp" alt="" width={28} height={28} />
            <span>SolSentry</span>
          </a>
          <div className={styles.navLinks}>
            <a className={styles.navLink} href="#how">
              How it works
            </a>
            <a className={styles.navLink} href="#points">
              Points and SKR
            </a>
            <a className={styles.navLink} href="#builders">
              For builders
            </a>
            <a className={`${styles.btnPrimary} ${styles.btnSmall}`} href={APK.url}>
              Download the APK
            </a>
          </div>
        </nav>
      </header>

      <main id="main">
        <div className={styles.heroBand}>
          <section className={styles.hero}>
            <div aria-hidden="true" className={styles.halo} />
            <div className={styles.heroText}>
              <span className={`${styles.pill} ${styles.rise1}`}>
                Android · built for Solana Seeker
              </span>
              <h1 className={`${styles.h1} ${styles.rise2}`}>
                Your phone verifies <span className={styles.accent}>Solana.</span>
              </h1>
              <p className={`${styles.lead} ${styles.rise3}`}>
                SolSentry turns an idle phone into a verifier of public Solana data. It reads one
                transaction at a time from its own connection, signs what it saw with a key held in
                secure hardware, and earns points when the server confirms the read. Seeker Genesis
                holders can also claim SKR.
              </p>
              <div className={`${styles.actions} ${styles.rise4}`}>
                <a className={styles.btnPrimary} href={APK.url}>
                  <span>Download the APK ({APK.version})</span>
                  <Arrow />
                </a>
                <a className={styles.btnGhost} href={DEMO_URL}>
                  Watch the demo
                </a>
                <a className={styles.btnGhost} href={SOURCE_URL}>
                  Source code
                </a>
              </div>
            </div>

            <figure className={styles.phoneCol}>
              <img
                className={styles.genesis}
                src="/genesis-token.webp"
                alt="Seeker Genesis Token"
                width={210}
                height={210}
              />
              <div className={styles.phone}>
                <img
                  className={styles.phoneScreen}
                  src={SCREENS[0].src}
                  alt={SCREENS[0].alt}
                  width={540}
                  height={1202}
                />
              </div>
              <figcaption className={styles.caption}>Real screenshot, Solana Seeker.</figcaption>
            </figure>
          </section>
        </div>

        <section className={styles.section}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>The app</span>
            <h2 className={styles.h2}>On a Solana Seeker.</h2>
          </div>
          <div className={styles.shots}>
            {SCREENS.map((sc) => (
              <img
                key={sc.src}
                className={styles.shot}
                src={sc.src}
                alt={sc.alt}
                width={540}
                height={1202}
                loading="lazy"
              />
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>Demo</span>
            <h2 className={styles.h2}>The app on a Seeker.</h2>
          </div>
          <div className={styles.video}>
            <iframe
              src={DEMO_VIDEO_EMBED}
              title="SolSentry app demo"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>

        <section className={styles.section} id="how">
          <div className={styles.head}>
            <span className={styles.eyebrow}>How one task works</span>
            <h2 className={styles.h2}>Read, reduce, sign, compare.</h2>
          </div>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li className={styles.card} key={s.title}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.h3}>{s.title}</h3>
                <p className={styles.body}>{s.body}</p>
              </li>
            ))}
          </ol>
          <p className={styles.note}>
            The fact keeps what every honest node returns the same way: sorted keys, exact integers
            at any size, token amounts as decimal strings, failure as a yes or no. Logs and compute
            units are left out because they vary by node version. The phone and the server agree on
            48 shared test vectors.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>Proof the phone is real</span>
            <h2 className={styles.h2}>Hardware key attestation.</h2>
            <p className={styles.sub}>
              Before its results count for more, the phone proves its signing key lives in secure
              hardware. The server sends a single-use challenge, the phone creates its key with it,
              and the server checks the certificate chain the phone returns.
            </p>
          </div>
          <div className={styles.grid2}>
            <div className={styles.card}>
              <h3 className={styles.h3}>What it proves</h3>
              <ul className={styles.list}>
                {ATTEST_PROVES.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.h3}>What it does not</h3>
              <ul className={styles.list}>
                {ATTEST_NOT.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section} id="points">
          <div className={styles.band}>
            <div className={styles.bandText}>
              <span className={styles.bandEyebrow}>Points and SKR</span>
              <h2 className={styles.bandH2}>Paid for reads the server can confirm.</h2>
            </div>
            <svg
              className={styles.seal}
              aria-hidden="true"
              width="160"
              height="160"
              viewBox="0 0 64 64"
            >
              <path
                fill="#17100A"
                d="M32 2l7 6 9-1 3 9 8 5-3 9 3 9-8 5-3 9-9-1-7 6-7-6-9 1-3-9-8-5 3-9-3-9 8-5 3-9 9 1z"
              />
              <path
                d="M22 33l7 7 13-15"
                fill="none"
                stroke="#F28A35"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className={styles.grid2}>
            <div className={styles.card}>
              <ul className={styles.list}>
                {POINTS.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3 className={styles.h3}>Your phone, your rules</h3>
              <ul className={styles.list}>
                {CONTROL.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.section} id="builders">
          <div className={`${styles.card} ${styles.builders}`}>
            <div className={styles.buildersText}>
              <span className={styles.eyebrow}>For builders</span>
              <p className={styles.buildersLead}>
                Wallet checks for the long tail that enterprise KYT leaves out: privacy apps,
                wallets, payment apps, fintechs and AI agents. Planned pay-per-check, no contract,
                no minimum volume. Not live yet.
              </p>
            </div>
            <a className={styles.btnPrimary} href={X_URL}>
              <span>DM @solsentryai on X</span>
              <Arrow />
            </a>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>Next</span>
            <h2 className={styles.h2}>Where this goes.</h2>
          </div>
          <div className={styles.grid3}>
            {NEXT.map((n) => (
              <div className={styles.card} key={n.title}>
                <span className={styles.tag}>{n.status}</span>
                <h3 className={styles.h3}>{n.title}</h3>
                <p className={styles.body}>{n.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.head}>
            <span className={styles.eyebrow}>Straight answers</span>
            <h2 className={styles.h2}>What it is not.</h2>
          </div>
          <div className={styles.card}>
            <ul className={styles.list}>
              {STRAIGHT.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerRow}>
          <div className={styles.footerBrand}>
            <img src="/logo-3d.webp" alt="" width={22} height={22} />
            <span className={styles.footerName}>SolSentry</span>
            <span className={styles.footerMeta}>· built by two founders</span>
          </div>
          <div className={styles.footerLinks}>
            <a href={X_URL}>X @solsentryai</a>
            <a href={SOURCE_URL}>GitHub</a>
          </div>
        </div>
        <p className={styles.footerNote}>
          Built at Colosseum Crypto World&apos;s Fair and Solana Mobile Clock In
        </p>
      </footer>
    </>
  );
}
