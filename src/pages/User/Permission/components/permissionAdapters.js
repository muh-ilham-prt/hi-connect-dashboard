import { LEAF_MENUS, permId } from './permissionCatalog'

// Convert API permission objects into the menu.action IDs used by the matrix.
export function apiPermsToSet(apiPerms = []) {
  const ids = new Set()
  for (const permission of apiPerms) {
    const menuId = permission.menuId ?? permission.menu_id
    if (permission.view) ids.add(permId(menuId, 'view'))
    if (permission.create) ids.add(permId(menuId, 'create'))
    if (permission.canUpdate ?? permission.update) ids.add(permId(menuId, 'update'))
    if (permission.delete) ids.add(permId(menuId, 'delete'))
    if (permission.other) ids.add(permId(menuId, 'other'))
  }
  return ids
}

// Convert the matrix IDs back into one API object per leaf menu.
export function setToApiPerms(ids) {
  return LEAF_MENUS.map((menu) => ({
    menu_id: menu.id,
    view: ids.has(permId(menu.id, 'view')),
    create: ids.has(permId(menu.id, 'create')),
    update: ids.has(permId(menu.id, 'update')),
    delete: ids.has(permId(menu.id, 'delete')),
    other: ids.has(permId(menu.id, 'other')),
  }))
}
