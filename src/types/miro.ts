/**
 * Miro API Entity Types
 *
 * Type definitions for Miro REST API responses and requests.
 * Reference: https://developers.miro.com/reference/api-reference
 */

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationParams {
  limit?: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  size: number;
  cursor?: string;
  links?: {
    self?: string;
    next?: string;
    prev?: string;
  };
}

// =============================================================================
// User
// =============================================================================

export interface MiroUser {
  id: string;
  name: string;
  email?: string;
  type?: string;
}

// =============================================================================
// Board
// =============================================================================

export interface MiroBoard {
  id: string;
  name: string;
  description?: string;
  viewLink?: string;
  accessLink?: string;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
  owner?: MiroUser;
  team?: {
    id: string;
    name?: string;
  };
  project?: {
    id: string;
    name?: string;
  };
  sharingPolicy?: {
    access?: string;
    inviteToAccountAndBoardLinkAccess?: string;
    organizationAccess?: string;
    teamAccess?: string;
  };
  permissionsPolicy?: {
    collaborationToolsStartAccess?: string;
    copyAccess?: string;
    copyAccessLevel?: string;
    sharingAccess?: string;
  };
}

export interface BoardCreateInput {
  name: string;
  description?: string;
  teamId?: string;
  projectId?: string;
  sharingPolicy?: {
    access?: 'private' | 'view' | 'comment' | 'edit';
    inviteToAccountAndBoardLinkAccess?: 'no_access' | 'viewer' | 'commenter' | 'editor';
    organizationAccess?: 'private' | 'view' | 'comment' | 'edit';
    teamAccess?: 'private' | 'view' | 'comment' | 'edit';
  };
  permissionsPolicy?: {
    collaborationToolsStartAccess?: 'all_editors' | 'board_owners_and_coowners';
    copyAccess?: 'anyone' | 'team_members' | 'team_editors' | 'board_owner';
    sharingAccess?: 'team_members_with_editing_rights' | 'owner_and_coowners';
  };
}

export interface BoardUpdateInput {
  name?: string;
  description?: string;
  sharingPolicy?: BoardCreateInput['sharingPolicy'];
  permissionsPolicy?: BoardCreateInput['permissionsPolicy'];
}

// =============================================================================
// Board Member
// =============================================================================

export interface BoardMember {
  id: string;
  name?: string;
  email?: string;
  type?: string;
  role?: 'viewer' | 'commenter' | 'editor' | 'coowner' | 'owner';
}

export interface ShareBoardInput {
  emails: string[];
  role?: 'viewer' | 'commenter' | 'editor' | 'coowner';
  message?: string;
}

// =============================================================================
// Common Item Properties
// =============================================================================

export interface Position {
  x: number;
  y: number;
  origin?: 'center';
  relativeTo?: 'canvas_center' | 'parent_top_left';
}

export interface Geometry {
  width?: number;
  height?: number;
  rotation?: number;
}

export interface Parent {
  id: string;
}

// =============================================================================
// Sticky Note
// =============================================================================

export interface StickyNote {
  id: string;
  type: 'sticky_note';
  data: {
    content: string;
    shape?: 'square' | 'rectangle';
  };
  style?: {
    fillColor?: string;
    textAlign?: 'left' | 'center' | 'right';
    textAlignVertical?: 'top' | 'middle' | 'bottom';
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface StickyNoteCreateInput {
  data: {
    content: string;
    shape?: 'square' | 'rectangle';
  };
  style?: StickyNote['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

export interface StickyNoteUpdateInput {
  data?: {
    content?: string;
    shape?: 'square' | 'rectangle';
  };
  style?: StickyNote['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// Shape
// =============================================================================

export type ShapeType =
  | 'rectangle'
  | 'round_rectangle'
  | 'circle'
  | 'triangle'
  | 'rhombus'
  | 'parallelogram'
  | 'trapezoid'
  | 'pentagon'
  | 'hexagon'
  | 'octagon'
  | 'wedge_round_rectangle_callout'
  | 'star'
  | 'flow_chart_predefined_process'
  | 'cloud'
  | 'cross'
  | 'can'
  | 'right_arrow'
  | 'left_arrow'
  | 'left_right_arrow'
  | 'left_brace'
  | 'right_brace';

export interface Shape {
  id: string;
  type: 'shape';
  data: {
    shape: ShapeType;
    content?: string;
  };
  style?: {
    fillColor?: string;
    fillOpacity?: string;
    fontFamily?: string;
    fontSize?: string;
    borderColor?: string;
    borderWidth?: string;
    borderOpacity?: string;
    borderStyle?: 'normal' | 'dotted' | 'dashed';
    textAlign?: 'left' | 'center' | 'right';
    textAlignVertical?: 'top' | 'middle' | 'bottom';
    color?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface ShapeCreateInput {
  data: {
    shape: ShapeType;
    content?: string;
  };
  style?: Shape['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

export interface ShapeUpdateInput {
  data?: {
    shape?: ShapeType;
    content?: string;
  };
  style?: Shape['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// Text
// =============================================================================

export interface TextItem {
  id: string;
  type: 'text';
  data: {
    content: string;
  };
  style?: {
    fillColor?: string;
    fillOpacity?: string;
    fontFamily?: string;
    fontSize?: string;
    textAlign?: 'left' | 'center' | 'right';
    color?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface TextCreateInput {
  data: {
    content: string;
  };
  style?: TextItem['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

export interface TextUpdateInput {
  data?: {
    content?: string;
  };
  style?: TextItem['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// Card
// =============================================================================

export interface Card {
  id: string;
  type: 'card';
  data: {
    title: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
    fields?: Array<{
      value?: string;
      fillColor?: string;
      textColor?: string;
      iconShape?: string;
      iconUrl?: string;
      tooltip?: string;
    }>;
  };
  style?: {
    cardTheme?: string;
    fillBackground?: boolean;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface CardCreateInput {
  data: {
    title: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
    fields?: Card['data']['fields'];
  };
  style?: Card['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

export interface CardUpdateInput {
  data?: {
    title?: string;
    description?: string;
    assigneeId?: string;
    dueDate?: string;
    fields?: Card['data']['fields'];
  };
  style?: Card['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// Image
// =============================================================================

export interface ImageItem {
  id: string;
  type: 'image';
  data: {
    imageUrl?: string;
    title?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface ImageCreateInput {
  data: {
    url: string;
    title?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

export interface ImageUpdateInput {
  data?: {
    title?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// Frame
// =============================================================================

export interface Frame {
  id: string;
  type: 'frame';
  data: {
    title?: string;
    format?: 'custom' | 'desktop' | 'phone' | 'a4' | 'letter' | 'square' | 'freeform';
    showContent?: boolean;
  };
  style?: {
    fillColor?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  children?: string[];
  childrenIds?: string[];
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface FrameCreateInput {
  data: {
    title?: string;
    format?: Frame['data']['format'];
    showContent?: boolean;
  };
  style?: Frame['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

export interface FrameUpdateInput {
  data?: {
    title?: string;
    format?: Frame['data']['format'];
    showContent?: boolean;
  };
  style?: Frame['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// Connector
// =============================================================================

export interface ConnectorEndpoint {
  item?: string;
  position?: {
    x: string;
    y: string;
  };
  snapTo?: 'auto' | 'top' | 'right' | 'bottom' | 'left';
}

export type StrokeCap =
  | 'none'
  | 'stealth'
  | 'diamond'
  | 'diamond_filled'
  | 'oval'
  | 'oval_filled'
  | 'arrow'
  | 'triangle'
  | 'triangle_filled'
  | 'erd_one'
  | 'erd_many'
  | 'erd_one_or_many'
  | 'erd_only_one'
  | 'erd_zero_or_many'
  | 'erd_zero_or_one';

export interface Connector {
  id: string;
  type: 'connector';
  startItem?: {
    id: string;
  };
  endItem?: {
    id: string;
  };
  captions?: Array<{
    content?: string;
    position?: string;
    textAlignVertical?: string;
  }>;
  style?: {
    startStrokeCap?: StrokeCap;
    endStrokeCap?: StrokeCap;
    strokeStyle?: 'normal' | 'dotted' | 'dashed';
    strokeColor?: string;
    strokeWidth?: string;
    color?: string;
    fontSize?: string;
    textOrientation?: 'horizontal' | 'aligned';
  };
  shape?: 'straight' | 'elbowed' | 'curved';
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface ConnectorCreateInput {
  startItem?: {
    id: string;
    snapTo?: ConnectorEndpoint['snapTo'];
    position?: { x: string; y: string };
  };
  endItem?: {
    id: string;
    snapTo?: ConnectorEndpoint['snapTo'];
    position?: { x: string; y: string };
  };
  captions?: Connector['captions'];
  style?: Connector['style'];
  shape?: Connector['shape'];
}

export interface ConnectorUpdateInput {
  startItem?: ConnectorCreateInput['startItem'];
  endItem?: ConnectorCreateInput['endItem'];
  captions?: Connector['captions'];
  style?: Connector['style'];
  shape?: Connector['shape'];
}

// =============================================================================
// Embed
// =============================================================================

export interface Embed {
  id: string;
  type: 'embed';
  data: {
    url?: string;
    mode?: 'inline' | 'modal';
    previewUrl?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface EmbedCreateInput {
  data: {
    url: string;
    mode?: 'inline' | 'modal';
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

export interface EmbedUpdateInput {
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// App Card
// =============================================================================

export interface AppCard {
  id: string;
  type: 'app_card';
  data: {
    title: string;
    description?: string;
    status?: 'disconnected' | 'connected' | 'disabled';
    fields?: Array<{
      value?: string;
      fillColor?: string;
      textColor?: string;
      iconShape?: string;
      iconUrl?: string;
      tooltip?: string;
    }>;
  };
  style?: {
    cardTheme?: string;
    fillBackground?: boolean;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface AppCardCreateInput {
  data: {
    title: string;
    description?: string;
    status?: AppCard['data']['status'];
    fields?: AppCard['data']['fields'];
  };
  style?: AppCard['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

export interface AppCardUpdateInput {
  data?: {
    title?: string;
    description?: string;
    status?: AppCard['data']['status'];
    fields?: AppCard['data']['fields'];
  };
  style?: AppCard['style'];
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// Tag
// =============================================================================

export interface Tag {
  id: string;
  type: 'tag';
  title: string;
  fillColor?: string;
}

export interface TagCreateInput {
  title: string;
  fillColor?: string;
}

export interface TagUpdateInput {
  title?: string;
  fillColor?: string;
}

// =============================================================================
// Document
// =============================================================================

export interface DocumentItem {
  id: string;
  type: 'document';
  data: {
    documentUrl?: string;
    title?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
  createdAt?: string;
  modifiedAt?: string;
  createdBy?: MiroUser;
  modifiedBy?: MiroUser;
}

export interface DocumentCreateInput {
  data: {
    url: string;
    title?: string;
  };
  position?: Position;
  geometry?: Geometry;
  parent?: Parent;
}

// =============================================================================
// Generic Item (for listing all items)
// =============================================================================

export type MiroItem =
  | StickyNote
  | Shape
  | TextItem
  | Card
  | ImageItem
  | Frame
  | Connector
  | Embed
  | AppCard
  | DocumentItem;

export type ItemType =
  | 'sticky_note'
  | 'shape'
  | 'text'
  | 'card'
  | 'image'
  | 'frame'
  | 'connector'
  | 'embed'
  | 'app_card'
  | 'document';
