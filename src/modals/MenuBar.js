import React from 'react';
import {useState} from 'react';

import {View, Text} from 'react-native';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import {COLORS} from '../utils/constants';
import i18n from '../translation/i18n';

export default function MenuBar({
  closeMenu,
  visible,
  deleteButton,
  editButton,
  publicButton,
  text,
  collectionButton,
}) {
  const handleEdit = () => {
    closeMenu();
    setTimeout(() => {
      editButton();
    }, 500);
  };

  return (
    <View style={{height: '40%', position: 'absolute', top: 24, right: 20}}>
      <Menu
        visible={visible}
        // anchor={<Text onPress={showMenu}>Show menu</Text>}
        onRequestClose={closeMenu}>
        <MenuItem onPress={handleEdit} textStyle={{color: COLORS.black}}>
          {i18n.t('menu.edit')}
        </MenuItem>
        <MenuDivider />
        <MenuItem onPress={deleteButton} textStyle={{color: COLORS.black}}>
          {i18n.t('menu.del')}
        </MenuItem>
        <MenuDivider />
        <MenuItem onPress={publicButton} textStyle={{color: COLORS.black}}>
          {text}
        </MenuItem>
        <MenuItem onPress={collectionButton} textStyle={{color: COLORS.black}}>
          {i18n.t('menu.add')}
        </MenuItem>

        {/* <MenuItem disabled>Disabled item</MenuItem> */}

        {/* <MenuItem onPress={closeMenu}></MenuItem> */}
      </Menu>
    </View>
  );
}
