#!/usr/bin/env node
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const client = new Client(
    { name: 'output-schema-test', version: '1.0.0' },
    { capabilities: {} }
);
const transport = new StdioClientTransport({
    command: 'node',
    args: [fileURLToPath(new URL('../dist/index.js', import.meta.url))],
});

try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    assert.ok(tools.length > 0, 'Expected Desktop Commander tools');

    for (const tool of tools) {
        assert.equal(tool.outputSchema?.type, 'object', `${tool.name} must advertise an object outputSchema`);
        assert.equal(tool.outputSchema?.required, undefined);
        assert.equal(tool.outputSchema?.properties?.tool, undefined);
        assert.equal(tool.outputSchema?.properties?.summary, undefined);
        assert.equal(tool.outputSchema?.properties?.text?.type, 'string');
    }

    const listResult = await client.callTool({
        name: 'list_searches',
        arguments: {},
    });
    assert.equal(listResult.isError, undefined);
    assert.equal(listResult.structuredContent?.tool, undefined);
    assert.equal(listResult.structuredContent?.summary, undefined);

    const configResult = await client.callTool({
        name: 'get_config',
        arguments: {},
    });
    assert.equal(configResult.isError, undefined);
    assert.equal(configResult.structuredContent?.tool, undefined);
    assert.equal(configResult.structuredContent?.summary, undefined);
    assert.ok(configResult.structuredContent?.config, 'Existing get_config structured metadata must be preserved');

    const packagePath = fileURLToPath(new URL('../package.json', import.meta.url));
    const readResult = await client.callTool({
        name: 'read_file',
        arguments: { path: packagePath },
    });
    assert.equal(readResult.structuredContent?.tool, undefined);
    assert.equal(readResult.structuredContent?.summary, undefined);
    assert.equal(typeof readResult.structuredContent?.text, 'string');
    assert.ok(readResult.structuredContent.text.includes('desktop-commander'));

    const uiReadResult = await client.callTool({
        name: 'read_file',
        arguments: { path: packagePath, origin: 'ui' },
    });
    assert.equal(uiReadResult.structuredContent?.tool, undefined);
    assert.equal(uiReadResult.structuredContent?.fileName, 'package.json');
    assert.equal(uiReadResult.structuredContent?.summary, undefined);
    assert.equal(uiReadResult.structuredContent?.text, undefined, 'UI reads must not duplicate file contents');

    console.log(`Tool output schema test passed for ${tools.length} tools`);
} finally {
    await client.close();
}
