const express = require('express');
const app = express();
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const port = process.env.PORT || 8080;

// Rota GET para redirecionar para o Cognito com lang=pt-BR
app.get(/^\/login(\/.*)?$/, (req, res) => {
  const queryParams = req.originalUrl.split('?')[1];
  const cognitoBaseUrl = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com/login';

  if (!queryParams) {
    return res.status(400).send('❌ Parâmetros de consulta ausentes.');
  }

  const redirectUrl = `${cognitoBaseUrl}?lang=pt-BR&${queryParams}`;

  console.log('🔁 Redirecionando para Cognito com URL completa:');
  console.log(redirectUrl);

  res.redirect(302, redirectUrl);
});

// Rota POST para repassar o token do Cognito ao AppSheet
app.post('/login/oauth2/token', express.urlencoded({ extended: true }), async (req, res) => {
  const url = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com/oauth2/token';
  console.log('🔁 POST -> Proxy token request to Cognito');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(req.body),
    });

    const text = await response.text();
    res.status(response.status).set(Object.fromEntries(response.headers.entries())).send(text);
  } catch (err) {
    console.error('❗ Proxy token error: ', err);
    res.status(500).send('Proxy error');
  }
});

// Inicia o servidor escutando na porta correta
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Proxy rodando em 0.0.0.0:${port}`);
});
