export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json()
    const { name, email, phone, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: '请填写姓名、邮箱和需求描述' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = env.RESEND_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: '服务未配置，请联系管理员' }), {
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
        from: '臻艺展柜 <noreply@zhenyi-showcase.com>',
        to: ['hello@zhenyi-showcase.com'],
        subject: `【展柜咨询】来自 ${name}`,
        html: `
          <h2>新的展柜咨询</h2>
          <table style="border-collapse:collapse;width:100%;max-width:500px">
            <tr><td style="padding:8px 0;color:#666">姓名</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">邮箱</td><td>${escapeHtml(email)}</td></tr>
            <tr><td style="padding:8px 0;color:#666">电话</td><td>${escapeHtml(phone || '未提供')}</td></tr>
            <tr><td style="padding:8px 0;color:#666">需求</td><td>${escapeHtml(message)}</td></tr>
          </table>
          <p style="color:#999;font-size:12px;margin-top:24px">此邮件由臻艺展柜官网表单自动发送</p>
        `,
      }),
    })

    if (!resendResp.ok) {
      const err = await resendResp.json()
      return new Response(JSON.stringify({ error: `发送失败: ${err.message || '请稍后重试'}` }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ error: '服务器错误，请稍后重试' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
