/**
 * Frame Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

export function registerFrameTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create Frame
  // ===========================================================================
  server.tool(
    'miro_create_frame',
    `Create a frame on a Miro board.

Args:
  - boardId: Board ID
  - title: Frame title
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - width: Width in pixels (default: 800)
  - height: Height in pixels (default: 600)
  - format: Frame format (custom, desktop, phone, a4, letter, square, freeform)
  - fillColor: Background color

Returns:
  The created frame with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      title: z.string().optional().describe('Frame title'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      width: z.number().default(800).describe('Width in pixels'),
      height: z.number().default(600).describe('Height in pixels'),
      format: z.enum(['custom', 'desktop', 'phone', 'a4', 'letter', 'square', 'freeform']).optional().describe('Frame format'),
      fillColor: z.string().optional().describe('Background color'),
    },
    async ({ boardId, title, x, y, width, height, format, fillColor }) => {
      try {
        const input: {
          data: { title?: string; format?: 'custom' | 'desktop' | 'phone' | 'a4' | 'letter' | 'square' | 'freeform' };
          position: { x: number; y: number };
          geometry: { width: number; height: number };
          style?: { fillColor?: string };
        } = {
          data: {},
          position: { x, y },
          geometry: { width, height },
        };

        if (title) input.data.title = title;
        if (format) input.data.format = format;
        if (fillColor) input.style = { fillColor };

        const frame = await client.createFrame(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Frame created', frame }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Frame
  // ===========================================================================
  server.tool(
    'miro_get_frame',
    `Get a specific frame from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Frame ID

Returns:
  Frame details including title, position, and child items.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Frame ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const frame = await client.getFrame(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(frame, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Frame
  // ===========================================================================
  server.tool(
    'miro_update_frame',
    `Update an existing frame on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Frame ID
  - title: New frame title
  - x: New X coordinate
  - y: New Y coordinate
  - width: New width
  - height: New height
  - fillColor: New background color

Returns:
  The updated frame.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Frame ID'),
      title: z.string().optional().describe('New frame title'),
      x: z.number().optional().describe('New X coordinate'),
      y: z.number().optional().describe('New Y coordinate'),
      width: z.number().optional().describe('New width'),
      height: z.number().optional().describe('New height'),
      fillColor: z.string().optional().describe('New background color'),
    },
    async ({ boardId, itemId, title, x, y, width, height, fillColor }) => {
      try {
        const input: {
          data?: { title?: string };
          position?: { x: number; y: number };
          geometry?: { width?: number; height?: number };
          style?: { fillColor?: string };
        } = {};

        if (title) input.data = { title };
        if (x !== undefined && y !== undefined) input.position = { x, y };
        if (width !== undefined || height !== undefined) input.geometry = { width, height };
        if (fillColor) input.style = { fillColor };

        const frame = await client.updateFrame(boardId, itemId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Frame updated', frame }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Frame
  // ===========================================================================
  server.tool(
    'miro_delete_frame',
    `Delete a frame from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Frame ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Frame ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteFrame(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Frame ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Frame Items
  // ===========================================================================
  server.tool(
    'miro_get_frame_items',
    `Get all items within a frame.

Args:
  - boardId: Board ID
  - frameId: Frame ID
  - limit: Number of items to return (1-100, default: 20)
  - cursor: Pagination cursor
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of items within the frame.`,
    {
      boardId: z.string().describe('Board ID'),
      frameId: z.string().describe('Frame ID'),
      limit: z.number().int().min(1).max(100).default(20).describe('Number of items to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ boardId, frameId, limit, cursor, format }) => {
      try {
        const result = await client.getFrameItems(boardId, frameId, { limit, cursor });
        return formatResponse(result, format, 'items');
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
