// solsentry.app — single landing for the SolSentry Android app.
// Facts on this page mirror the validation server (solsentry-mobile-core README); keep them in step.

import styles from "./page.module.css";

// Set when the demo video is published (YouTube embed URL). Section is hidden while null.
const DEMO_VIDEO_EMBED: string | null = null;
// Set when the APK download is hosted. The button is hidden while null.
const APK_URL: string | null = null;

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
  "The signing key was created inside secure hardware (StrongBox when the phone has one).",
  "The chain of certificates ends at Google's hardware attestation roots, checked against a revocation list.",
  "The device runs verified boot with a locked bootloader.",
];

const ATTEST_NOT = [
  "On its own, attestation does not say the phone is a Seeker. Seeker ownership is read from the Seeker Genesis Token in the linked wallet.",
  "An emulator cannot pass: it has no secure element to build that chain. We tested a real Seeker and an emulator; the emulator is refused.",
];

const POINTS = [
  "One point per transaction per device, for accepted, signed reads only.",
  "A daily cap per device.",
  "Bonuses that add up by class: attested device, attested device with the Seeker Genesis Token, and reads through your own RPC.",
  "Points convert to SKR under per-device and per-wallet caps. You sign the claim and pay the network fee; the server confirms it on chain.",
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
    body: "The same signed-read network, pointed at wallets: phones read the public history of an address so anyone can check a wallet before sending to it.",
  },
  {
    title: "More than one reader per task",
    body: "Today the server's own read is the reference. Next, several phones on different networks read the same task and their results are compared with each other.",
  },
  {
    title: "Solana dApp Store",
    body: "The app is being prepared for the Solana dApp Store listing on Seeker.",
  },
];

const STRAIGHT = [
  "It is not a Solana consensus validator. It does not vote, stake or produce blocks.",
  "It is not trustless yet. The SolSentry server is the reference every result is compared against.",
  "SolSentry has no token of its own. Rewards are paid in SKR from a reward pool.",
];

function Phone() {
  return (
    <div className={styles.phone} aria-hidden>
      <div className={styles.screen}>
        <div className={styles.screenHead}>
          <span className={styles.dot} />
          <span>Validating</span>
        </div>
        <div className={styles.task}>
          <div className={styles.taskRow}>
            <span>Task</span>
            <code>5xQ…9mR</code>
          </div>
          <div className={styles.taskRow}>
            <span>RPC</span>
            <code>own key</code>
          </div>
          <div className={styles.taskRow}>
            <span>Fact hash</span>
            <code>a41f…07c2</code>
          </div>
          <div className={styles.taskRow}>
            <span>Signed</span>
            <code>Keystore · StrongBox</code>
          </div>
        </div>
        <div className={styles.verdict}>accepted</div>
        <div className={styles.pointsLine}>
          <span>Points today</span>
          <strong>+1</strong>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main id="main">
      <header className={styles.top}>
        <div className={styles.wrap}>
          <span className={styles.brand}>SolSentry</span>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={`${styles.wrap} ${styles.heroGrid}`}>
          <div>
            <span className={styles.eyebrow}>Android · built for Solana Seeker</span>
            <h1 className={styles.h1}>Your phone verifies Solana.</h1>
            <p className={styles.lead}>
              SolSentry turns an idle phone into a verifier of public Solana data. It reads one
              transaction at a time from its own connection, signs what it saw with a key held in
              secure hardware, and earns points when the server confirms the read. Points convert
              to SKR.
            </p>
            <div className={styles.actions}>
              {APK_URL ? (
                <a className={styles.btnPrimary} href={APK_URL}>
                  Download for Android
                </a>
              ) : null}
              <a className={APK_URL ? styles.btnGhost : styles.btnPrimary} href="#how">
                How verification works
              </a>
            </div>
            <p className={styles.status}>Solana dApp Store listing in preparation.</p>
          </div>
          <div className={styles.phoneCol}>
            <Phone />
            <p className={styles.caption}>Illustration of one task, not a screenshot.</p>
          </div>
        </div>
      </section>

      {DEMO_VIDEO_EMBED ? (
        <section className={styles.section}>
          <div className={styles.wrap}>
            <span className={styles.eyebrow}>Demo</span>
            <h2 className={styles.h2}>The app on a Seeker.</h2>
            <div className={styles.video}>
              <iframe
                src={DEMO_VIDEO_EMBED}
                title="SolSentry app demo"
                allow="accelerometer; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      ) : null}

      <section className={styles.section} id="how">
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>How one task works</span>
          <h2 className={styles.h2}>Read, reduce, sign, compare.</h2>
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
            units are left out because they vary by node version. We measured it on 35
            transactions across 9 RPC providers.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Proof the phone is real</span>
          <h2 className={styles.h2}>Hardware key attestation.</h2>
          <p className={styles.sub}>
            Before its results count for more, the phone proves its signing key lives in secure
            hardware. The server sends a single-use challenge, the phone creates its key with it,
            and the server checks the certificate chain the phone returns.
          </p>
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
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Points and SKR</span>
          <h2 className={styles.h2}>Paid for reads the server can confirm.</h2>
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
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Next</span>
          <h2 className={styles.h2}>Where this goes.</h2>
          <div className={styles.grid3}>
            {NEXT.map((n) => (
              <div className={styles.card} key={n.title}>
                <span className={styles.tag}>In design</span>
                <h3 className={styles.h3}>{n.title}</h3>
                <p className={styles.body}>{n.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <span className={styles.eyebrow}>Straight answers</span>
          <h2 className={styles.h2}>What it is not.</h2>
          <div className={styles.card}>
            <ul className={styles.list}>
              {STRAIGHT.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={`${styles.wrap} ${styles.footerRow}`}>
          <span>SolSentry · built by two founders</span>
          <a href={X_URL}>X @solsentryai</a>
        </div>
      </footer>
    </main>
  );
}
