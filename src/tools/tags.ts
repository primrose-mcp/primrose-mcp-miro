/**
 * Tag Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

export function registerTagTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // List Tags
  // ===========================================================================
  server.tool(
    'miro_list_tags',
    `List all tags on a Miro board.

Args:
  - boardId: Board ID
  - limit: Number of tags to return (1-100, default: 20)
  - cursor: Pagination cursor
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of tags with their IDs, titles, and colors.`,
    {
      boardId: z.string().describe('Board ID'),
      limit: z.number().int().min(1).max(100).default(20).describe('Number of tags to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ boardId, limit, cursor, format }) => {
      try {
        const result = await client.listTags(boardId, { limit, cursor });
        return formatResponse(result, format, 'tags');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Tag
  // ===========================================================================
  server.tool(
    'miro_create_tag',
    `Create a tag on a Miro board.

Args:
  - boardId: Board ID
  - title: Tag title (required)
  - fillColor: Tag color (e.g., "red", "yellow", "green", "blue", "cyan", "magenta", "gray", "light_gray", "dark_gray", "black", "violet", "light_red", "light_yellow", "light_green", "light_blue", "light_cyan", "light_magenta", "light_gray")

Returns:
  The created tag with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      title: z.string().describe('Tag title'),
      fillColor: z.string().optional().describe('Tag color'),
    },
    async ({ boardId, title, fillColor }) => {
      try {
        const input: { title: string; fillColor?: string } = { title };
        if (fillColor) input.fillColor = fillColor;

        const tag = await client.createTag(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tag created', tag }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Tag
  // ===========================================================================
  server.tool(
    'miro_get_tag',
    `Get a specific tag from a Miro board.

Args:
  - boardId: Board ID
  - tagId: Tag ID

Returns:
  Tag details including title and color.`,
    {
      boardId: z.string().describe('Board ID'),
      tagId: z.string().describe('Tag ID'),
    },
    async ({ boardId, tagId }) => {
      try {
        const tag = await client.getTag(boardId, tagId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tag, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Tag
  // ===========================================================================
  server.tool(
    'miro_update_tag',
    `Update an existing tag on a Miro board.

Args:
  - boardId: Board ID
  - tagId: Tag ID
  - title: New tag title
  - fillColor: New tag color

Returns:
  The updated tag.`,
    {
      boardId: z.string().describe('Board ID'),
      tagId: z.string().describe('Tag ID'),
      title: z.string().optional().describe('New tag title'),
      fillColor: z.string().optional().describe('New tag color'),
    },
    async ({ boardId, tagId, title, fillColor }) => {
      try {
        const input: { title?: string; fillColor?: string } = {};
        if (title) input.title = title;
        if (fillColor) input.fillColor = fillColor;

        const tag = await client.updateTag(boardId, tagId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tag updated', tag }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Tag
  // ===========================================================================
  server.tool(
    'miro_delete_tag',
    `Delete a tag from a Miro board.

Args:
  - boardId: Board ID
  - tagId: Tag ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      tagId: z.string().describe('Tag ID to delete'),
    },
    async ({ boardId, tagId }) => {
      try {
        await client.deleteTag(boardId, tagId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Tag ${tagId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Attach Tag to Item
  // ===========================================================================
  server.tool(
    'miro_attach_tag',
    `Attach a tag to an item on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Item ID to tag
  - tagId: Tag ID to attach

Returns:
  Confirmation of attachment.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Item ID'),
      tagId: z.string().describe('Tag ID'),
    },
    async ({ boardId, itemId, tagId }) => {
      try {
        await client.attachTagToItem(boardId, itemId, tagId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Tag ${tagId} attached to item ${itemId}` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Remove Tag from Item
  // ===========================================================================
  server.tool(
    'miro_remove_tag',
    `Remove a tag from an item on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Item ID
  - tagId: Tag ID to remove

Returns:
  Confirmation of removal.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Item ID'),
      tagId: z.string().describe('Tag ID'),
    },
    async ({ boardId, itemId, tagId }) => {
      try {
        await client.removeTagFromItem(boardId, itemId, tagId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Tag ${tagId} removed from item ${itemId}` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Items by Tag
  // ===========================================================================
  server.tool(
    'miro_get_items_by_tag',
    `Get all items with a specific tag on a Miro board.

Args:
  - boardId: Board ID
  - tagId: Tag ID
  - limit: Number of items to return (1-100, default: 20)
  - cursor: Pagination cursor
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of items with the specified tag.`,
    {
      boardId: z.string().describe('Board ID'),
      tagId: z.string().describe('Tag ID'),
      limit: z.number().int().min(1).max(100).default(20).describe('Number of items to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ boardId, tagId, limit, cursor, format }) => {
      try {
        const result = await client.getItemsByTag(boardId, tagId, { limit, cursor });
        return formatResponse(result, format, 'items');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Tags from Item
  // ===========================================================================
  server.tool(
    'miro_get_item_tags',
    `Get all tags attached to a specific item on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Item ID

Returns:
  List of tags attached to the item.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Item ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const tags = await client.getTagsFromItem(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ tags }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
