/**
 * Board Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

export function registerBoardTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // List Boards
  // ===========================================================================
  server.tool(
    'miro_list_boards',
    `List Miro boards accessible to the user.

Args:
  - limit: Number of boards to return (1-100, default: 20)
  - cursor: Pagination cursor from previous response
  - teamId: Filter by team ID
  - query: Search query string
  - sort: Sort order (default, last_modified, last_opened, last_created, alphabetically)
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of boards with id, name, description, and viewLink.`,
    {
      limit: z.number().int().min(1).max(100).default(20).describe('Number of boards to return'),
      cursor: z.string().optional().describe('Pagination cursor from previous response'),
      teamId: z.string().optional().describe('Filter by team ID'),
      query: z.string().optional().describe('Search query string'),
      sort: z.enum(['default', 'last_modified', 'last_opened', 'last_created', 'alphabetically']).optional().describe('Sort order'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ limit, cursor, teamId, query, sort, format }) => {
      try {
        const result = await client.listBoards({ limit, cursor, teamId, query, sort });
        return formatResponse(result, format, 'boards');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Board
  // ===========================================================================
  server.tool(
    'miro_get_board',
    `Get a specific Miro board by ID.

Args:
  - boardId: The board ID
  - format: Response format ('json' or 'markdown')

Returns:
  Board details including name, description, sharing settings, and links.`,
    {
      boardId: z.string().describe('Board ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ boardId, format }) => {
      try {
        const board = await client.getBoard(boardId);
        return formatResponse(board, format, 'board');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Board
  // ===========================================================================
  server.tool(
    'miro_create_board',
    `Create a new Miro board.

Args:
  - name: Board name (required)
  - description: Board description
  - teamId: Team ID to create the board in
  - access: Sharing access level (private, view, comment, edit)

Returns:
  The created board with its ID and viewLink.`,
    {
      name: z.string().describe('Board name'),
      description: z.string().optional().describe('Board description'),
      teamId: z.string().optional().describe('Team ID'),
      access: z.enum(['private', 'view', 'comment', 'edit']).optional().describe('Sharing access level'),
    },
    async ({ name, description, teamId, access }) => {
      try {
        const input: { name: string; description?: string; teamId?: string; sharingPolicy?: { access?: 'private' | 'view' | 'comment' | 'edit' } } = { name };
        if (description) input.description = description;
        if (teamId) input.teamId = teamId;
        if (access) input.sharingPolicy = { access };

        const board = await client.createBoard(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Board created', board }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Board
  // ===========================================================================
  server.tool(
    'miro_update_board',
    `Update an existing Miro board.

Args:
  - boardId: Board ID to update
  - name: New board name
  - description: New board description

Returns:
  The updated board.`,
    {
      boardId: z.string().describe('Board ID'),
      name: z.string().optional().describe('New board name'),
      description: z.string().optional().describe('New board description'),
    },
    async ({ boardId, name, description }) => {
      try {
        const input: { name?: string; description?: string } = {};
        if (name) input.name = name;
        if (description) input.description = description;

        const board = await client.updateBoard(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Board updated', board }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Board
  // ===========================================================================
  server.tool(
    'miro_delete_board',
    `Delete a Miro board.

Args:
  - boardId: Board ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID to delete'),
    },
    async ({ boardId }) => {
      try {
        await client.deleteBoard(boardId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Board ${boardId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Copy Board
  // ===========================================================================
  server.tool(
    'miro_copy_board',
    `Create a copy of a Miro board.

Args:
  - boardId: Source board ID to copy
  - name: Name for the new board
  - teamId: Team ID for the new board

Returns:
  The copied board with its new ID and viewLink.`,
    {
      boardId: z.string().describe('Source board ID'),
      name: z.string().optional().describe('Name for the copied board'),
      teamId: z.string().optional().describe('Team ID for the new board'),
    },
    async ({ boardId, name, teamId }) => {
      try {
        const board = await client.copyBoard(boardId, { name, teamId });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Board copied', board }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
