/**
 * Generic Item Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import type { ItemType } from '../types/miro.js';
import { formatError, formatResponse } from '../utils/formatters.js';

export function registerItemTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // List Items
  // ===========================================================================
  server.tool(
    'miro_list_items',
    `List all items on a Miro board.

Args:
  - boardId: Board ID
  - limit: Number of items to return (1-100, default: 20)
  - cursor: Pagination cursor
  - type: Filter by item type (sticky_note, shape, text, card, image, frame, connector, embed, app_card, document)
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of items on the board.`,
    {
      boardId: z.string().describe('Board ID'),
      limit: z.number().int().min(1).max(100).default(20).describe('Number of items to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      type: z.enum(['sticky_note', 'shape', 'text', 'card', 'image', 'frame', 'connector', 'embed', 'app_card', 'document']).optional().describe('Filter by item type'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ boardId, limit, cursor, type, format }) => {
      try {
        const result = await client.listItems(boardId, { limit, cursor, type: type as ItemType });
        return formatResponse(result, format, 'items');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Item
  // ===========================================================================
  server.tool(
    'miro_get_item',
    `Get a specific item from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Item ID

Returns:
  Item details including type, content, position, and style.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Item ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const item = await client.getItem(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(item, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Item Position
  // ===========================================================================
  server.tool(
    'miro_update_item_position',
    `Update the position of an item on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Item ID
  - x: New X coordinate
  - y: New Y coordinate
  - parentId: Optional parent item ID (e.g., frame ID)

Returns:
  Updated item.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Item ID'),
      x: z.number().describe('X coordinate'),
      y: z.number().describe('Y coordinate'),
      parentId: z.string().optional().describe('Parent item ID (e.g., frame)'),
    },
    async ({ boardId, itemId, x, y, parentId }) => {
      try {
        const item = await client.updateItemPosition(boardId, itemId, { x, y }, parentId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Item position updated', item }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Item
  // ===========================================================================
  server.tool(
    'miro_delete_item',
    `Delete an item from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Item ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Item ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteItem(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Item ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
