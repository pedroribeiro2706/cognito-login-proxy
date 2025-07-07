const express = require('express');
const app = express();

// Certifique-se de definir a porta corretamente
const port = process.env.PORT || 3000;

// GET para criar URL com state + lang
app.get(/^\/login/, (req, res) => {
  const queryParams = req.originalUrl.split('?')[1];
  if (!queryParams) return res.status(400).send('❌ Parâmetros ausentes');

  const cognitoBase = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com/login';
  const redirectUrl = `${cognitoBase}?lang=pt-BR&${queryParams}`;

  console.log('🔁 GET /login → redirecionar para:', redirectUrl);
  res.redirect(302, redirectUrl);
});

// POST para repassar token do Cognito
app.post('/login/oauth2/token', express.urlencoded({ extended: true }), async (req, res) => {
  const tokenUrl = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com/oauth2/token';
  console.log('🔁 POST /login/oauth2/token → repassando token');

  try {
    const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(req.body)
    });
    const text = await resp.text();
    res.status(resp.status)
       .set(Object.fromEntries(resp.headers.entries()))
       .send(text);
  } catch (err) {
    console.error('❗ Erro no proxy token:', err);
    res.status(500).send('Proxy token error');
  }
});

// Inicie o servidor corretamente
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Proxy rodando em 0.0.0.0:${port}`);
});
