/**
 * Image Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError } from '../utils/formatters.js';

export function registerImageTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create Image from URL
  // ===========================================================================
  server.tool(
    'miro_create_image',
    `Create an image on a Miro board from a URL.

Args:
  - boardId: Board ID
  - url: Image URL (must be publicly accessible)
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - width: Width in pixels
  - height: Height in pixels
  - title: Image title

Returns:
  The created image item with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      url: z.string().url().describe('Image URL'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      width: z.number().optional().describe('Width in pixels'),
      height: z.number().optional().describe('Height in pixels'),
      title: z.string().optional().describe('Image title'),
    },
    async ({ boardId, url, x, y, width, height, title }) => {
      try {
        const input: {
          data: { url: string; title?: string };
          position: { x: number; y: number };
          geometry?: { width?: number; height?: number };
        } = {
          data: { url },
          position: { x, y },
        };

        if (title) input.data.title = title;
        if (width || height) input.geometry = { width, height };

        const image = await client.createImageFromUrl(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Image created', image }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Image
  // ===========================================================================
  server.tool(
    'miro_get_image',
    `Get a specific image from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Image ID

Returns:
  Image details including URL, position, and dimensions.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Image ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const image = await client.getImage(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(image, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Image
  // ===========================================================================
  server.tool(
    'miro_update_image',
    `Update an existing image on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Image ID
  - x: New X coordinate
  - y: New Y coordinate
  - width: New width
  - height: New height
  - title: New image title

Returns:
  The updated image.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Image ID'),
      x: z.number().optional().describe('New X coordinate'),
      y: z.number().optional().describe('New Y coordinate'),
      width: z.number().optional().describe('New width'),
      height: z.number().optional().describe('New height'),
      title: z.string().optional().describe('New image title'),
    },
    async ({ boardId, itemId, x, y, width, height, title }) => {
      try {
        const input: {
          data?: { title?: string };
          position?: { x: number; y: number };
          geometry?: { width?: number; height?: number };
        } = {};

        if (title) input.data = { title };
        if (x !== undefined && y !== undefined) input.position = { x, y };
        if (width !== undefined || height !== undefined) input.geometry = { width, height };

        const image = await client.updateImage(boardId, itemId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Image updated', image }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Image
  // ===========================================================================
  server.tool(
    'miro_delete_image',
    `Delete an image from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Image ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Image ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteImage(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Image ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
