const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'deensphere-175d5',
    clientEmail: 'firebase-adminsdk-fbsvc@deensphere-175d5.iam.gserviceaccount.com',
    privateKey: 're_ighSupGH_AD7nnC83TDS4XnSaDFHfhtz3'
  })
});

const app = express();
app.use(cors());
app.use(express.json());

app.post('/send-reset', async (req, res) => {
  const email = req.body && req.body.email;
  if (!email) return res.status(400).json({ error: 'Email required' });

  try {
    const link = await admin.auth().generatePasswordResetLink(email, {
      url: 'https://deensphere-175d5.web.app/'
    });

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 're_ighSupGH_AD7nnC83TDS4XnSaDFHfhtz3',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DeenSphere <onboarding@resend.dev>',
        to: email,
        subject: 'Reset your DeenSphere password',
        html: '<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;">' +
              '<h2 style="color:#1E8A5F;">DeenSphere</h2>' +
              '<p>Assalamu alaykum,</p>' +
              '<p>Click below to reset your password:</p>' +
              '<p><a href="' + link + '" style="background:#1E8A5F;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block;">Reset Password</a></p>' +
              '<p style="color:#888;font-size:12px;">If you did not request this, ignore this email.</p>' +
              '</div>'
      })
    });

    if (!r.ok) {
      const err = await r.text();
      throw new Error('Resend failed: ' + err);
    }
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
