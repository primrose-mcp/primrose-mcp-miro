/**
 * Embed Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError } from '../utils/formatters.js';

export function registerEmbedTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create Embed
  // ===========================================================================
  server.tool(
    'miro_create_embed',
    `Create an embed (iFrame) on a Miro board.

Args:
  - boardId: Board ID
  - url: URL to embed (must be from a supported service)
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - width: Width in pixels
  - height: Height in pixels
  - mode: Display mode (inline, modal)

Returns:
  The created embed with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      url: z.string().url().describe('URL to embed'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      width: z.number().optional().describe('Width in pixels'),
      height: z.number().optional().describe('Height in pixels'),
      mode: z.enum(['inline', 'modal']).optional().describe('Display mode'),
    },
    async ({ boardId, url, x, y, width, height, mode }) => {
      try {
        const input: {
          data: { url: string; mode?: 'inline' | 'modal' };
          position: { x: number; y: number };
          geometry?: { width?: number; height?: number };
        } = {
          data: { url },
          position: { x, y },
        };

        if (mode) input.data.mode = mode;
        if (width || height) input.geometry = { width, height };

        const embed = await client.createEmbed(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Embed created', embed }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Embed
  // ===========================================================================
  server.tool(
    'miro_get_embed',
    `Get a specific embed from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Embed ID

Returns:
  Embed details including URL, position, and dimensions.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Embed ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const embed = await client.getEmbed(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(embed, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Embed
  // ===========================================================================
  server.tool(
    'miro_update_embed',
    `Update an existing embed on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Embed ID
  - x: New X coordinate
  - y: New Y coordinate
  - width: New width
  - height: New height

Returns:
  The updated embed.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Embed ID'),
      x: z.number().optional().describe('New X coordinate'),
      y: z.number().optional().describe('New Y coordinate'),
      width: z.number().optional().describe('New width'),
      height: z.number().optional().describe('New height'),
    },
    async ({ boardId, itemId, x, y, width, height }) => {
      try {
        const input: {
          position?: { x: number; y: number };
          geometry?: { width?: number; height?: number };
        } = {};

        if (x !== undefined && y !== undefined) input.position = { x, y };
        if (width !== undefined || height !== undefined) input.geometry = { width, height };

        const embed = await client.updateEmbed(boardId, itemId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Embed updated', embed }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Embed
  // ===========================================================================
  server.tool(
    'miro_delete_embed',
    `Delete an embed from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Embed ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Embed ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteEmbed(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Embed ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
