export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const { name, email, phone, company, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Please fill in name, email and message' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = env.RESEND_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Send email via Resend
    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL || 'Ouyee Display <inquiry@web.ouyedisplay.com>',
        to: [env.RESEND_TO_EMAIL || 'gzouyeedisplay@gmail.com'],
        subject: `【展柜咨询】来自 ${name}`,
        html: `
          <h2>New Showcase Inquiry</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="padding:8px 0;color:#666">Name</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Email</td><td>${escapeHtml(email)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Phone</td><td>${escapeHtml(phone || 'N/A')}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Company</td><td>${escapeHtml(company || 'N/A')}</td></tr>
            <tr><td style="padding:8px 0;color:#666">Message</td><td>${escapeHtml(message)}</td></tr>
          </table>
          <p style="color:#999;font-size:12px;margin-top:24px">This email was sent automatically from the Ouyee Display website contact form.</p>
        `,
      }),
    })

    if (!resendResp.ok) {
      const err = await resendResp.json()
      return new Response(JSON.stringify({ error: `Failed to send: ${err.message || 'Please try again later'}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error, please try again later' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
