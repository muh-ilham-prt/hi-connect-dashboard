import rawMenus from '@/assets/menu.json'

export const ACTIONS = [
  { key: 'view', label: 'Lihat' },
  { key: 'create', label: 'Buat' },
  { key: 'update', label: 'Ubah' },
  { key: 'delete', label: 'Hapus' },
  { key: 'other', label: 'Lainnya' },
]

// Flatten hierarchical menu.json into table rows: parents are header-only, children and standalone items are leaves.
export const MENU_PERMISSIONS = rawMenus.flatMap((menu) => {
  if (menu.children?.length) {
    return [
      { id: menu.id, name: menu.name, icon: menu.icon, parent: true },
      ...menu.children.map((child) => ({
        id: child.id,
        name: child.name,
        icon: child.icon,
        parent: false,
        group: menu.id,
      })),
    ]
  }
  return [{ id: menu.id, name: menu.name, icon: menu.icon, parent: false }]
})

export const LEAF_MENUS = MENU_PERMISSIONS.filter((menu) => !menu.parent)
export const permId = (menuId, action) => `${menuId}.${action}`
export const ALL_PERMISSION_IDS = LEAF_MENUS.flatMap((menu) =>
  ACTIONS.map((action) => permId(menu.id, action.key))
)
