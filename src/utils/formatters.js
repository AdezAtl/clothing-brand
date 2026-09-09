/**
 * Formatting and WhatsApp order dispatch utilities
 */

export function formatNaira(amount) {
  return '₦' + Number(amount || 0).toLocaleString('en-NG');
}

export const DELIVERY_OPTIONS = [
  {
    id: 'ibadan-bike',
    title: 'Same-Day Ibadan Bike Delivery',
    price: 1500,
    eta: 'Today before 5:00 PM (Orders before 2 PM)',
    description: 'Direct door drop within Ibadan metropolis'
  },
  {
    id: 'store-pickup',
    title: 'Pickup at Challenge Boutique',
    price: 0,
    eta: 'Ready in 30 minutes (Mon–Sat 9AM–7PM)',
    description: '39 Oladoyinbo St, Challenge — try it on in our fitting room'
  },
  {
    id: 'outside-ibadan',
    title: 'Interstate Courier (Lagos / Nationwide)',
    price: 3500,
    eta: '1 – 3 business days',
    description: 'Tracked interstate motor park or door dispatch'
  }
];

export function buildWhatsAppOrderUrl({ items, delivery, customer, subtotal, total }) {
  const phone = '2348140000000'; // Lola's Hub business line or link
  
  let lines = [
    `*NEW ORDER — LOLA'S HUB*`,
    `--------------------------------`,
    `*Customer:* ${customer.name || 'Shopper'}`,
    `*Phone:* ${customer.phone || 'N/A'}`,
    `*Address:* ${customer.address || 'Pickup in store'}`,
    `--------------------------------`,
    `*ITEMS ORDERED:*`
  ];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.name} (${item.size}) × ${item.quantity} — ${formatNaira(item.price * item.quantity)}`);
  });

  lines.push(`--------------------------------`);
  lines.push(`*Delivery Method:* ${delivery.title} (${formatNaira(delivery.price)})`);
  lines.push(`*Estimated Arrival:* ${delivery.eta}`);
  lines.push(`*Total Amount:* *${formatNaira(total)}*`);
  lines.push(`--------------------------------`);
  lines.push(`Hello Lola's Hub, I have finalized my order on your store. Please confirm stock availability and send payment confirmation!`);

  const encoded = encodeURIComponent(lines.join('\n'));
  return `https://wa.me/${phone}?text=${encoded}`;
}

export function buildWhatsAppInquiryUrl(product, size = '') {
  const phone = '2348140000000';
  const sizeText = size ? ` in size ${size}` : '';
  const text = `Hello Lola's Hub, I am looking at the *${product.name}* (${formatNaira(product.price)})${sizeText}. Is this currently in stock at the Challenge shop?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
