const google = require('googleapis');
const googleAuth = require('google-auth-library');

// const redirectUris = 'urn:ietf:wg:oauth:2.0:oob';

const authDetails = {
  installed: {
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    redirect_uris: process.env.redirect_uris,
  },
};

function authorize(credentials, response, callback) {
  const clientSecret = credentials.installed.client_secret;
  const clientId = credentials.installed.client_id;
  const redirectUrl = credentials.installed.redirect_uris;
  const auth = new googleAuth();
  const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  oauth2Client.credentials = {
    access_token: process.env.access_token,
    refresh_token: process.env.refresh_token,
    token_type: process.env.token_type,
    expiry_date: process.env.expiry_date,
  };
  callback(oauth2Client, response);
}

function render(auth, details) {
  const sheets = google.sheets('v4');
  sheets.spreadsheets.values.get(
    {
      auth,
      spreadsheetId: process.env.sheet_id,
      range: 'Report (Final) - Individual Checkins!A2:X',
    },
    (err, response) => {
      if (err) {
        console.log(`The API returned an error: ${err}`);
        return details.res.redirect('/login');
      }
      const rows = response.values;

      let filtered = rows.filter(row => row[12] === details.userMail && row[8] === details.userId);

      filtered = filtered.map(row => ({
        date: row[0],
        staff: `${row[4]} ${row[5]}`,
        client: row[13],
        fellow: row[9],
        ratings: row[18],
      }));

      return details.res.render('index', {
        title: 'Fellow Status',
        filtered,
      });
    },
  );
}

module.exports = {
  authDetails,
  authorize,
  render,
};
