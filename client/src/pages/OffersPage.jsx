export default function OffersPage({ offers, setOffers }) {
  const addOffer = () => {
    const percent = Number(window.prompt('Offer percentage?'));
    if (!Number.isFinite(percent) || percent <= 0) return;
    const id = `offer-${Date.now()}`;
    setOffers((current) => [
      ...current,
      { id, title: `Flash ${percent}% off`, percent, scope: 'all-products' }
    ]);
  };

  return (
    <section className="admin-shell">
      <div className="section-header">
        <div>
          <span className="eyebrow">Campaign manager</span>
          <h2>Offers & discounts</h2>
        </div>
        <button type="button" className="primary-button" onClick={addOffer}>Add offer</button>
      </div>

      <div className="admin-product-list">
        {offers.map((offer) => (
          <div key={offer.id} className="delivery-card">
            <div>
              <strong>{offer.title}</strong>
              <p>{offer.scope === 'all-products' ? 'Applies to all products' : 'Selected products only'}</p>
            </div>
            <div>
              <span className="delivery-badge">{offer.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
