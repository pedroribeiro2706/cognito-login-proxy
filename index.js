const express = require('express');
const app = express();
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

// Porta dinâmica (Railway usa process.env.PORT)
const port = process.env.PORT || 3000;

// Body parser SÓ para a rota do token
app.use('/login/oauth2/token', express.urlencoded({ extended: true }));

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

// POST para troca de code por token (OAuth2)
app.post('/login/oauth2/token', async (req, res) => {
  const url = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com/oauth2/token';
  console.log('🔁 POST -> Proxy token request to Cognito');
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(req.body),
    });

    // Copia status e headers da resposta do Cognito
    const text = await response.text();
    res.status(response.status);
    for (const [key, value] of response.headers) {
      res.setHeader(key, value);
    }
    res.send(text);
  } catch (err) {
    console.error('❗ Proxy token error: ', err);
    res.status(500).send('Proxy error');
  }
});

// Healthcheck (opcional, útil para Railway)
app.get('/health', (req, res) => res.send('OK'));

// Inicia o servidor escutando na porta correta
app.listen(port, '0.0.0.0', () => {
  console.log(`✅ Proxy rodando em 0.0.0.0:${port}`);
});
