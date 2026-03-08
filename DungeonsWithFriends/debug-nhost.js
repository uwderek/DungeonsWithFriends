const { NhostClient } = require('@nhost/nhost-js');
const nhost = new NhostClient({ subdomain: 'local', region: 'local' });
console.log('Nhost keys:', Object.keys(nhost));
console.log('Nhost.auth keys:', Object.keys(nhost.auth));
