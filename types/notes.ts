export interface NoteItem {
  id: string;
  title: string;
  content: string;
  pinned?: boolean;
  tag?: string;
  createdAt: string;
  updatedAt: string;
}
