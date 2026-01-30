/**
 * Card Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError } from '../utils/formatters.js';

export function registerCardTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create Card
  // ===========================================================================
  server.tool(
    'miro_create_card',
    `Create a card on a Miro board.

Args:
  - boardId: Board ID
  - title: Card title (required)
  - description: Card description
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - dueDate: Due date in ISO format
  - assigneeId: Assignee user ID

Returns:
  The created card with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      title: z.string().describe('Card title'),
      description: z.string().optional().describe('Card description'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      dueDate: z.string().optional().describe('Due date in ISO format'),
      assigneeId: z.string().optional().describe('Assignee user ID'),
    },
    async ({ boardId, title, description, x, y, dueDate, assigneeId }) => {
      try {
        const input: {
          data: { title: string; description?: string; dueDate?: string; assigneeId?: string };
          position: { x: number; y: number };
        } = {
          data: { title },
          position: { x, y },
        };

        if (description) input.data.description = description;
        if (dueDate) input.data.dueDate = dueDate;
        if (assigneeId) input.data.assigneeId = assigneeId;

        const card = await client.createCard(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Card created', card }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Card
  // ===========================================================================
  server.tool(
    'miro_get_card',
    `Get a specific card from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Card ID

Returns:
  Card details including title, description, due date, and assignee.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Card ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const card = await client.getCard(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(card, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Card
  // ===========================================================================
  server.tool(
    'miro_update_card',
    `Update an existing card on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Card ID
  - title: New card title
  - description: New card description
  - x: New X coordinate
  - y: New Y coordinate
  - dueDate: New due date in ISO format
  - assigneeId: New assignee user ID

Returns:
  The updated card.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Card ID'),
      title: z.string().optional().describe('New card title'),
      description: z.string().optional().describe('New card description'),
      x: z.number().optional().describe('New X coordinate'),
      y: z.number().optional().describe('New Y coordinate'),
      dueDate: z.string().optional().describe('New due date in ISO format'),
      assigneeId: z.string().optional().describe('New assignee user ID'),
    },
    async ({ boardId, itemId, title, description, x, y, dueDate, assigneeId }) => {
      try {
        const input: {
          data?: { title?: string; description?: string; dueDate?: string; assigneeId?: string };
          position?: { x: number; y: number };
        } = {};

        if (title || description || dueDate || assigneeId) {
          input.data = {};
          if (title) input.data.title = title;
          if (description) input.data.description = description;
          if (dueDate) input.data.dueDate = dueDate;
          if (assigneeId) input.data.assigneeId = assigneeId;
        }
        if (x !== undefined && y !== undefined) input.position = { x, y };

        const card = await client.updateCard(boardId, itemId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Card updated', card }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Card
  // ===========================================================================
  server.tool(
    'miro_delete_card',
    `Delete a card from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Card ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Card ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteCard(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Card ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
