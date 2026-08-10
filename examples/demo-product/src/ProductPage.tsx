export function ProductPage({ firstName = 'Sam' }: { firstName?: string }) {
  const managed = { shared: { support: 'Contact support' }, buttons: { save: 'Save changes' } };
  return <section aria-label="Account overview">
    <h1>{`Welcome ${firstName}`}</h1>
    <p>Your recent activity</p>
    <button>{managed.buttons.save}</button>
    <a href="/support">{managed.shared.support}</a>
  </section>;
}
