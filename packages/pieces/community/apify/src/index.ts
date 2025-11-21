import { createPiece, PieceAuth } from '@activepieces/pieces-framework';
import { PieceCategory } from '@activepieces/shared';
import { getDatasetItems } from './lib/actions/get-dataset-items';
import { runActor } from './lib/actions/run-actor';
import { createApifyClient } from './lib/common';
import { getKeyValueStoreRecord } from './lib/actions/get-key-value-store-record';
import { scrapeSingleUrl } from './lib/actions/scrape-single-url';
import { runTask } from './lib/actions/run-task';
import { watchTaskRunsTrigger } from './lib/triggers/watch-task-runs';
import { watchActorRunsTrigger } from './lib/triggers/watch-actor-runs';

export const apifyAuth = PieceAuth.OAuth2({
  description: 'Connect to your Apify account',
  authUrl: 'https://console.apify.com/authorize/oauth',
  tokenUrl: 'https://console-backend.apify.com/oauth/apps/token',
  required: true,
  scope: ['profile', 'full_api_access'],

  validate: async ({ auth }) => {
    try {
      const client = createApifyClient(auth);
      await client.user('me').get();
      return { valid: true };
    } catch (error: any) {
      if (error.statusCode === 401) {
        return {
          valid: false,
          error: 'Invalid API token. Please check your token in Apify account settings.'
        };
      }

      return {
        valid: false,
        error: 'Unable to validate API token. Please check your connection and try again.'
      };
    }
  },
})

export const apify = createPiece({
  displayName: 'Apify',
  description: 'Your full‑stack platform for web scraping',
  auth: apifyAuth,
  minimumSupportedRelease: '0.30.0',
  logoUrl: 'https://cdn.activepieces.com/pieces/apify.svg',
  categories: [PieceCategory.BUSINESS_INTELLIGENCE],
  authors: ['buttonsbond'],
  actions: [getDatasetItems, runActor, runTask, getKeyValueStoreRecord, scrapeSingleUrl],
  triggers: [watchActorRunsTrigger, watchTaskRunsTrigger],
});
