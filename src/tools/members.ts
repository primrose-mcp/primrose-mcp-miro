/**
 * Board Member Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

export function registerMemberTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // List Board Members
  // ===========================================================================
  server.tool(
    'miro_list_board_members',
    `List members of a Miro board.

Args:
  - boardId: Board ID
  - limit: Number of members to return (1-100, default: 20)
  - cursor: Pagination cursor
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of board members with their roles.`,
    {
      boardId: z.string().describe('Board ID'),
      limit: z.number().int().min(1).max(100).default(20).describe('Number of members to return'),
      cursor: z.string().optional().describe('Pagination cursor'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ boardId, limit, cursor, format }) => {
      try {
        const result = await client.listBoardMembers(boardId, { limit, cursor });
        return formatResponse(result, format, 'members');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Board Member
  // ===========================================================================
  server.tool(
    'miro_get_board_member',
    `Get a specific board member by ID.

Args:
  - boardId: Board ID
  - memberId: Member ID

Returns:
  Board member details including role and email.`,
    {
      boardId: z.string().describe('Board ID'),
      memberId: z.string().describe('Member ID'),
    },
    async ({ boardId, memberId }) => {
      try {
        const member = await client.getBoardMember(boardId, memberId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(member, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Share Board
  // ===========================================================================
  server.tool(
    'miro_share_board',
    `Share a Miro board with users via email invitation.

Args:
  - boardId: Board ID to share
  - emails: Array of email addresses to invite (comma-separated string)
  - role: Role to assign (viewer, commenter, editor, coowner)
  - message: Optional invitation message

Returns:
  Confirmation of sharing.`,
    {
      boardId: z.string().describe('Board ID'),
      emails: z.string().describe('Comma-separated email addresses'),
      role: z.enum(['viewer', 'commenter', 'editor', 'coowner']).default('viewer').describe('Role to assign'),
      message: z.string().optional().describe('Invitation message'),
    },
    async ({ boardId, emails, role, message }) => {
      try {
        const emailList = emails.split(',').map(e => e.trim()).filter(e => e);
        await client.shareBoard(boardId, { emails: emailList, role, message });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Board shared with ${emailList.length} user(s)` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Board Member
  // ===========================================================================
  server.tool(
    'miro_update_board_member',
    `Update a board member's role.

Args:
  - boardId: Board ID
  - memberId: Member ID to update
  - role: New role (viewer, commenter, editor, coowner)

Returns:
  Updated member details.`,
    {
      boardId: z.string().describe('Board ID'),
      memberId: z.string().describe('Member ID'),
      role: z.enum(['viewer', 'commenter', 'editor', 'coowner']).describe('New role'),
    },
    async ({ boardId, memberId, role }) => {
      try {
        const member = await client.updateBoardMember(boardId, memberId, role);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Member updated', member }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Remove Board Member
  // ===========================================================================
  server.tool(
    'miro_remove_board_member',
    `Remove a member from a Miro board.

Args:
  - boardId: Board ID
  - memberId: Member ID to remove

Returns:
  Confirmation of removal.`,
    {
      boardId: z.string().describe('Board ID'),
      memberId: z.string().describe('Member ID to remove'),
    },
    async ({ boardId, memberId }) => {
      try {
        await client.removeBoardMember(boardId, memberId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Member ${memberId} removed from board` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
