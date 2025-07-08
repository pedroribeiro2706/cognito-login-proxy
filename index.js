const express = require('express');
const app = express();
const port = 3000;

// Captura qualquer rota que comece com /login
app.get(/^\/login/, (req, res) => {
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

// POST para trocar code pelo token (NOVA PARTE)
app.use('/login/oauth2/token', express.urlencoded({ extended: true }));

app.post('/login/oauth2/token', async (req, res) => {
  const url = 'https://us-east-1tdcs53wtg.auth.us-east-1.amazoncognito.com/oauth2/token';
  console.log('🔁 POST -> Proxy token request to Cognito');
  try {
    const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(req.body),
    });

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

// app.listen(port, () => {
//   console.log(`✅ Proxy ouvindo em http://localhost:${port}`);
// });

app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Proxy rodando em 0.0.0.0:${port}`);
});