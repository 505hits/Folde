import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    '/api/rsvp',
    '/api/guest-upload',
    '/api/wedding-media',
    '/api/ai-photo',
    '/api/ai-music',
    '/api/ai-reference-upload',
    '/api/send-preview',
    '/api/send-order',
    '/api/send-revision',
    '/api/send-feedback',
    '/api/create-checkout-session',
    '/api/affiliate',
    '/api/affiliate/click',
  ].map(path => ({ path, method: 'POST', advancedOptions: { checkLevel: 'basic' } })).concat(
    { path: '/api/affiliate', method: 'PATCH', advancedOptions: { checkLevel: 'basic' } },
  ),
});
