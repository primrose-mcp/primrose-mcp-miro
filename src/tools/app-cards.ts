/**
 * App Card Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError } from '../utils/formatters.js';

export function registerAppCardTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create App Card
  // ===========================================================================
  server.tool(
    'miro_create_app_card',
    `Create an app card on a Miro board.

Args:
  - boardId: Board ID
  - title: Card title (required)
  - description: Card description
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - status: Card status (disconnected, connected, disabled)

Returns:
  The created app card with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      title: z.string().describe('Card title'),
      description: z.string().optional().describe('Card description'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      status: z.enum(['disconnected', 'connected', 'disabled']).optional().describe('Card status'),
    },
    async ({ boardId, title, description, x, y, status }) => {
      try {
        const input: {
          data: { title: string; description?: string; status?: 'disconnected' | 'connected' | 'disabled' };
          position: { x: number; y: number };
        } = {
          data: { title },
          position: { x, y },
        };

        if (description) input.data.description = description;
        if (status) input.data.status = status;

        const appCard = await client.createAppCard(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'App card created', appCard }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get App Card
  // ===========================================================================
  server.tool(
    'miro_get_app_card',
    `Get a specific app card from a Miro board.

Args:
  - boardId: Board ID
  - itemId: App card ID

Returns:
  App card details including title, description, and status.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('App card ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const appCard = await client.getAppCard(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(appCard, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update App Card
  // ===========================================================================
  server.tool(
    'miro_update_app_card',
    `Update an existing app card on a Miro board.

Args:
  - boardId: Board ID
  - itemId: App card ID
  - title: New card title
  - description: New card description
  - x: New X coordinate
  - y: New Y coordinate
  - status: New card status

Returns:
  The updated app card.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('App card ID'),
      title: z.string().optional().describe('New card title'),
      description: z.string().optional().describe('New card description'),
      x: z.number().optional().describe('New X coordinate'),
      y: z.number().optional().describe('New Y coordinate'),
      status: z.enum(['disconnected', 'connected', 'disabled']).optional().describe('New card status'),
    },
    async ({ boardId, itemId, title, description, x, y, status }) => {
      try {
        const input: {
          data?: { title?: string; description?: string; status?: 'disconnected' | 'connected' | 'disabled' };
          position?: { x: number; y: number };
        } = {};

        if (title || description || status) {
          input.data = {};
          if (title) input.data.title = title;
          if (description) input.data.description = description;
          if (status) input.data.status = status;
        }
        if (x !== undefined && y !== undefined) input.position = { x, y };

        const appCard = await client.updateAppCard(boardId, itemId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'App card updated', appCard }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete App Card
  // ===========================================================================
  server.tool(
    'miro_delete_app_card',
    `Delete an app card from a Miro board.

Args:
  - boardId: Board ID
  - itemId: App card ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('App card ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteAppCard(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `App card ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
