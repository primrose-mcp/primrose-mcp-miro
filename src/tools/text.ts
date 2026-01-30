/**
 * Text Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError } from '../utils/formatters.js';

export function registerTextTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create Text
  // ===========================================================================
  server.tool(
    'miro_create_text',
    `Create a text item on a Miro board.

Args:
  - boardId: Board ID
  - content: Text content (supports HTML formatting)
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - width: Width in pixels
  - fontSize: Font size
  - textAlign: Text alignment (left, center, right)
  - color: Text color

Returns:
  The created text item with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      content: z.string().describe('Text content'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      width: z.number().optional().describe('Width in pixels'),
      fontSize: z.string().optional().describe('Font size'),
      textAlign: z.enum(['left', 'center', 'right']).optional().describe('Text alignment'),
      color: z.string().optional().describe('Text color'),
    },
    async ({ boardId, content, x, y, width, fontSize, textAlign, color }) => {
      try {
        const input: {
          data: { content: string };
          position: { x: number; y: number };
          geometry?: { width?: number };
          style?: { fontSize?: string; textAlign?: 'left' | 'center' | 'right'; color?: string };
        } = {
          data: { content },
          position: { x, y },
        };

        if (width) input.geometry = { width };
        if (fontSize || textAlign || color) {
          input.style = {};
          if (fontSize) input.style.fontSize = fontSize;
          if (textAlign) input.style.textAlign = textAlign;
          if (color) input.style.color = color;
        }

        const textItem = await client.createText(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Text item created', textItem }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Text
  // ===========================================================================
  server.tool(
    'miro_get_text',
    `Get a specific text item from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Text item ID

Returns:
  Text item details including content, position, and style.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Text item ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const textItem = await client.getText(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(textItem, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Text
  // ===========================================================================
  server.tool(
    'miro_update_text',
    `Update an existing text item on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Text item ID
  - content: New text content
  - x: New X coordinate
  - y: New Y coordinate
  - fontSize: New font size
  - color: New text color

Returns:
  The updated text item.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Text item ID'),
      content: z.string().optional().describe('New text content'),
      x: z.number().optional().describe('New X coordinate'),
      y: z.number().optional().describe('New Y coordinate'),
      fontSize: z.string().optional().describe('New font size'),
      color: z.string().optional().describe('New text color'),
    },
    async ({ boardId, itemId, content, x, y, fontSize, color }) => {
      try {
        const input: {
          data?: { content?: string };
          position?: { x: number; y: number };
          style?: { fontSize?: string; color?: string };
        } = {};

        if (content) input.data = { content };
        if (x !== undefined && y !== undefined) input.position = { x, y };
        if (fontSize || color) {
          input.style = {};
          if (fontSize) input.style.fontSize = fontSize;
          if (color) input.style.color = color;
        }

        const textItem = await client.updateText(boardId, itemId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Text item updated', textItem }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Text
  // ===========================================================================
  server.tool(
    'miro_delete_text',
    `Delete a text item from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Text item ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Text item ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteText(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Text item ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
