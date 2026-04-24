// Mono wallet address with truncation + copy affordance
const WalletAddress = ({ address, truncate = false, tone = 'brand' }) => {
  const color = tone === 'brand' ? 'var(--brand-orange)' : 'var(--fg-2)';
  const txt = truncate && address.length > 16
    ? `${address.slice(0, 6)}…${address.slice(-6)}`
    : address;
  return (
    <span style={{
      fontFamily: 'var(--font-mono)', fontSize: 13, color,
      wordBreak: 'break-all', cursor: 'pointer',
    }} title={address}>{txt}</span>
  );
};

window.WalletAddress = WalletAddress;
