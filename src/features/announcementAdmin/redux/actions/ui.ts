
import * as NS from './../../namespace';

export function addAnnouncement(payload: string): NS.IAdd {
  return { type: 'ANNOUNCEMENT_ADMIN:ADD', payload };
}

export function editAnnouncement(index: number, content: string): NS.IEdit {
  return { type: 'ANNOUNCEMENT_ADMIN:EDIT', payload: {
    index,
    content
  } };
}

export function reorderAnnouncement(oldIndex: number, newIndex: number): NS.IReorder {
  return { type: 'ANNOUNCEMENT_ADMIN:REORDER', payload: {
    oldIndex,
    newIndex
  } };
}

export function deleteAnnouncement(payload: number): NS.IDelete {
  return { type: 'ANNOUNCEMENT_ADMIN:DELETE', payload };
}

export function showEditModal(payload: number | null): NS.IShowEditModal {
  return { type: 'ANNOUNCEMENT_ADMIN:SHOW_EDIT_MODAL', payload };
}
