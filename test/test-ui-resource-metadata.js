import assert from 'assert';
import { readUiResource } from '../dist/ui/resources.js';
import {
  CONFIG_EDITOR_RESOURCE_URI,
  FILE_PREVIEW_RESOURCE_URI
} from '../dist/ui/contracts.js';

const testDomain = 'https://widgets.example.test';
const previousDomain = process.env.DESKTOP_COMMANDER_WIDGET_DOMAIN;
process.env.DESKTOP_COMMANDER_WIDGET_DOMAIN = testDomain;

try {
  for (const uri of [FILE_PREVIEW_RESOURCE_URI, CONFIG_EDITOR_RESOURCE_URI]) {
    const response = await readUiResource(uri);
    assert.ok(response, `Expected UI resource for ${uri}`);
    const meta = response.contents[0]._meta;
    assert.ok(meta, `Expected _meta for ${uri}`);
    assert.deepStrictEqual(meta.ui, {
      csp: { connectDomains: [], resourceDomains: [] },
      domain: testDomain
    });
    assert.deepStrictEqual(meta['openai/widgetCSP'], {
      connect_domains: [],
      resource_domains: []
    });
    assert.strictEqual(meta['openai/widgetDomain'], testDomain);
  }
  console.log('UI resource CSP/domain metadata test passed');
} finally {
  if (previousDomain === undefined) delete process.env.DESKTOP_COMMANDER_WIDGET_DOMAIN;
  else process.env.DESKTOP_COMMANDER_WIDGET_DOMAIN = previousDomain;
}
