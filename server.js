const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'deensphere-175d5',
    clientEmail: 'firebase-adminsdk-fbsvc@deensphere-175d5.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDsGw9ZrPSYMDGi\n8zBAdR5mWxwWp6Jw1aOclQl5sZJLsmxz862926FrUGouoMHzfkjEQY9pg+sDsn2A\npm5qxtkDi5qTruDQvVHQGnSH1H8lcnxn47p2rdPcQ28xaKvPi5onb/5CFsCqo2Ab\nh/Sm+AdfKjxAHjRj4/E3O8z2MKVXfbkycz/rrv3IcDqUdrSLrYs65ECZOd4KvN4P\np56CtCaB3dbv4aKBazmh/nrVdI4SrNwJYbyRiGnxN44AUOx/Pp20um2L9liSCMuo\nBKq9KNi/IVMeoVs8dmJ1CpLXv3xy+bIi8XkNqxv7gGbCfJLrn0qGzkM4BV3R2csI\nGLUvc65rAgMBAAECggEAC/LQOdtdD99ogHTKkIiDMe55PNN3W6FEKjMH2FPAy2BL\nlfagAhRKVl73o98/N+GNMMYy/Sw2Fk+ctrtoqeV6qzypmI21RnsLCxTVQhNIt/Sg\nqeh5a3LsKzpyak9/8/0YBdgbriAh2Fpz2hDTgPVBkj+JIW/yrZdy6DbeuxrGubQQ\n0V8EXJzwin3GGzhQPqpcjzmr/pIgVsXtpMqKSgnjCX4joa9RDQJmo6wtwrr1nQy4\nKzjlHW7X2dh4LLTTuhRhpkkKrG+cp2A92qibKrKI/m2Sur8ZmB/kfjeIhCLuvw92\nkqwZEVZrt9Oqql1SsLSjYd4HcULQTR5QquwnIAe2WQKBgQD38wTpGsgek+c52bfs\nOrVK69OYeLJ2+4OnQ3xRZYtOp0ef159Y2/bVEEwWN2ClXzTZWTO4RFO8JBXs9lmk\ngcMWC1rhdCU88trNy6gvV1aQWQGprU4AKjFbp8eyAn3NOrsMfksFMHBGpnT3LseU\nfLjlpDIcPKtRDBDLp9QYtOz6lwKBgQDzxZh5JY2hm3K2FvOuiYwzxk1HPPClnrW3\nVhq7B8+zg/v4N0rUX5SfYVxTkOpuylozAxbxTbfsCdZ2WyrDQBZD8pYTXaZDDNMn\ntD//dSCm5Qmyln8v982V1lIulhkXx0W6869Jl/R3BVeRAx7MWgyoJ1Y6NcNOP44K\n93oJaCsJTQKBgBfu90xg72w0Lp+g6mX9DL7coKIZFHDzujONChT5TkcbUoiVUaZM\nJTlPx2hllAiidgF84McqoUKJ4SvsY57Df8dC9VTJ10ZY0tIGlIdtUMfCL6znM55E\ndFs6iMYgA3Cp+KAuGKO5lzzamHO7qjwlBdv0y3l6SbcbCQv/eTOhUzalAoGBAIny\nASxdAd63tpwwNMlJ8NrDlqt/YrZ2L2KGCS5ZZ0GwqH932pJ/W/0s/TAUy3TScWR4\nlR0L285oasIjKPnAZFkjB6YB0roSodLP/38x6r5G0cwLugGM+vuVgn/2VFDOZTk7\n+K9um9pWXY0j9OOy+YKWcAcUsWawNFMkZBy6o8/pAoGAKTKyn46kbV4SVxvQ7bdZ\n6fh+KIzm07dkMB4RkVFtlgGo3B/QIod5xLaiae4k08RbMoP1JfWyEJW7gatIyzbl\noi520z3fsTbiZyQe7VQzPHya3cITVNP54jlLNdstxtPCbVlhGOlJdNtFCserucgY\n0Hawpjt8mceQAfVmivLOsJo=\n-----END PRIVATE KEY-----\n'
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
      url: 'https://deensphere-175d5.firebaseapp.com'
    });

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer re_D61u3hnf_8eX1cjin7TfvCXNuTuWenJk5',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'DeenSphere <noreply@mail.deensphere.com>',
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
