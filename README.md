# SINGER Fabrics Global Sewing Summit Website

This project is a responsive three page event website built with HTML, CSS and JavaScript.

## Included pages

1. `index.html` presents the SINGER Fabrics brand, the 175 year anniversary identity, collection highlights, packaging details and the wholesale ordering process.
2. `catalog.html` presents the complete 24 page 2026 Global Sewing Summit catalog through an interactive page turn viewer with a mobile fallback.
3. `contact.html` contains the wholesale sales inquiry form.

## Official assets included

The project uses the supplied 2026 SINGER 175 Years anniversary logo, the supplied 2026 SINGER brand color system, Poppins typography and the complete supplied catalog.

## Connect the contact form to sales@singerfabrics.com

The form on `contact.html` sends email through [EmailJS](https://www.emailjs.com), which works on GitHub Pages because it needs no server and no secret keys in the code. Every completed submission delivers two emails, both sent from `sales@singerfabrics.com`:

1. The inquiry, to `sales@singerfabrics.com`, `aliceli@chinatexny.com`, `sylvazhang@chinatexny.com` and `james.sun@linqx.io`.
2. A confirmation copy to the email address the customer entered.

The `singerfabrics.com` mailbox is hosted on Microsoft 365 (see the MX and SPF records in `Advanced DNS.pdf`), so EmailJS sends through the real mailbox and no DNS changes are needed for email delivery.

### Step 1. Create the EmailJS account and connect the mailbox

1. Sign up free at https://www.emailjs.com (the free plan includes 200 emails per month; each submission uses 2).
2. Open **Email Services**, choose **Add New Service**, and pick **Outlook 365**.
3. Sign in with the `sales@singerfabrics.com` Microsoft account and accept the permission prompt. This lets EmailJS send from that mailbox without exposing its password.
4. Note the **Service ID**.

### Step 2. Create the sales notification template

Open **Email Templates**, choose **Create New Template**, and configure:

- **To Email**: `sales@singerfabrics.com, aliceli@chinatexny.com, sylvazhang@chinatexny.com, james.sun@linqx.io`
- **From Name**: `SINGER Fabrics Website`
- **Reply To**: `{{email}}`
- **Subject**: `New Sales Inquiry from {{name}} ({{company}})`
- **Content**:

```
New sales inquiry submitted {{submitted_at}} via {{source}}.

Full Name: {{name}}
Company: {{company}}
Business Email: {{email}}
Phone: {{phone}}
Business Type: {{business_type}}
Estimated Order Volume: {{estimated_order_volume}}
Products Of Interest: {{products}}
Collection Or SKU Interest: {{collection_or_sku}}
Agreed to be contacted: {{permission}}

Message:
{{message}}
```

Save it and note the **Template ID**.

### Step 3. Create the customer confirmation template

Create a second template:

- **To Email**: `{{email}}`
- **From Name**: `SINGER Fabrics Sales`
- **Reply To**: `sales@singerfabrics.com`
- **Subject**: `We received your inquiry, {{name}}`
- **Content**:

```
Hi {{name}},

Thank you for contacting SINGER Fabrics. Our sales team has received your inquiry and will follow up with collection information, availability, pricing and applicable order requirements.

Here is a copy of what you submitted:

Company: {{company}}
Phone: {{phone}}
Business Type: {{business_type}}
Estimated Order Volume: {{estimated_order_volume}}
Products Of Interest: {{products}}
Collection Or SKU Interest: {{collection_or_sku}}

Message:
{{message}}

SINGER Fabrics Sales
sales@singerfabrics.com
```

Save it and note the second **Template ID**.

### Step 4. Add the four values to the website

Open `script.js`, find `EMAIL_CONFIG`, and replace the placeholders with the **Public Key** (found under Account, General), the **Service ID** and the two **Template IDs**. The public key is designed to be published, so committing it to the public repository is safe.

### Step 5. Recommended hardening

In the EmailJS dashboard under Account, Security, enable **Allow EmailJS API calls only from specified domains** and add the production domain. This stops other sites from reusing the public key.

## Preview locally

Open the folder in VS Code and use Live Server. Opening the HTML files directly also works for most features, but Live Server provides more reliable catalog loading.

## Publish with GitHub Pages

1. Create a GitHub repository.
2. Upload all files and folders from this project.
3. Open repository Settings, then Pages.
4. Choose the main branch and root folder.
5. Save and wait for deployment. The site is now live at `https://<username>.github.io/<repository>/`.

### Use the singerfabrics.com domain (optional)

The domain is managed in Namecheap under Domain List, Advanced DNS (the panel shown in `Advanced DNS.pdf`). To point it at GitHub Pages, add these records:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A Record | `@` | `185.199.108.153` | Automatic |
| A Record | `@` | `185.199.109.153` | Automatic |
| A Record | `@` | `185.199.110.153` | Automatic |
| A Record | `@` | `185.199.111.153` | Automatic |
| CNAME Record | `www` | `<username>.github.io.` | Automatic |

**Do not change or remove the existing records** — the MX record, the two TXT records (`MS=...` and `v=spf1...`) and the `autodiscover` CNAME run the `sales@singerfabrics.com` Microsoft 365 mailbox that the contact form sends through.

Then, in repository Settings, Pages, enter `singerfabrics.com` as the custom domain (GitHub commits a `CNAME` file automatically), wait for the DNS check, and turn on **Enforce HTTPS** once the certificate is issued. If EmailJS domain restriction was enabled in form Step 5, add `singerfabrics.com` and `www.singerfabrics.com` to the allowed domains.

### Test the form end to end

After the EmailJS values are in `script.js` and the site is deployed, submit a test inquiry with a personal email address in the Business Email field. Confirm the inquiry arrives in all four sales inboxes and the confirmation arrives at the personal address. If anything is missing, open the EmailJS dashboard History page to see each send and any error.

## Important brand review items

Before public launch, confirm final approval for the anniversary logo, all legal attribution language, event wording, product availability statements and any commercial packaging details that are not printed in the catalog.
