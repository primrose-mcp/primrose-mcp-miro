/**
 * Connector Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

const strokeCapTypes = [
  'none',
  'stealth',
  'diamond',
  'diamond_filled',
  'oval',
  'oval_filled',
  'arrow',
  'triangle',
  'triangle_filled',
  'erd_one',
  'erd_many',
  'erd_one_or_many',
  'erd_only_one',
  'erd_zero_or_many',
  'erd_zero_or_one',
] as const;

export function registerConnectorTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // List Connectors
  // ===========================================================================
  server.tool(
    'miro_list_connectors',
    `List all connectors on a Miro board.

Args:
  - boardId: Board ID
  - limit: Number of connectors to return (1-100, default: 20)
  - cursor: Pagination cursor
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of connectors.`,
    {
      boardId: z.string().describe('Board ID'),
      limit: z.number().int().min(1).max(100).default(20).describe('Number of connectors to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ boardId, limit, cursor, format }) => {
      try {
        const result = await client.listConnectors(boardId, { limit, cursor });
        return formatResponse(result, format, 'connectors');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Connector
  // ===========================================================================
  server.tool(
    'miro_create_connector',
    `Create a connector between two items on a Miro board.

Args:
  - boardId: Board ID
  - startItemId: ID of the start item
  - endItemId: ID of the end item
  - shape: Connector shape (straight, elbowed, curved)
  - startStrokeCap: Start arrow style (none, arrow, triangle, etc.)
  - endStrokeCap: End arrow style (none, arrow, triangle, etc.)
  - strokeColor: Connector line color
  - strokeWidth: Connector line width
  - caption: Text caption for the connector

Returns:
  The created connector with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      startItemId: z.string().describe('ID of the start item'),
      endItemId: z.string().describe('ID of the end item'),
      shape: z.enum(['straight', 'elbowed', 'curved']).optional().describe('Connector shape'),
      startStrokeCap: z.enum(strokeCapTypes).optional().describe('Start arrow style'),
      endStrokeCap: z.enum(strokeCapTypes).optional().describe('End arrow style'),
      strokeColor: z.string().optional().describe('Connector line color'),
      strokeWidth: z.string().optional().describe('Connector line width'),
      caption: z.string().optional().describe('Text caption for the connector'),
    },
    async ({ boardId, startItemId, endItemId, shape, startStrokeCap, endStrokeCap, strokeColor, strokeWidth, caption }) => {
      try {
        const input: {
          startItem: { id: string };
          endItem: { id: string };
          shape?: 'straight' | 'elbowed' | 'curved';
          style?: {
            startStrokeCap?: typeof strokeCapTypes[number];
            endStrokeCap?: typeof strokeCapTypes[number];
            strokeColor?: string;
            strokeWidth?: string;
          };
          captions?: Array<{ content: string }>;
        } = {
          startItem: { id: startItemId },
          endItem: { id: endItemId },
        };

        if (shape) input.shape = shape;
        if (startStrokeCap || endStrokeCap || strokeColor || strokeWidth) {
          input.style = {};
          if (startStrokeCap) input.style.startStrokeCap = startStrokeCap;
          if (endStrokeCap) input.style.endStrokeCap = endStrokeCap;
          if (strokeColor) input.style.strokeColor = strokeColor;
          if (strokeWidth) input.style.strokeWidth = strokeWidth;
        }
        if (caption) input.captions = [{ content: caption }];

        const connector = await client.createConnector(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Connector created', connector }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Connector
  // ===========================================================================
  server.tool(
    'miro_get_connector',
    `Get a specific connector from a Miro board.

Args:
  - boardId: Board ID
  - connectorId: Connector ID

Returns:
  Connector details including connected items and style.`,
    {
      boardId: z.string().describe('Board ID'),
      connectorId: z.string().describe('Connector ID'),
    },
    async ({ boardId, connectorId }) => {
      try {
        const connector = await client.getConnector(boardId, connectorId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(connector, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Connector
  // ===========================================================================
  server.tool(
    'miro_update_connector',
    `Update an existing connector on a Miro board.

Args:
  - boardId: Board ID
  - connectorId: Connector ID
  - shape: New connector shape (straight, elbowed, curved)
  - startStrokeCap: New start arrow style
  - endStrokeCap: New end arrow style
  - strokeColor: New line color
  - caption: New text caption

Returns:
  The updated connector.`,
    {
      boardId: z.string().describe('Board ID'),
      connectorId: z.string().describe('Connector ID'),
      shape: z.enum(['straight', 'elbowed', 'curved']).optional().describe('New connector shape'),
      startStrokeCap: z.enum(strokeCapTypes).optional().describe('New start arrow style'),
      endStrokeCap: z.enum(strokeCapTypes).optional().describe('New end arrow style'),
      strokeColor: z.string().optional().describe('New line color'),
      caption: z.string().optional().describe('New text caption'),
    },
    async ({ boardId, connectorId, shape, startStrokeCap, endStrokeCap, strokeColor, caption }) => {
      try {
        const input: {
          shape?: 'straight' | 'elbowed' | 'curved';
          style?: {
            startStrokeCap?: typeof strokeCapTypes[number];
            endStrokeCap?: typeof strokeCapTypes[number];
            strokeColor?: string;
          };
          captions?: Array<{ content: string }>;
        } = {};

        if (shape) input.shape = shape;
        if (startStrokeCap || endStrokeCap || strokeColor) {
          input.style = {};
          if (startStrokeCap) input.style.startStrokeCap = startStrokeCap;
          if (endStrokeCap) input.style.endStrokeCap = endStrokeCap;
          if (strokeColor) input.style.strokeColor = strokeColor;
        }
        if (caption) input.captions = [{ content: caption }];

        const connector = await client.updateConnector(boardId, connectorId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Connector updated', connector }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Connector
  // ===========================================================================
  server.tool(
    'miro_delete_connector',
    `Delete a connector from a Miro board.

Args:
  - boardId: Board ID
  - connectorId: Connector ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      connectorId: z.string().describe('Connector ID to delete'),
    },
    async ({ boardId, connectorId }) => {
      try {
        await client.deleteConnector(boardId, connectorId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Connector ${connectorId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
