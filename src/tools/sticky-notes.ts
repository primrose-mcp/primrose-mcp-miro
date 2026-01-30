/**
 * Sticky Note Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError } from '../utils/formatters.js';

export function registerStickyNoteTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create Sticky Note
  // ===========================================================================
  server.tool(
    'miro_create_sticky_note',
    `Create a sticky note on a Miro board.

Args:
  - boardId: Board ID
  - content: Text content of the sticky note
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - shape: Shape of sticky note (square, rectangle)
  - fillColor: Background color (e.g., "yellow", "light_yellow", "orange", "light_orange", "green", "light_green", "cyan", "light_cyan", "blue", "light_blue", "violet", "light_violet", "magenta", "light_magenta", "red", "light_red", "gray", "light_gray", "black", "dark_gray")
  - width: Width in pixels
  - height: Height in pixels

Returns:
  The created sticky note with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      content: z.string().describe('Sticky note text content'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      shape: z.enum(['square', 'rectangle']).optional().describe('Sticky note shape'),
      fillColor: z.string().optional().describe('Background color'),
      width: z.number().optional().describe('Width in pixels'),
      height: z.number().optional().describe('Height in pixels'),
    },
    async ({ boardId, content, x, y, shape, fillColor, width, height }) => {
      try {
        const input: {
          data: { content: string; shape?: 'square' | 'rectangle' };
          position?: { x: number; y: number };
          style?: { fillColor?: string };
          geometry?: { width?: number; height?: number };
        } = {
          data: { content },
          position: { x, y },
        };

        if (shape) input.data.shape = shape;
        if (fillColor) input.style = { fillColor };
        if (width || height) input.geometry = { width, height };

        const stickyNote = await client.createStickyNote(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Sticky note created', stickyNote }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Sticky Note
  // ===========================================================================
  server.tool(
    'miro_get_sticky_note',
    `Get a specific sticky note from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Sticky note ID

Returns:
  Sticky note details including content, position, and style.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Sticky note ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const stickyNote = await client.getStickyNote(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(stickyNote, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Sticky Note
  // ===========================================================================
  server.tool(
    'miro_update_sticky_note',
    `Update an existing sticky note on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Sticky note ID
  - content: New text content
  - x: New X coordinate
  - y: New Y coordinate
  - fillColor: New background color

Returns:
  The updated sticky note.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Sticky note ID'),
      content: z.string().optional().describe('New text content'),
      x: z.number().optional().describe('New X coordinate'),
      y: z.number().optional().describe('New Y coordinate'),
      fillColor: z.string().optional().describe('New background color'),
    },
    async ({ boardId, itemId, content, x, y, fillColor }) => {
      try {
        const input: {
          data?: { content?: string };
          position?: { x: number; y: number };
          style?: { fillColor?: string };
        } = {};

        if (content) input.data = { content };
        if (x !== undefined && y !== undefined) input.position = { x, y };
        if (fillColor) input.style = { fillColor };

        const stickyNote = await client.updateStickyNote(boardId, itemId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Sticky note updated', stickyNote }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Sticky Note
  // ===========================================================================
  server.tool(
    'miro_delete_sticky_note',
    `Delete a sticky note from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Sticky note ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Sticky note ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteStickyNote(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Sticky note ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
