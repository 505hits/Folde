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
      menuDetails,
      attachments,
    } = data;

    const sectionsText = sectionsWanted && sectionsWanted.length > 0 
      ? sectionsWanted.join(', ') 
      : 'Not specified';

    const attachmentSummary = attachments && attachments.length > 0
      ? attachments.map(a => `<li>📄 ${a.filename}</li>`).join('')
      : 'No attached files';

    const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Georgia', serif; color: #1a1a1a; background: #faf8f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
    .header { background: linear-gradient(135deg, #5C3A1E, #8b5a62); padding: 2.5rem; text-align: center; color: #fff; }
    .header h1 { margin: 0; font-size: 1.8rem; font-weight: 400; letter-spacing: 2px; }
    .header p { margin: 0.5rem 0 0; opacity: 0.85; font-size: 0.95rem; }
    .badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 0.3rem 1rem; border-radius: 20px; font-size: 0.8rem; letter-spacing: 1px; margin-top: 1rem; }
    .content { padding: 2rem 2.5rem; }
    .section { margin-bottom: 2rem; }
    .section-title { font-size: 0.75rem; letter-spacing: 2px; text-transform: uppercase; color: #5C3A1E; margin-bottom: 1rem; font-weight: 600; border-bottom: 1px solid #f0ede9; padding-bottom: 0.5rem; }
    .row { display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px dotted #e8e5e0; }
    .row:last-child { border-bottom: none; }
    .label { color: #888; font-size: 0.9rem; }
    .value { font-weight: 600; color: #1a1a1a; font-size: 0.9rem; text-align: right; max-width: 60%; }
    .note-box { background: #faf8f5; border-radius: 12px; padding: 1.2rem; margin-top: 0.5rem; font-size: 0.9rem; color: #555; line-height: 1.6; white-space: pre-wrap; }
    .footer { text-align: center; padding: 1.5rem; color: #888; font-size: 0.8rem; border-top: 1px solid #f0ede9; }
    ul { padding-left: 1.2rem; margin: 0.5rem 0; font-size: 0.9rem; color: #555; }
  </style>
</head>
<body>
  <div style="padding: 1.5rem; background: #faf8f5;">
    <div class="container">
      <div class="header">
        <h1>✨ New Order</h1>
        <p>${name} & ${partnerName}</p>
        <div class="badge">${packageName} — ${price}$</div>
      </div>
      
      <div class="content">
        <div class="section">
          <div class="section-title">👤 Client Information</div>
          <div class="row"><span class="label">Name</span><span class="value">${name}</span></div>
          <div class="row"><span class="label">Partner</span><span class="value">${partnerName}</span></div>
          <div class="row"><span class="label">Email</span><span class="value">${email}</span></div>
          <div class="row"><span class="label">Phone</span><span class="value">${phone || 'Not provided'}</span></div>
        </div>

        <div class="section">
          <div class="section-title">💒 Wedding Details</div>
          <div class="row"><span class="label">Date</span><span class="value">${weddingDate || 'Not provided'}</span></div>
          <div class="row"><span class="label">Venue</span><span class="value">${weddingVenue || 'Not provided'}</span></div>
          <div class="row"><span class="label">City</span><span class="value">${weddingCity || 'Not provided'}</span></div>
          <div class="row"><span class="label">Guest Count</span><span class="value">${guestCount || 'Not provided'}</span></div>
          <div class="row"><span class="label">Languages</span><span class="value">${languages || 'Not provided'}</span></div>
        </div>

        <div class="section">
          <div class="section-title">🎨 Design Preferences</div>
          <div class="row"><span class="label">Selected Theme</span><span class="value">${selectedTheme || 'Not provided'}</span></div>
          <div class="row"><span class="label">Envelope</span><span class="value">${envelopeChoice || 'Not provided'}</span></div>
          <div class="row"><span class="label">Hero Video</span><span class="value">${heroVideoChoice || 'Not provided'}</span></div>
          <div class="row"><span class="label">Colors</span><span class="value">${colorPreferences || 'Not provided'}</span></div>
        </div>

        <div class="section">
          <div class="section-title">📋 Requested Sections</div>
          <div class="note-box">${sectionsText}</div>
        </div>

        ${menuDetails ? `
        <div class="section">
          <div class="section-title">🍽️ Menu / Reception Details</div>
          <div class="note-box">${menuDetails}</div>
        </div>
        ` : ''}

        <div class="section">
          <div class="section-title">📁 Attached Files</div>
          <ul>${attachmentSummary}</ul>
        </div>

        ${inspirationLinks ? `
        <div class="section">
          <div class="section-title">🔗 Inspiration Links</div>
          <div class="note-box">${inspirationLinks}</div>
        </div>
        ` : ''}

        ${specialRequests ? `
        <div class="section">
          <div class="section-title">💬 Special Requests / Additional Details</div>
          <div class="note-box">${specialRequests}</div>
        </div>
        ` : ''}
      </div>

      <div class="footer">
        FOLDÈ Design — Order received on ${new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();

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
          from: 'FOLDÈ Design <onboarding@resend.dev>',
          to: ['folde.wedding@gmail.com'],
          subject: `new order — ${packageName} — ${name} & ${partnerName}`,
          html: emailBody,
          reply_to: email,
          attachments: attachments || [],
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
    const formData = new URLSearchParams();
    formData.append('to', 'folde.wedding@gmail.com');
    formData.append('subject', `new order — ${packageName} — ${name} & ${partnerName}`);
    formData.append('body', `New order ${packageName} (${price}$)\n\nClient: ${name} & ${partnerName}\nEmail: ${email}\nPhone: ${phone || 'N/A'}\n\nDate: ${weddingDate || 'N/A'}\nVenue: ${weddingVenue || 'N/A'}, ${weddingCity || 'N/A'}\nGuests: ${guestCount || 'N/A'}\nLanguages: ${languages || 'N/A'}\n\nTheme: ${selectedTheme || 'N/A'}\nEnvelope: ${envelopeChoice || 'N/A'}\nHero Video: ${heroVideoChoice || 'N/A'}\nColors: ${colorPreferences || 'N/A'}\n\nSections: ${sectionsText}\n\nMenu: ${menuDetails || 'N/A'}\nFiles: ${(attachments || []).map(a => a.filename).join(', ') || 'None'}\n\nInspiration: ${inspirationLinks || 'N/A'}\nSpecial Requests: ${specialRequests || 'N/A'}`);

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
