/**
 * Response Formatting Utilities for Miro MCP Server
 */

import type {
  MiroBoard,
  MiroItem,
  PaginatedResponse,
  Tag,
  BoardMember,
} from '../types/miro.js';
import { MiroApiError, formatErrorForLogging } from './errors.js';

/**
 * MCP tool response type
 */
export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export type ResponseFormat = 'json' | 'markdown';

/**
 * Format a successful response
 */
export function formatResponse(
  data: unknown,
  format: ResponseFormat,
  entityType: string
): ToolResponse {
  if (format === 'markdown') {
    return {
      content: [{ type: 'text', text: formatAsMarkdown(data, entityType) }],
    };
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Format an error response
 */
export function formatError(error: unknown): ToolResponse {
  const errorInfo = formatErrorForLogging(error);

  let message: string;
  if (error instanceof MiroApiError) {
    message = `Error: ${error.message}`;
    if (error.retryable) {
      message += ' (retryable)';
    }
  } else if (error instanceof Error) {
    message = `Error: ${error.message}`;
  } else {
    message = `Error: ${String(error)}`;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: message, details: errorInfo }, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Format data as Markdown
 */
function formatAsMarkdown(data: unknown, entityType: string): string {
  if (isPaginatedResponse(data)) {
    return formatPaginatedAsMarkdown(data, entityType);
  }

  if (Array.isArray(data)) {
    return formatArrayAsMarkdown(data, entityType);
  }

  if (typeof data === 'object' && data !== null) {
    return formatObjectAsMarkdown(data as Record<string, unknown>, entityType);
  }

  return String(data);
}

/**
 * Type guard for paginated response
 */
function isPaginatedResponse(data: unknown): data is PaginatedResponse<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'data' in data &&
    Array.isArray((data as PaginatedResponse<unknown>).data)
  );
}

/**
 * Format paginated response as Markdown
 */
function formatPaginatedAsMarkdown(data: PaginatedResponse<unknown>, entityType: string): string {
  const lines: string[] = [];

  lines.push(`## ${capitalize(entityType)}`);
  lines.push('');

  if (data.total !== undefined) {
    lines.push(`**Total:** ${data.total} | **Showing:** ${data.size}`);
  } else {
    lines.push(`**Showing:** ${data.size}`);
  }

  if (data.cursor) {
    lines.push(`**Next cursor:** \`${data.cursor}\``);
  }
  lines.push('');

  if (data.data.length === 0) {
    lines.push('_No items found._');
    return lines.join('\n');
  }

  // Format items based on entity type
  switch (entityType) {
    case 'boards':
      lines.push(formatBoardsTable(data.data as MiroBoard[]));
      break;
    case 'items':
      lines.push(formatItemsTable(data.data as MiroItem[]));
      break;
    case 'members':
      lines.push(formatMembersTable(data.data as BoardMember[]));
      break;
    case 'tags':
      lines.push(formatTagsTable(data.data as Tag[]));
      break;
    default:
      lines.push(formatGenericTable(data.data));
  }

  return lines.join('\n');
}

/**
 * Format boards as Markdown table
 */
function formatBoardsTable(boards: MiroBoard[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Description | View Link |');
  lines.push('|---|---|---|---|');

  for (const board of boards) {
    lines.push(
      `| ${board.id} | ${board.name} | ${board.description || '-'} | [Open](${board.viewLink || '-'}) |`
    );
  }

  return lines.join('\n');
}

/**
 * Format items as Markdown table
 */
function formatItemsTable(items: MiroItem[]): string {
  const lines: string[] = [];
  lines.push('| ID | Type | Content/Title | Position |');
  lines.push('|---|---|---|---|');

  for (const item of items) {
    let content = '-';
    if ('data' in item && item.data) {
      const data = item.data as Record<string, unknown>;
      if ('content' in data) {
        content = String(data.content).substring(0, 50);
      } else if ('title' in data) {
        content = String(data.title).substring(0, 50);
      }
    }
    let pos = '-';
    if ('position' in item && item.position) {
      const position = item.position as { x: number; y: number };
      pos = `(${position.x}, ${position.y})`;
    }
    lines.push(`| ${item.id} | ${item.type} | ${content} | ${pos} |`);
  }

  return lines.join('\n');
}

/**
 * Format members as Markdown table
 */
function formatMembersTable(members: BoardMember[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Email | Role |');
  lines.push('|---|---|---|---|');

  for (const member of members) {
    lines.push(
      `| ${member.id} | ${member.name || '-'} | ${member.email || '-'} | ${member.role || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format tags as Markdown table
 */
function formatTagsTable(tags: Tag[]): string {
  const lines: string[] = [];
  lines.push('| ID | Title | Color |');
  lines.push('|---|---|---|');

  for (const tag of tags) {
    lines.push(`| ${tag.id} | ${tag.title} | ${tag.fillColor || '-'} |`);
  }

  return lines.join('\n');
}

/**
 * Format a generic array as Markdown table
 */
function formatGenericTable(items: unknown[]): string {
  if (items.length === 0) return '_No items_';

  const first = items[0] as Record<string, unknown>;
  const keys = Object.keys(first).slice(0, 5);

  const lines: string[] = [];
  lines.push(`| ${keys.join(' | ')} |`);
  lines.push(`|${keys.map(() => '---').join('|')}|`);

  for (const item of items) {
    const record = item as Record<string, unknown>;
    const values = keys.map((k) => String(record[k] ?? '-'));
    lines.push(`| ${values.join(' | ')} |`);
  }

  return lines.join('\n');
}

/**
 * Format an array as Markdown
 */
function formatArrayAsMarkdown(data: unknown[], entityType: string): string {
  return formatGenericTable(data);
}

/**
 * Format a single object as Markdown
 */
function formatObjectAsMarkdown(data: Record<string, unknown>, entityType: string): string {
  const lines: string[] = [];
  lines.push(`## ${capitalize(entityType.replace(/s$/, ''))}`);
  lines.push('');

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    if (typeof value === 'object') {
      lines.push(`**${formatKey(key)}:**`);
      lines.push('```json');
      lines.push(JSON.stringify(value, null, 2));
      lines.push('```');
    } else {
      lines.push(`**${formatKey(key)}:** ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a key for display (camelCase to Title Case)
 */
function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
