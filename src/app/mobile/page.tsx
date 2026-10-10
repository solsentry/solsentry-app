// /mobile — landing for the SolSentry Android app (validator). English only for now.
// The phone frame embeds the static design preview served from /mobile-preview/.

import { Footer } from "@/components/Footer";
import { Section } from "@/components/Section";
import { SiteTopbar } from "@/components/SiteTopbar";
import { SubscribeForm } from "@/components/SubscribeForm";
import styles from "./mobile.module.css";

export const metadata = {
  title: "SolSentry Mobile — turn your phone into a SolSentry validator",
  description:
    "The SolSentry Android app reads one public Solana transaction at a time, summarises it and returns the result signed by a hardware key. Built for Solana Seeker.",
};

const WHY = [
  {
    title: "Every scan is an RPC call. Every call is a bill.",
    body: "Mapping who is behind a wallet means reading a lot of chain history. Today all of that reading runs on servers we pay for, from one place on the network.",
  },
  {
    title: "Wallet risk data comes from a handful of vendors.",
    body: "Companies already pay for know-your-wallet (KYW) checks before they accept a deposit or send a payout. The data behind those checks is produced by very few readers of the chain.",
  },
  {
    title: "Phones are online, idle and everywhere.",
    body: "A phone on Wi-Fi can do one small read and report back. Many phones doing that give a second read of the same public data from a different network position.",
  },
];

const STEPS = [
  {
    title: "The phone asks for a task",
    body: "The app requests one task from SolSentry. A task points to a single public Solana transaction.",
  },
  {
    title: "It reads that transaction",
    body: "The read goes through an RPC endpoint: your own key, or the SolSentry proxy if you don't have one.",
  },
  {
    title: "It computes a fixed summary",
    body: "The same deterministic summary on every device, signed on the phone by a hardware-backed key.",
  },
  {
    title: "The server compares",
    body: "SolSentry checks the result against its own reference read and records it as accepted, diverged or unknown.",
  },
];

const CONTROL = [
  "Runs in the background, on your terms: Wi-Fi only, charging only, and the interval between tasks are all switches in the app.",
  "Use your own RPC key or the SolSentry proxy. You can change it at any time.",
  "Validation only reads public transactions of public programs.",
  "Every result carries a signature from a key that lives in the phone's secure hardware.",
];

const ROADMAP = [
  {
    title: "Points for accepted work",
    body: "A Points screen that counts accepted validations per device. It is the base any future reward would be calculated on.",
  },
  {
    title: "Link wallet with Seed Vault",
    body: "Connect a wallet through the Seeker Seed Vault with no wallet picker in the way, so points belong to an address and not just to a device.",
  },
  {
    title: "Wallets that map themselves",
    body: "Open the app and see the wallets you interact with checked against SolSentry operator data, including a check on a recipient before you send.",
  },
  {
    title: "A paid side of the network",
    body: "The model we are designing: companies pay for wallet checks, phones do the verification work, SolSentry orchestrates. Paid RPC keys would count for more than free ones.",
  },
];

const NOT_YET = [
  "No paid rewards. There is no token, no airdrop and no payout today. Amounts shown in the design preview are illustrative.",
  "Not a Solana consensus validator. The app validates SolSentry reads; it does not vote on blocks or stake.",
  "Not decentralized or trustless. The SolSentry server is the reference each result is compared against.",
  "The phone does not investigate fraud. It verifies reads of public data; the analysis happens on SolSentry's side.",
];

export default function MobilePage() {
  return (
    <>
      <SiteTopbar />
      <div style={{ paddingTop: "72px" }}>
        <section className="section-pad">
          <div className={`container ${styles.hero}`}>
            <div>
              <span className="eyebrow">SolSentry Mobile · Android · Solana Seeker</span>
              <h1 className={styles.heroTitle}>Turn your phone into a SolSentry validator.</h1>
              <p className={styles.heroSub}>
                The app reads one public Solana transaction at a time, computes a fixed summary and
                sends it back signed by a hardware key. Our server compares it with its own read.
                Each match is a second look at the chain from somewhere we are not.
              </p>
              <div className={styles.actions}>
                <a className="btn-primary" href="#updates">
                  Get build updates
                </a>
                <a className="btn-ghost" href="#how">
                  How it works
                </a>
              </div>
              <p className={styles.status}>
                Pre-release · v0.1.0 · Solana dApp Store listing in preparation
              </p>
            </div>

            <div className={styles.phoneCol}>
              <div className={styles.phone}>
                <div className={styles.screen}>
                  <iframe
                    src="/mobile-preview/home.html"
                    title="SolSentry Mobile home screen, design preview"
                    loading="lazy"
                    scrolling="no"
                  />
                </div>
              </div>
              <p className={styles.caption}>
                Interactive design preview of the home screen we are building toward. Names, blocks
                and amounts are illustrative. Rewards are not live.
              </p>
            </div>
          </div>
        </section>

        <Section
          eyebrow="Why a phone"
          title="Solana teams can't see who they are dealing with on-chain."
          sub="SolSentry maps the operators behind wallets. Doing that at scale has a cost problem and a single-reader problem. The mobile app is our answer to both."
        >
          <div className={styles.grid3}>
            {WHY.map((c) => (
              <div className="panel" key={c.title}>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardBody}>{c.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="how"
          eyebrow="How it works today"
          title="One transaction. One summary. One comparison."
          sub="This is what the current build does, end to end."
        >
          <div className={styles.grid4}>
            {STEPS.map((s, i) => (
              <div className="panel" key={s.title}>
                <div className={styles.step}>{String(i + 1).padStart(2, "0")}</div>
                <h3 className={styles.cardTitle}>{s.title}</h3>
                <p className={styles.cardBody}>{s.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Your phone, your rules" title="You decide when it works.">
          <div className={styles.grid2}>
            <div className="panel">
              <ul className={styles.list}>
                {CONTROL.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="panel">
              <h3 className={styles.cardTitle}>Built for Seeker</h3>
              <p className={styles.cardBody}>
                The app runs on Android phones. On Solana Seeker the device itself is
                hardware-attested, so a result can be tied to a real phone and not just to an
                install. Wallet linking through the Seed Vault is in development.
              </p>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="In development"
          title="Where this is going."
          sub="Designed or in code, not shipped. Nothing below is a promise of payment."
        >
          <div className={styles.grid4}>
            {ROADMAP.map((r) => (
              <div className="panel" key={r.title}>
                <span className={styles.tag}>Not shipped</span>
                <h3 className={styles.cardTitle}>{r.title}</h3>
                <p className={styles.cardBody}>{r.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section eyebrow="Straight answers" title="What it is not, yet.">
          <div className={`panel ${styles.notYet}`}>
            <ul className={styles.list}>
              {NOT_YET.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </Section>

        <Section
          id="updates"
          eyebrow="Follow the build"
          title="Get a note when a build is out."
          sub="Built by two founders. Leave an email and we will write when there is a build to install."
        >
          <div className={styles.updates}>
            <SubscribeForm />
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
}
