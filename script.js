const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
if (menuButton && navLinks) {
  menuButton.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const drawer = document.querySelector('.drawer');
const drawerTitle = document.querySelector('#drawerTitle');
const drawerBody = document.querySelector('#drawerBody');
const products = {
  solids: {
    title: 'Solids Collection',
    copy: 'A versatile color foundation for quilting, sewing, appliqué and coordinated retail assortments.',
    specs: [['Fabric', '100% ring spun cotton'], ['Width', '44 inches'], ['Weight', '150 gsm'], ['Packaging', 'Bolt'], ['Ordering', 'Contact sales for pricing, availability and order requirements']]
  },
  batik: {
    title: 'SINGER Batik Collection',
    copy: 'Expressive handmade batik prints with layered color, organic variation and distinctive handcrafted character.',
    specs: [['Fabric', '100% cotton'], ['Width', '44 inches'], ['Weight', '115 gsm'], ['Packaging', 'Bolt'], ['Ordering', 'Contact sales for pricing, availability and order requirements']]
  },
  everyday: {
    title: 'Everyday Collection',
    copy: 'Florals, novelty prints, sewing themes and versatile coordinates designed for year round creative projects.',
    specs: [['Fabric', '100% ring spun cotton'], ['Width', '44 inches'], ['Weight', '150 gsm'], ['Packaging', 'Bolt'], ['Ordering', 'Contact sales for pricing, availability and order requirements']]
  },
  seasonal: {
    title: 'Seasonal Collection',
    copy: 'Retail ready seasonal stories spanning Easter, patriotic, fall, Halloween and Christmas themes.',
    specs: [['Fabric', '100% ring spun cotton'], ['Width', '44 inches'], ['Weight', '150 gsm'], ['Packaging', 'Bolt'], ['Ordering', 'Contact sales for pricing, availability and order requirements']]
  }
};

function openDrawer(key) {
  const item = products[key];
  if (!drawer || !item) return;
  drawerTitle.textContent = item.title;
  drawerBody.innerHTML = `<p>${item.copy}</p><dl class="spec-list">${item.specs.map(([a,b]) => `<div class="spec-row"><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl><a class="button" href="contact.html?interest=${encodeURIComponent(item.title)}">Ask About This Collection</a>`;
  drawer.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  document.body.style.overflow = '';
}
document.querySelectorAll('[data-drawer]').forEach(button => button.addEventListener('click', () => openDrawer(button.dataset.drawer)));
document.querySelectorAll('[data-close-drawer]').forEach(button => button.addEventListener('click', closeDrawer));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeDrawer(); });

const interestField = document.querySelector('#interestSummary');
if (interestField) {
  const interest = new URLSearchParams(location.search).get('interest');
  if (interest) interestField.value = interest;
}

// Email delivery configuration for the contact form (EmailJS).
// Fill in the four values below after completing the one time EmailJS setup
// described in README.md. The public key is safe to publish on GitHub Pages.
const EMAIL_CONFIG = {
  publicKey: 'ho2SlDK1DcEsoa0od',
  serviceId: 'service_abggtfv',
  salesTemplateId: 'template_wncg8af',
  confirmationTemplateId: 'template_ojnr73s'
};

const contactForm = document.querySelector('#salesForm');
if (contactForm) {
  const status = document.querySelector('#formStatus');
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const setStatus = (message, tone) => {
    status.textContent = message;
    status.classList.remove('is-error', 'is-success');
    if (tone) status.classList.add(tone === 'error' ? 'is-error' : 'is-success');
  };

  contactForm.addEventListener('submit', async event => {
    event.preventDefault();

    if (Object.values(EMAIL_CONFIG).some(value => value.startsWith('YOUR_'))) {
      setStatus('Form delivery is ready for configuration. Fill in the EMAIL_CONFIG values in script.js as described in the README.', 'error');
      return;
    }
    if (!window.emailjs) {
      setStatus('The email service could not be loaded. Please email us directly at sales@singerfabrics.com.', 'error');
      return;
    }

    const data = new FormData(contactForm);
    const templateParams = {
      name: data.get('name'),
      company: data.get('company'),
      email: (data.get('email') || '').trim(),
      phone: data.get('phone') || 'Not provided',
      business_type: data.get('business_type'),
      estimated_order_volume: data.get('estimated_order_volume') || 'Not specified',
      products: data.getAll('products').join(', ') || 'Not specified',
      collection_or_sku: data.get('collection_or_sku') || 'Not specified',
      message: data.get('message'),
      permission: data.get('permission') || 'No',
      source: data.get('source'),
      submitted_at: new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })
    };

    submitButton.disabled = true;
    setStatus('Sending your inquiry…');

    try {
      // Email 1: the inquiry, sent from sales@singerfabrics.com to the sales team.
      await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.salesTemplateId, templateParams, { publicKey: EMAIL_CONFIG.publicKey });

      // Email 2: a confirmation copy for the customer, when an email address was provided.
      let confirmationSent = false;
      if (templateParams.email) {
        try {
          await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.confirmationTemplateId, templateParams, { publicKey: EMAIL_CONFIG.publicKey });
          confirmationSent = true;
        } catch (confirmationError) {
          console.error('Customer confirmation email failed:', confirmationError);
        }
      }

      contactForm.reset();
      setStatus(confirmationSent
        ? 'Thank you. Your inquiry has reached our sales team and a confirmation email is on its way to you.'
        : 'Thank you. Your inquiry has reached our sales team and we will follow up shortly.', 'success');
    } catch (error) {
      console.error('Form delivery failed:', error);
      setStatus('Something went wrong and your inquiry was not sent. Please try again or email us directly at sales@singerfabrics.com.', 'error');
    } finally {
      submitButton.disabled = false;
    }
  });
}

// Refine the official anniversary identity while preserving a compact sticky header.
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const updateHeader = () => siteHeader.classList.toggle('is-compact', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });
}
