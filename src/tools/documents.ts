/**
 * Document Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError } from '../utils/formatters.js';

export function registerDocumentTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create Document from URL
  // ===========================================================================
  server.tool(
    'miro_create_document',
    `Create a document item on a Miro board from a URL.

Args:
  - boardId: Board ID
  - url: Document URL (PDF, etc.)
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - title: Document title

Returns:
  The created document item with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      url: z.string().url().describe('Document URL'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      title: z.string().optional().describe('Document title'),
    },
    async ({ boardId, url, x, y, title }) => {
      try {
        const input: {
          data: { url: string; title?: string };
          position: { x: number; y: number };
        } = {
          data: { url },
          position: { x, y },
        };

        if (title) input.data.title = title;

        const document = await client.createDocumentFromUrl(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Document created', document }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Document
  // ===========================================================================
  server.tool(
    'miro_get_document',
    `Get a specific document from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Document ID

Returns:
  Document details including URL, position, and title.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Document ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const document = await client.getDocument(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(document, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Document
  // ===========================================================================
  server.tool(
    'miro_delete_document',
    `Delete a document from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Document ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Document ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteDocument(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Document ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
