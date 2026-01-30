# Miro MCP Server

[![Primrose MCP](https://img.shields.io/badge/Primrose-MCP-blue)](https://primrose.dev/mcp/miro)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for the Miro API. This server enables AI assistants to interact with Miro whiteboards, creating and managing visual collaboration content.

## Features

- **Boards** - Create, list, and manage Miro boards
- **Members** - Manage board members and permissions
- **Items** - Work with generic board items
- **Sticky Notes** - Create and manage sticky notes
- **Shapes** - Add and manipulate shapes
- **Text** - Create and edit text elements
- **Cards** - Manage card items on boards
- **Frames** - Create and organize frames
- **Connectors** - Connect items with lines and arrows
- **Images** - Add and manage images
- **Tags** - Organize content with tags
- **Embeds** - Embed external content
- **App Cards** - Create custom app card items
- **Documents** - Manage document items

## Quick Start

The easiest way to get started is using the [Primrose SDK](https://github.com/primrose-ai/primrose-mcp):

```bash
npm install primrose-mcp
```

```typescript
import { createMCPClient } from 'primrose-mcp';

const client = createMCPClient('miro', {
  headers: {
    'X-Miro-Access-Token': 'your-miro-access-token'
  }
});
```

## Manual Installation

Clone and install dependencies:

```bash
git clone https://github.com/primrose-ai/primrose-mcp-miro.git
cd primrose-mcp-miro
npm install
```

## Configuration

### Required Headers

| Header | Description |
|--------|-------------|
| `X-Miro-Access-Token` | Miro OAuth access token |

### Getting Your Access Token

1. Go to [Miro Developer Portal](https://miro.com/app/settings/user-profile/apps)
2. Create a new app or use an existing one
3. Generate an access token with appropriate scopes

## Available Tools

### Board Tools
- `miro_list_boards` - List all boards
- `miro_get_board` - Get board details
- `miro_create_board` - Create a new board
- `miro_update_board` - Update board settings
- `miro_delete_board` - Delete a board

### Member Tools
- `miro_list_board_members` - List board members
- `miro_add_board_member` - Add a member to a board
- `miro_remove_board_member` - Remove a member from a board

### Item Tools
- `miro_list_items` - List all items on a board
- `miro_get_item` - Get item details
- `miro_delete_item` - Delete an item

### Sticky Note Tools
- `miro_create_sticky_note` - Create a sticky note
- `miro_update_sticky_note` - Update a sticky note

### Shape Tools
- `miro_create_shape` - Create a shape
- `miro_update_shape` - Update a shape

### Text Tools
- `miro_create_text` - Create a text element
- `miro_update_text` - Update a text element

### Card Tools
- `miro_create_card` - Create a card item
- `miro_update_card` - Update a card item

### Frame Tools
- `miro_create_frame` - Create a frame
- `miro_update_frame` - Update a frame

### Connector Tools
- `miro_create_connector` - Create a connector between items
- `miro_update_connector` - Update a connector

### Image Tools
- `miro_create_image` - Add an image to a board
- `miro_update_image` - Update image properties

### Tag Tools
- `miro_list_tags` - List all tags
- `miro_create_tag` - Create a new tag
- `miro_attach_tag` - Attach a tag to an item

### Embed Tools
- `miro_create_embed` - Embed external content
- `miro_update_embed` - Update embed properties

### App Card Tools
- `miro_create_app_card` - Create an app card
- `miro_update_app_card` - Update an app card

### Document Tools
- `miro_create_document` - Add a document to a board
- `miro_update_document` - Update document properties

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## Related Resources

- [Primrose SDK](https://github.com/primrose-ai/primrose-mcp) - Unified SDK for all Primrose MCP servers
- [Miro REST API Documentation](https://developers.miro.com/reference/overview)
- [Miro Developer Portal](https://developers.miro.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
