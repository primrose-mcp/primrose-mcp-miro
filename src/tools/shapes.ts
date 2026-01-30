/**
 * Shape Tools for Miro MCP Server
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { MiroClient } from '../client.js';
import type { ShapeType } from '../types/miro.js';
import { formatError } from '../utils/formatters.js';

const shapeTypes = [
  'rectangle',
  'round_rectangle',
  'circle',
  'triangle',
  'rhombus',
  'parallelogram',
  'trapezoid',
  'pentagon',
  'hexagon',
  'octagon',
  'wedge_round_rectangle_callout',
  'star',
  'flow_chart_predefined_process',
  'cloud',
  'cross',
  'can',
  'right_arrow',
  'left_arrow',
  'left_right_arrow',
  'left_brace',
  'right_brace',
] as const;

export function registerShapeTools(server: McpServer, client: MiroClient): void {
  // ===========================================================================
  // Create Shape
  // ===========================================================================
  server.tool(
    'miro_create_shape',
    `Create a shape on a Miro board.

Args:
  - boardId: Board ID
  - shape: Shape type (rectangle, round_rectangle, circle, triangle, rhombus, parallelogram, trapezoid, pentagon, hexagon, octagon, wedge_round_rectangle_callout, star, flow_chart_predefined_process, cloud, cross, can, right_arrow, left_arrow, left_right_arrow, left_brace, right_brace)
  - x: X coordinate (default: 0)
  - y: Y coordinate (default: 0)
  - width: Width in pixels (default: 100)
  - height: Height in pixels (default: 100)
  - content: Text content inside the shape
  - fillColor: Fill color
  - borderColor: Border color
  - borderWidth: Border width

Returns:
  The created shape with its ID.`,
    {
      boardId: z.string().describe('Board ID'),
      shape: z.enum(shapeTypes).describe('Shape type'),
      x: z.number().default(0).describe('X coordinate'),
      y: z.number().default(0).describe('Y coordinate'),
      width: z.number().default(100).describe('Width in pixels'),
      height: z.number().default(100).describe('Height in pixels'),
      content: z.string().optional().describe('Text content inside the shape'),
      fillColor: z.string().optional().describe('Fill color'),
      borderColor: z.string().optional().describe('Border color'),
      borderWidth: z.string().optional().describe('Border width'),
    },
    async ({ boardId, shape, x, y, width, height, content, fillColor, borderColor, borderWidth }) => {
      try {
        const input: {
          data: { shape: ShapeType; content?: string };
          position: { x: number; y: number };
          geometry: { width: number; height: number };
          style?: { fillColor?: string; borderColor?: string; borderWidth?: string };
        } = {
          data: { shape: shape as ShapeType },
          position: { x, y },
          geometry: { width, height },
        };

        if (content) input.data.content = content;
        if (fillColor || borderColor || borderWidth) {
          input.style = {};
          if (fillColor) input.style.fillColor = fillColor;
          if (borderColor) input.style.borderColor = borderColor;
          if (borderWidth) input.style.borderWidth = borderWidth;
        }

        const shapeItem = await client.createShape(boardId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Shape created', shape: shapeItem }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Shape
  // ===========================================================================
  server.tool(
    'miro_get_shape',
    `Get a specific shape from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Shape ID

Returns:
  Shape details including type, content, position, and style.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Shape ID'),
    },
    async ({ boardId, itemId }) => {
      try {
        const shape = await client.getShape(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(shape, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Shape
  // ===========================================================================
  server.tool(
    'miro_update_shape',
    `Update an existing shape on a Miro board.

Args:
  - boardId: Board ID
  - itemId: Shape ID
  - content: New text content
  - x: New X coordinate
  - y: New Y coordinate
  - width: New width
  - height: New height
  - fillColor: New fill color

Returns:
  The updated shape.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Shape ID'),
      content: z.string().optional().describe('New text content'),
      x: z.number().optional().describe('New X coordinate'),
      y: z.number().optional().describe('New Y coordinate'),
      width: z.number().optional().describe('New width'),
      height: z.number().optional().describe('New height'),
      fillColor: z.string().optional().describe('New fill color'),
    },
    async ({ boardId, itemId, content, x, y, width, height, fillColor }) => {
      try {
        const input: {
          data?: { content?: string };
          position?: { x: number; y: number };
          geometry?: { width?: number; height?: number };
          style?: { fillColor?: string };
        } = {};

        if (content) input.data = { content };
        if (x !== undefined && y !== undefined) input.position = { x, y };
        if (width !== undefined || height !== undefined) input.geometry = { width, height };
        if (fillColor) input.style = { fillColor };

        const shape = await client.updateShape(boardId, itemId, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Shape updated', shape }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Shape
  // ===========================================================================
  server.tool(
    'miro_delete_shape',
    `Delete a shape from a Miro board.

Args:
  - boardId: Board ID
  - itemId: Shape ID to delete

Returns:
  Confirmation of deletion.`,
    {
      boardId: z.string().describe('Board ID'),
      itemId: z.string().describe('Shape ID to delete'),
    },
    async ({ boardId, itemId }) => {
      try {
        await client.deleteShape(boardId, itemId);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Shape ${itemId} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
