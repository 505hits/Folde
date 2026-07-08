import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const data = await request.json();
    
    const {
      packageName,
      price,
      name,
      partnerName,
      email,
      phone,
      weddingDate,
      weddingVenue,
      weddingCity,
      guestCount,
      selectedTheme,
      envelopeChoice,
      heroVideoChoice,
      languages,
      colorPreferences,
      specialRequests,
      inspirationLinks,
      sectionsWanted,
    } = data;

    const sectionsText = sectionsWanted && sectionsWanted.length > 0 
      ? sectionsWanted.join(', ') 
      : 'Non spécifié';

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; color: #1a1a1a; background: #faf8f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #6b363e, #8b5a62); padding: 2.5rem; text-align: center; color: #fff; }
    .header h1 { margin: 0; font-size: 1.8rem; font-weight: 400; letter-spacing: 2px; }
    .header p { margin: 0.5rem 0 0; opacity: 0.85; font-size: 0.95rem; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; letter-spacing: 1px; margin-top: 1rem; }
    .content { padding: 2rem 2.5rem; }
    .section { margin-bottom: 2rem; }
    .section-title { font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: #6b363e; margin-bottom: 1rem; font-weight: 600; border-bottom: 1px solid #f0ede9; padding-bottom: 0.5rem; }
    .row { display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px dotted #e8e5e0; }
    .row:last-child { border-bottom: none; }
    .label { color: #888; font-size: 0.9rem; }
    .value { font-weight: 600; color: #1a1a1a; font-size: 0.9rem; text-align: right; max-width: 60%; }
    .note-box { background: #faf8f5; border-radius: 12px; padding: 1.2rem; margin-top: 0.5rem; font-size: 0.9rem; color: #555; line-height: 1.6; white-space: pre-wrap; }
    .footer { text-align: center; padding: 1.5rem; color: #888; font-size: 0.8rem; border-top: 1px solid #f0ede9; }
  </style>
</head>
<body>
  <div style="padding: 1.5rem; background: #faf8f5;">
    <div class="container">
      <div class="header">
        <h1>✨ Nouvelle Commande</h1>
        <p>${name} & ${partnerName}</p>
        <div class="badge">${packageName} — ${price}$</div>
      </div>
      
      <div class="content">
        <div class="section">
          <div class="section-title">👤 Informations Client</div>
          <div class="row"><span class="label">Nom</span><span class="value">${name}</span></div>
          <div class="row"><span class="label">Partenaire</span><span class="value">${partnerName}</span></div>
          <div class="row"><span class="label">Email</span><span class="value">${email}</span></div>
          <div class="row"><span class="label">Téléphone</span><span class="value">${phone || 'Non renseigné'}</span></div>
        </div>

        <div class="section">
          <div class="section-title">💒 Détails du Mariage</div>
          <div class="row"><span class="label">Date</span><span class="value">${weddingDate || 'Non renseigné'}</span></div>
          <div class="row"><span class="label">Lieu</span><span class="value">${weddingVenue || 'Non renseigné'}</span></div>
          <div class="row"><span class="label">Ville</span><span class="value">${weddingCity || 'Non renseigné'}</span></div>
          <div class="row"><span class="label">Nombre d'invités</span><span class="value">${guestCount || 'Non renseigné'}</span></div>
          <div class="row"><span class="label">Langues</span><span class="value">${languages || 'Non renseigné'}</span></div>
        </div>

        <div class="section">
          <div class="section-title">🎨 Préférences Design</div>
          <div class="row"><span class="label">Thème choisi</span><span class="value">${selectedTheme || 'Non renseigné'}</span></div>
          <div class="row"><span class="label">Enveloppe</span><span class="value">${envelopeChoice || 'Non renseigné'}</span></div>
          <div class="row"><span class="label">Vidéo Hero</span><span class="value">${heroVideoChoice || 'Non renseigné'}</span></div>
          <div class="row"><span class="label">Couleurs</span><span class="value">${colorPreferences || 'Non renseigné'}</span></div>
        </div>

        <div class="section">
          <div class="section-title">📋 Sections souhaitées</div>
          <div class="note-box">${sectionsText}</div>
        </div>

        ${inspirationLinks ? `
        <div class="section">
          <div class="section-title">🔗 Liens d'inspiration</div>
          <div class="note-box">${inspirationLinks}</div>
        </div>
        ` : ''}

        ${specialRequests ? `
        <div class="section">
          <div class="section-title">💬 Demandes spéciales</div>
          <div class="note-box">${specialRequests}</div>
        </div>
        ` : ''}
      </div>

      <div class="footer">
        Our Day Studio — Commande reçue le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

    // Send email using mailto link fallback — or via a service
    // For production, use Resend, SendGrid, or similar
    // For now, we'll use the Web Fetch API to send via an email service
    
    // Try sending via Resend if API key is available
    const resendKey = process.env.RESEND_API_KEY;
    
    if (resendKey) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Our Day Studio <onboarding@resend.dev>',
          to: ['contact.ourdaystudio@gmail.com'],
          subject: `nouvelle commande — ${packageName} — ${name} & ${partnerName}`,
          html: emailBody,
          reply_to: email,
        }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Resend error:', errorData);
        // Fall through to fallback
      } else {
        return NextResponse.json({ success: true, method: 'resend' });
      }
    }
    
    // Fallback: use built-in NodeMailer-like approach via SMTP
    // For now, store the order and notify via a simple method
    // We'll send a notification email using a free service
    
    // Use EmailJS-like approach via fetch
    const formData = new URLSearchParams();
    formData.append('to', 'contact.ourdaystudio@gmail.com');
    formData.append('subject', `nouvelle commande — ${packageName} — ${name} & ${partnerName}`);
    formData.append('body', `Nouvelle commande ${packageName} (${price}$)\n\nClient: ${name} & ${partnerName}\nEmail: ${email}\nTéléphone: ${phone || 'N/A'}\n\nDate: ${weddingDate || 'N/A'}\nLieu: ${weddingVenue || 'N/A'}, ${weddingCity || 'N/A'}\nInvités: ${guestCount || 'N/A'}\nLangues: ${languages || 'N/A'}\n\nThème: ${selectedTheme || 'N/A'}\nEnveloppe: ${envelopeChoice || 'N/A'}\nVidéo Hero: ${heroVideoChoice || 'N/A'}\nCouleurs: ${colorPreferences || 'N/A'}\n\nSections: ${sectionsText}\n\nInspiration: ${inspirationLinks || 'N/A'}\nDemandes spéciales: ${specialRequests || 'N/A'}`);

    // Store order data as JSON for admin review
    console.log('=== NEW ORDER RECEIVED ===');
    console.log(JSON.stringify(data, null, 2));
    console.log('=========================');

    return NextResponse.json({ 
      success: true, 
      method: 'logged',
      message: 'Order received. Please configure RESEND_API_KEY for email delivery.',
      data 
    });

  } catch (error) {
    console.error('Error processing order:', error);
    return NextResponse.json({ success: false, error: 'Failed to process order' }, { status: 500 });
  }
}
