/**
 * Miro API Client
 *
 * Implements Miro REST API v2.
 * Reference: https://developers.miro.com/reference/api-reference
 */

import type { TenantCredentials } from './types/env.js';
import type {
  MiroBoard,
  BoardCreateInput,
  BoardUpdateInput,
  BoardMember,
  ShareBoardInput,
  StickyNote,
  StickyNoteCreateInput,
  StickyNoteUpdateInput,
  Shape,
  ShapeCreateInput,
  ShapeUpdateInput,
  TextItem,
  TextCreateInput,
  TextUpdateInput,
  Card,
  CardCreateInput,
  CardUpdateInput,
  ImageItem,
  ImageCreateInput,
  ImageUpdateInput,
  Frame,
  FrameCreateInput,
  FrameUpdateInput,
  Connector,
  ConnectorCreateInput,
  ConnectorUpdateInput,
  Embed,
  EmbedCreateInput,
  EmbedUpdateInput,
  AppCard,
  AppCardCreateInput,
  AppCardUpdateInput,
  Tag,
  TagCreateInput,
  TagUpdateInput,
  DocumentItem,
  DocumentCreateInput,
  MiroItem,
  ItemType,
  PaginatedResponse,
  PaginationParams,
  MiroUser,
} from './types/miro.js';
import { AuthenticationError, MiroApiError, RateLimitError } from './utils/errors.js';

// =============================================================================
// Configuration
// =============================================================================

const API_BASE_URL = 'https://api.miro.com/v2';

// =============================================================================
// Miro Client Interface
// =============================================================================

export interface MiroClient {
  // Connection
  testConnection(): Promise<{ connected: boolean; message: string; user?: MiroUser }>;

  // Boards
  listBoards(params?: PaginationParams & { teamId?: string; query?: string; sort?: string }): Promise<PaginatedResponse<MiroBoard>>;
  getBoard(boardId: string): Promise<MiroBoard>;
  createBoard(input: BoardCreateInput): Promise<MiroBoard>;
  updateBoard(boardId: string, input: BoardUpdateInput): Promise<MiroBoard>;
  deleteBoard(boardId: string): Promise<void>;
  copyBoard(boardId: string, input?: { name?: string; teamId?: string }): Promise<MiroBoard>;

  // Board Members
  listBoardMembers(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<BoardMember>>;
  getBoardMember(boardId: string, memberId: string): Promise<BoardMember>;
  shareBoard(boardId: string, input: ShareBoardInput): Promise<void>;
  updateBoardMember(boardId: string, memberId: string, role: string): Promise<BoardMember>;
  removeBoardMember(boardId: string, memberId: string): Promise<void>;

  // Generic Items
  listItems(boardId: string, params?: PaginationParams & { type?: ItemType }): Promise<PaginatedResponse<MiroItem>>;
  getItem(boardId: string, itemId: string): Promise<MiroItem>;
  updateItemPosition(boardId: string, itemId: string, position: { x: number; y: number }, parentId?: string): Promise<MiroItem>;
  deleteItem(boardId: string, itemId: string): Promise<void>;

  // Sticky Notes
  listStickyNotes(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<StickyNote>>;
  getStickyNote(boardId: string, itemId: string): Promise<StickyNote>;
  createStickyNote(boardId: string, input: StickyNoteCreateInput): Promise<StickyNote>;
  updateStickyNote(boardId: string, itemId: string, input: StickyNoteUpdateInput): Promise<StickyNote>;
  deleteStickyNote(boardId: string, itemId: string): Promise<void>;

  // Shapes
  listShapes(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Shape>>;
  getShape(boardId: string, itemId: string): Promise<Shape>;
  createShape(boardId: string, input: ShapeCreateInput): Promise<Shape>;
  updateShape(boardId: string, itemId: string, input: ShapeUpdateInput): Promise<Shape>;
  deleteShape(boardId: string, itemId: string): Promise<void>;

  // Text
  listTexts(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<TextItem>>;
  getText(boardId: string, itemId: string): Promise<TextItem>;
  createText(boardId: string, input: TextCreateInput): Promise<TextItem>;
  updateText(boardId: string, itemId: string, input: TextUpdateInput): Promise<TextItem>;
  deleteText(boardId: string, itemId: string): Promise<void>;

  // Cards
  listCards(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Card>>;
  getCard(boardId: string, itemId: string): Promise<Card>;
  createCard(boardId: string, input: CardCreateInput): Promise<Card>;
  updateCard(boardId: string, itemId: string, input: CardUpdateInput): Promise<Card>;
  deleteCard(boardId: string, itemId: string): Promise<void>;

  // Images
  getImage(boardId: string, itemId: string): Promise<ImageItem>;
  createImageFromUrl(boardId: string, input: ImageCreateInput): Promise<ImageItem>;
  updateImage(boardId: string, itemId: string, input: ImageUpdateInput): Promise<ImageItem>;
  deleteImage(boardId: string, itemId: string): Promise<void>;

  // Frames
  listFrames(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Frame>>;
  getFrame(boardId: string, itemId: string): Promise<Frame>;
  createFrame(boardId: string, input: FrameCreateInput): Promise<Frame>;
  updateFrame(boardId: string, itemId: string, input: FrameUpdateInput): Promise<Frame>;
  deleteFrame(boardId: string, itemId: string): Promise<void>;
  getFrameItems(boardId: string, frameId: string, params?: PaginationParams): Promise<PaginatedResponse<MiroItem>>;

  // Connectors
  listConnectors(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Connector>>;
  getConnector(boardId: string, connectorId: string): Promise<Connector>;
  createConnector(boardId: string, input: ConnectorCreateInput): Promise<Connector>;
  updateConnector(boardId: string, connectorId: string, input: ConnectorUpdateInput): Promise<Connector>;
  deleteConnector(boardId: string, connectorId: string): Promise<void>;

  // Embeds
  getEmbed(boardId: string, itemId: string): Promise<Embed>;
  createEmbed(boardId: string, input: EmbedCreateInput): Promise<Embed>;
  updateEmbed(boardId: string, itemId: string, input: EmbedUpdateInput): Promise<Embed>;
  deleteEmbed(boardId: string, itemId: string): Promise<void>;

  // App Cards
  getAppCard(boardId: string, itemId: string): Promise<AppCard>;
  createAppCard(boardId: string, input: AppCardCreateInput): Promise<AppCard>;
  updateAppCard(boardId: string, itemId: string, input: AppCardUpdateInput): Promise<AppCard>;
  deleteAppCard(boardId: string, itemId: string): Promise<void>;

  // Tags
  listTags(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Tag>>;
  getTag(boardId: string, tagId: string): Promise<Tag>;
  createTag(boardId: string, input: TagCreateInput): Promise<Tag>;
  updateTag(boardId: string, tagId: string, input: TagUpdateInput): Promise<Tag>;
  deleteTag(boardId: string, tagId: string): Promise<void>;
  attachTagToItem(boardId: string, itemId: string, tagId: string): Promise<void>;
  removeTagFromItem(boardId: string, itemId: string, tagId: string): Promise<void>;
  getItemsByTag(boardId: string, tagId: string, params?: PaginationParams): Promise<PaginatedResponse<MiroItem>>;
  getTagsFromItem(boardId: string, itemId: string): Promise<Tag[]>;

  // Documents
  getDocument(boardId: string, itemId: string): Promise<DocumentItem>;
  createDocumentFromUrl(boardId: string, input: DocumentCreateInput): Promise<DocumentItem>;
  deleteDocument(boardId: string, itemId: string): Promise<void>;
}

// =============================================================================
// Miro Client Implementation
// =============================================================================

class MiroClientImpl implements MiroClient {
  private credentials: TenantCredentials;

  constructor(credentials: TenantCredentials) {
    this.credentials = credentials;
  }

  // ===========================================================================
  // HTTP Request Helper
  // ===========================================================================

  private getAuthHeaders(): Record<string, string> {
    if (!this.credentials.accessToken) {
      throw new AuthenticationError(
        'No access token provided. Include X-Miro-Access-Token header.'
      );
    }

    return {
      Authorization: `Bearer ${this.credentials.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError('Rate limit exceeded', retryAfter ? parseInt(retryAfter, 10) : 60);
    }

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError('Authentication failed. Check your Miro access token.');
    }

    // Handle other errors
    if (!response.ok) {
      const errorBody = await response.text();
      let message = `Miro API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorBody);
        message = errorJson.message || errorJson.error || message;
      } catch {
        // Use default message
      }
      throw new MiroApiError(message, response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  private buildQueryString(params: Record<string, string | number | undefined>): string {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        query.set(key, String(value));
      }
    }
    const str = query.toString();
    return str ? `?${str}` : '';
  }

  // ===========================================================================
  // Connection
  // ===========================================================================

  async testConnection(): Promise<{ connected: boolean; message: string; user?: MiroUser }> {
    try {
      const user = await this.request<MiroUser>('/users/me');
      return {
        connected: true,
        message: `Connected as ${user.name}`,
        user,
      };
    } catch (error) {
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  // ===========================================================================
  // Boards
  // ===========================================================================

  async listBoards(params?: PaginationParams & { teamId?: string; query?: string; sort?: string }): Promise<PaginatedResponse<MiroBoard>> {
    const queryString = this.buildQueryString({
      limit: params?.limit,
      cursor: params?.cursor,
      team_id: params?.teamId,
      query: params?.query,
      sort: params?.sort,
    });
    return this.request<PaginatedResponse<MiroBoard>>(`/boards${queryString}`);
  }

  async getBoard(boardId: string): Promise<MiroBoard> {
    return this.request<MiroBoard>(`/boards/${boardId}`);
  }

  async createBoard(input: BoardCreateInput): Promise<MiroBoard> {
    return this.request<MiroBoard>('/boards', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateBoard(boardId: string, input: BoardUpdateInput): Promise<MiroBoard> {
    return this.request<MiroBoard>(`/boards/${boardId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteBoard(boardId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}`, {
      method: 'DELETE',
    });
  }

  async copyBoard(boardId: string, input?: { name?: string; teamId?: string }): Promise<MiroBoard> {
    const body: Record<string, unknown> = {};
    if (input?.name) body.name = input.name;
    if (input?.teamId) body.team_id = input.teamId;

    return this.request<MiroBoard>(`/boards/${boardId}/copy`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // ===========================================================================
  // Board Members
  // ===========================================================================

  async listBoardMembers(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<BoardMember>> {
    const queryString = this.buildQueryString({
      limit: params?.limit,
      cursor: params?.cursor,
    });
    return this.request<PaginatedResponse<BoardMember>>(`/boards/${boardId}/members${queryString}`);
  }

  async getBoardMember(boardId: string, memberId: string): Promise<BoardMember> {
    return this.request<BoardMember>(`/boards/${boardId}/members/${memberId}`);
  }

  async shareBoard(boardId: string, input: ShareBoardInput): Promise<void> {
    await this.request<void>(`/boards/${boardId}/members`, {
      method: 'POST',
      body: JSON.stringify({
        emails: input.emails,
        role: input.role || 'viewer',
        message: input.message,
      }),
    });
  }

  async updateBoardMember(boardId: string, memberId: string, role: string): Promise<BoardMember> {
    return this.request<BoardMember>(`/boards/${boardId}/members/${memberId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  async removeBoardMember(boardId: string, memberId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/members/${memberId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Generic Items
  // ===========================================================================

  async listItems(boardId: string, params?: PaginationParams & { type?: ItemType }): Promise<PaginatedResponse<MiroItem>> {
    const queryString = this.buildQueryString({
      limit: params?.limit,
      cursor: params?.cursor,
      type: params?.type,
    });
    return this.request<PaginatedResponse<MiroItem>>(`/boards/${boardId}/items${queryString}`);
  }

  async getItem(boardId: string, itemId: string): Promise<MiroItem> {
    return this.request<MiroItem>(`/boards/${boardId}/items/${itemId}`);
  }

  async updateItemPosition(boardId: string, itemId: string, position: { x: number; y: number }, parentId?: string): Promise<MiroItem> {
    const body: Record<string, unknown> = { position };
    if (parentId) body.parent = { id: parentId };

    return this.request<MiroItem>(`/boards/${boardId}/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }

  async deleteItem(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Sticky Notes
  // ===========================================================================

  async listStickyNotes(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<StickyNote>> {
    return this.listItems(boardId, { ...params, type: 'sticky_note' }) as Promise<PaginatedResponse<StickyNote>>;
  }

  async getStickyNote(boardId: string, itemId: string): Promise<StickyNote> {
    return this.request<StickyNote>(`/boards/${boardId}/sticky_notes/${itemId}`);
  }

  async createStickyNote(boardId: string, input: StickyNoteCreateInput): Promise<StickyNote> {
    return this.request<StickyNote>(`/boards/${boardId}/sticky_notes`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateStickyNote(boardId: string, itemId: string, input: StickyNoteUpdateInput): Promise<StickyNote> {
    return this.request<StickyNote>(`/boards/${boardId}/sticky_notes/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteStickyNote(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/sticky_notes/${itemId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Shapes
  // ===========================================================================

  async listShapes(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Shape>> {
    return this.listItems(boardId, { ...params, type: 'shape' }) as Promise<PaginatedResponse<Shape>>;
  }

  async getShape(boardId: string, itemId: string): Promise<Shape> {
    return this.request<Shape>(`/boards/${boardId}/shapes/${itemId}`);
  }

  async createShape(boardId: string, input: ShapeCreateInput): Promise<Shape> {
    return this.request<Shape>(`/boards/${boardId}/shapes`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateShape(boardId: string, itemId: string, input: ShapeUpdateInput): Promise<Shape> {
    return this.request<Shape>(`/boards/${boardId}/shapes/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteShape(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/shapes/${itemId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Text
  // ===========================================================================

  async listTexts(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<TextItem>> {
    return this.listItems(boardId, { ...params, type: 'text' }) as Promise<PaginatedResponse<TextItem>>;
  }

  async getText(boardId: string, itemId: string): Promise<TextItem> {
    return this.request<TextItem>(`/boards/${boardId}/texts/${itemId}`);
  }

  async createText(boardId: string, input: TextCreateInput): Promise<TextItem> {
    return this.request<TextItem>(`/boards/${boardId}/texts`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateText(boardId: string, itemId: string, input: TextUpdateInput): Promise<TextItem> {
    return this.request<TextItem>(`/boards/${boardId}/texts/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteText(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/texts/${itemId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Cards
  // ===========================================================================

  async listCards(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Card>> {
    return this.listItems(boardId, { ...params, type: 'card' }) as Promise<PaginatedResponse<Card>>;
  }

  async getCard(boardId: string, itemId: string): Promise<Card> {
    return this.request<Card>(`/boards/${boardId}/cards/${itemId}`);
  }

  async createCard(boardId: string, input: CardCreateInput): Promise<Card> {
    return this.request<Card>(`/boards/${boardId}/cards`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateCard(boardId: string, itemId: string, input: CardUpdateInput): Promise<Card> {
    return this.request<Card>(`/boards/${boardId}/cards/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteCard(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/cards/${itemId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Images
  // ===========================================================================

  async getImage(boardId: string, itemId: string): Promise<ImageItem> {
    return this.request<ImageItem>(`/boards/${boardId}/images/${itemId}`);
  }

  async createImageFromUrl(boardId: string, input: ImageCreateInput): Promise<ImageItem> {
    return this.request<ImageItem>(`/boards/${boardId}/images`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateImage(boardId: string, itemId: string, input: ImageUpdateInput): Promise<ImageItem> {
    return this.request<ImageItem>(`/boards/${boardId}/images/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteImage(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/images/${itemId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Frames
  // ===========================================================================

  async listFrames(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Frame>> {
    return this.listItems(boardId, { ...params, type: 'frame' }) as Promise<PaginatedResponse<Frame>>;
  }

  async getFrame(boardId: string, itemId: string): Promise<Frame> {
    return this.request<Frame>(`/boards/${boardId}/frames/${itemId}`);
  }

  async createFrame(boardId: string, input: FrameCreateInput): Promise<Frame> {
    return this.request<Frame>(`/boards/${boardId}/frames`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateFrame(boardId: string, itemId: string, input: FrameUpdateInput): Promise<Frame> {
    return this.request<Frame>(`/boards/${boardId}/frames/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteFrame(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/frames/${itemId}`, {
      method: 'DELETE',
    });
  }

  async getFrameItems(boardId: string, frameId: string, params?: PaginationParams): Promise<PaginatedResponse<MiroItem>> {
    const queryString = this.buildQueryString({
      limit: params?.limit,
      cursor: params?.cursor,
    });
    return this.request<PaginatedResponse<MiroItem>>(`/boards/${boardId}/frames/${frameId}/items${queryString}`);
  }

  // ===========================================================================
  // Connectors
  // ===========================================================================

  async listConnectors(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Connector>> {
    const queryString = this.buildQueryString({
      limit: params?.limit,
      cursor: params?.cursor,
    });
    return this.request<PaginatedResponse<Connector>>(`/boards/${boardId}/connectors${queryString}`);
  }

  async getConnector(boardId: string, connectorId: string): Promise<Connector> {
    return this.request<Connector>(`/boards/${boardId}/connectors/${connectorId}`);
  }

  async createConnector(boardId: string, input: ConnectorCreateInput): Promise<Connector> {
    return this.request<Connector>(`/boards/${boardId}/connectors`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateConnector(boardId: string, connectorId: string, input: ConnectorUpdateInput): Promise<Connector> {
    return this.request<Connector>(`/boards/${boardId}/connectors/${connectorId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteConnector(boardId: string, connectorId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/connectors/${connectorId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Embeds
  // ===========================================================================

  async getEmbed(boardId: string, itemId: string): Promise<Embed> {
    return this.request<Embed>(`/boards/${boardId}/embeds/${itemId}`);
  }

  async createEmbed(boardId: string, input: EmbedCreateInput): Promise<Embed> {
    return this.request<Embed>(`/boards/${boardId}/embeds`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateEmbed(boardId: string, itemId: string, input: EmbedUpdateInput): Promise<Embed> {
    return this.request<Embed>(`/boards/${boardId}/embeds/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteEmbed(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/embeds/${itemId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // App Cards
  // ===========================================================================

  async getAppCard(boardId: string, itemId: string): Promise<AppCard> {
    return this.request<AppCard>(`/boards/${boardId}/app_cards/${itemId}`);
  }

  async createAppCard(boardId: string, input: AppCardCreateInput): Promise<AppCard> {
    return this.request<AppCard>(`/boards/${boardId}/app_cards`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateAppCard(boardId: string, itemId: string, input: AppCardUpdateInput): Promise<AppCard> {
    return this.request<AppCard>(`/boards/${boardId}/app_cards/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteAppCard(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/app_cards/${itemId}`, {
      method: 'DELETE',
    });
  }

  // ===========================================================================
  // Tags
  // ===========================================================================

  async listTags(boardId: string, params?: PaginationParams): Promise<PaginatedResponse<Tag>> {
    const queryString = this.buildQueryString({
      limit: params?.limit,
      cursor: params?.cursor,
    });
    return this.request<PaginatedResponse<Tag>>(`/boards/${boardId}/tags${queryString}`);
  }

  async getTag(boardId: string, tagId: string): Promise<Tag> {
    return this.request<Tag>(`/boards/${boardId}/tags/${tagId}`);
  }

  async createTag(boardId: string, input: TagCreateInput): Promise<Tag> {
    return this.request<Tag>(`/boards/${boardId}/tags`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async updateTag(boardId: string, tagId: string, input: TagUpdateInput): Promise<Tag> {
    return this.request<Tag>(`/boards/${boardId}/tags/${tagId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  }

  async deleteTag(boardId: string, tagId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/tags/${tagId}`, {
      method: 'DELETE',
    });
  }

  async attachTagToItem(boardId: string, itemId: string, tagId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/items/${itemId}/tags/${tagId}`, {
      method: 'POST',
    });
  }

  async removeTagFromItem(boardId: string, itemId: string, tagId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/items/${itemId}/tags/${tagId}`, {
      method: 'DELETE',
    });
  }

  async getItemsByTag(boardId: string, tagId: string, params?: PaginationParams): Promise<PaginatedResponse<MiroItem>> {
    const queryString = this.buildQueryString({
      limit: params?.limit,
      cursor: params?.cursor,
    });
    return this.request<PaginatedResponse<MiroItem>>(`/boards/${boardId}/tags/${tagId}/items${queryString}`);
  }

  async getTagsFromItem(boardId: string, itemId: string): Promise<Tag[]> {
    const response = await this.request<{ data: Tag[] }>(`/boards/${boardId}/items/${itemId}/tags`);
    return response.data;
  }

  // ===========================================================================
  // Documents
  // ===========================================================================

  async getDocument(boardId: string, itemId: string): Promise<DocumentItem> {
    return this.request<DocumentItem>(`/boards/${boardId}/documents/${itemId}`);
  }

  async createDocumentFromUrl(boardId: string, input: DocumentCreateInput): Promise<DocumentItem> {
    return this.request<DocumentItem>(`/boards/${boardId}/documents`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  }

  async deleteDocument(boardId: string, itemId: string): Promise<void> {
    await this.request<void>(`/boards/${boardId}/documents/${itemId}`, {
      method: 'DELETE',
    });
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createMiroClient(credentials: TenantCredentials): MiroClient {
  return new MiroClientImpl(credentials);
}
