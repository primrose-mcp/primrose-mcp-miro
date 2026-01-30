/**
 * Miro MCP Server - Main Entry Point
 *
 * This file sets up the MCP server for Miro using Cloudflare's Agents SDK.
 *
 * MULTI-TENANT ARCHITECTURE:
 * Tenant credentials (access tokens) are parsed from request headers,
 * allowing a single server deployment to serve multiple customers.
 *
 * Required Headers:
 * - X-Miro-Access-Token: Miro OAuth access token
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { createMiroClient } from './client.js';
import {
  registerBoardTools,
  registerMemberTools,
  registerItemTools,
  registerStickyNoteTools,
  registerShapeTools,
  registerTextTools,
  registerCardTools,
  registerFrameTools,
  registerConnectorTools,
  registerImageTools,
  registerTagTools,
  registerEmbedTools,
  registerAppCardTools,
  registerDocumentTools,
} from './tools/index.js';
import {
  type Env,
  type TenantCredentials,
  parseTenantCredentials,
  validateCredentials,
} from './types/env.js';

// =============================================================================
// MCP Server Configuration
// =============================================================================

const SERVER_NAME = 'primrose-mcp-miro';
const SERVER_VERSION = '1.0.0';

// =============================================================================
// MCP Agent (Stateful - uses Durable Objects)
// =============================================================================

export class MiroMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  async init() {
    throw new Error(
      'Stateful mode (McpAgent) is not supported for multi-tenant deployments. ' +
        'Use the stateless /mcp endpoint with X-Miro-Access-Token header instead.'
    );
  }
}

// =============================================================================
// Stateless MCP Server (Recommended - no Durable Objects needed)
// =============================================================================

function createStatelessServer(credentials: TenantCredentials): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Create client with tenant-specific credentials
  const client = createMiroClient(credentials);

  // Register all Miro tools
  registerBoardTools(server, client);
  registerMemberTools(server, client);
  registerItemTools(server, client);
  registerStickyNoteTools(server, client);
  registerShapeTools(server, client);
  registerTextTools(server, client);
  registerCardTools(server, client);
  registerFrameTools(server, client);
  registerConnectorTools(server, client);
  registerImageTools(server, client);
  registerTagTools(server, client);
  registerEmbedTools(server, client);
  registerAppCardTools(server, client);
  registerDocumentTools(server, client);

  // Test connection tool
  server.tool('miro_test_connection', 'Test the connection to the Miro API', {}, async () => {
    try {
      const result = await client.testConnection();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// =============================================================================
// Worker Export
// =============================================================================

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', server: SERVER_NAME }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Stateless MCP with Streamable HTTP
    if (url.pathname === '/mcp' && request.method === 'POST') {
      // Parse tenant credentials from request headers
      const credentials = parseTenantCredentials(request);

      // Validate credentials are present
      try {
        validateCredentials(credentials);
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Unauthorized',
            message: error instanceof Error ? error.message : 'Invalid credentials',
            required_headers: ['X-Miro-Access-Token'],
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Create server with tenant-specific credentials
      const server = createStatelessServer(credentials);

      // Import and use createMcpHandler for streamable HTTP
      const { createMcpHandler } = await import('agents/mcp');
      const handler = createMcpHandler(server);
      return handler(request, env, ctx);
    }

    // SSE endpoint for legacy clients
    if (url.pathname === '/sse') {
      return new Response('SSE endpoint requires Durable Objects. Enable in wrangler.jsonc.', {
        status: 501,
      });
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        description: 'Multi-tenant Miro MCP Server',
        endpoints: {
          mcp: '/mcp (POST) - Streamable HTTP MCP endpoint',
          health: '/health - Health check',
        },
        authentication: {
          description: 'Pass Miro credentials via request headers',
          required_headers: {
            'X-Miro-Access-Token': 'Miro OAuth access token',
          },
        },
        tools: [
          // Boards
          'miro_list_boards',
          'miro_get_board',
          'miro_create_board',
          'miro_update_board',
          'miro_delete_board',
          'miro_copy_board',
          // Members
          'miro_list_board_members',
          'miro_get_board_member',
          'miro_share_board',
          'miro_update_board_member',
          'miro_remove_board_member',
          // Items
          'miro_list_items',
          'miro_get_item',
          'miro_update_item_position',
          'miro_delete_item',
          // Sticky Notes
          'miro_create_sticky_note',
          'miro_get_sticky_note',
          'miro_update_sticky_note',
          'miro_delete_sticky_note',
          // Shapes
          'miro_create_shape',
          'miro_get_shape',
          'miro_update_shape',
          'miro_delete_shape',
          // Text
          'miro_create_text',
          'miro_get_text',
          'miro_update_text',
          'miro_delete_text',
          // Cards
          'miro_create_card',
          'miro_get_card',
          'miro_update_card',
          'miro_delete_card',
          // Frames
          'miro_create_frame',
          'miro_get_frame',
          'miro_update_frame',
          'miro_delete_frame',
          'miro_get_frame_items',
          // Connectors
          'miro_list_connectors',
          'miro_create_connector',
          'miro_get_connector',
          'miro_update_connector',
          'miro_delete_connector',
          // Images
          'miro_create_image',
          'miro_get_image',
          'miro_update_image',
          'miro_delete_image',
          // Tags
          'miro_list_tags',
          'miro_create_tag',
          'miro_get_tag',
          'miro_update_tag',
          'miro_delete_tag',
          'miro_attach_tag',
          'miro_remove_tag',
          'miro_get_items_by_tag',
          'miro_get_item_tags',
          // Embeds
          'miro_create_embed',
          'miro_get_embed',
          'miro_update_embed',
          'miro_delete_embed',
          // App Cards
          'miro_create_app_card',
          'miro_get_app_card',
          'miro_update_app_card',
          'miro_delete_app_card',
          // Documents
          'miro_create_document',
          'miro_get_document',
          'miro_delete_document',
          // Connection
          'miro_test_connection',
        ],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
