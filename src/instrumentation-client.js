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
    '/api/create-checkout-session',
  ].map(path => ({ path, method: 'POST', advancedOptions: { checkLevel: 'basic' } })),
});
