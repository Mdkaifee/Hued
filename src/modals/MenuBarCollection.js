// import React from 'react';
// import {useState} from 'react';

// import {View, Text} from 'react-native';
// import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
// import {COLORS} from '../../utils/constants';

// export default function MenuBarCollection({
//   closeMenu,
//   visible,
//   deleteButton,
//   text,
//   editButton,
// }) {
//   return (
//     <View style={{height: '40%', position: 'absolute', top: 50, right: 30}}>
//       <Menu
//         visible={visible}
//         // anchor={<Text onPress={showMenu}>Show menu</Text>}
//         onRequestClose={closeMenu}>
//         <MenuItem onPress={deleteButton} textStyle={{color: COLORS.black}}>
//           Delete Collection
//         </MenuItem>
//         {/* <MenuItem disabled>Disabled item</MenuItem> */}

//         {/* <MenuItem onPress={closeMenu}></MenuItem> */}
//       </Menu>
//     </View>
//   );
// }
import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { COLORS } from '../utils/constants';

export default function MenuBarCollection({
  closeMenu,
  visible,
  deleteButton,
  text,
  editButton,
}) {
  const menuRef = useRef(null);

  // Honor the external visibility control
  useEffect(() => {
    if (!menuRef.current) return;
    if (visible) {
      // @ts-ignore
      menuRef.current.open();
    } else {
      // @ts-ignore
      menuRef.current.close();
    }
  }, [visible]);

  const handleSelect = (value) => {
    if (value === 'delete') deleteButton?.();
    if (value === 'edit') editButton?.();
    closeMenu?.();
  };

  return (
    <View style={{ height: '40%', position: 'absolute', top: 50, right: 30 }}>
      <Menu
        ref={menuRef}
        onSelect={handleSelect}
        onClose={() => closeMenu?.()}
      >
        {/* Invisible trigger since you control it via `visible` */}
        <MenuTrigger
          customStyles={{
            TriggerTouchableComponent: View,
            triggerWrapper: { width: 1, height: 1 },
          }}
        />

        <MenuOptions
          customStyles={{
            optionsContainer: { paddingVertical: 4, minWidth: 180 },
          }}
        >
          {/* Optional title line using your `text` prop */}
          {text ? (
            <MenuOption
              disabled
              text={text}
              customStyles={{
                optionText: {
                  color: COLORS.black,
                  opacity: 0.6,
                  fontWeight: '600',
                  paddingVertical: 6,
                },
              }}
            />
          ) : null}

          <MenuOption
            value="delete"
            text="Delete Collection"
            customStyles={{
              optionText: { color: COLORS.black, paddingVertical: 8 },
              optionWrapper: { paddingHorizontal: 12 },
            }}
          />

          <MenuOption
            value="edit"
            text="Edit Collection"
            customStyles={{
              optionText: { color: COLORS.black, paddingVertical: 8 },
              optionWrapper: { paddingHorizontal: 12 },
            }}
          />
        </MenuOptions>
      </Menu>
    </View>
  );
}

// import React from 'react';
// import { View } from 'react-native';
// import { MenuView } from '@react-native-menu/menu';
// import { COLORS } from '../../utils/constants';

// export default function MenuBarCollection({
//   closeMenu,
//   visible,
//   deleteButton,
//   text,
//   editButton,
// }) {
//   return (
//     <View style={{ height: '40%', position: 'absolute', top: 50, right: 30 }}>
//       <MenuView
//         title={text || 'Menu'}
//         actions={[
//           {
//             id: 'delete',
//             title: 'Delete Collection',
//             attributes: { destructive: true },
//             titleColor: COLORS.black, // using COLORS here
//           },
//           {
//             id: 'edit',
//             title: 'Edit Collection',
//             titleColor: COLORS.black, // and here
//           },
//         ]}
//         onPressAction={({ nativeEvent }) => {
//           if (nativeEvent.event === 'delete') {
//             deleteButton?.();
//             closeMenu?.();
//           }
//           if (nativeEvent.event === 'edit') {
//             editButton?.();
//             closeMenu?.();
//           }
//         }}
//       />
//     </View>
//   );
// }
