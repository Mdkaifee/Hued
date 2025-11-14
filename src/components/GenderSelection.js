import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
import i18n from '../translation/i18n';

export default function GenderSelection({onSelectedGender, gender}) {
  const [selectedCategories, setSelectedCategories] = useState(gender || '');

  const data = [
    {
      id: 1,
      name: i18n.t('category.male'),
    },
    {
      id: 2,
      name: i18n.t('category.female'),
    },
    {
      id: 3,
      name: i18n.t('category.nonbinary'),
    },
  ];

  const handleCategorySelect = name => {
    setSelectedCategories(name);
    onSelectedGender(name);
  };

  return (
    <View style={styles.container}>
      {data.map(item => (
        <TouchableOpacity
          key={item.id}
          style={
            // item.name === 'Add New'
            //   ? styles.categoryView2
            //   :
            selectedCategories.includes(item.name)
              ? {
                  ...styles.categoryView,
                  backgroundColor: COLORS.primary,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                }
              : styles.categoryView
          }
          onPress={() => handleCategorySelect(item.name)}>
          <Text
            style={
              //   item.name === 'Add New'
              //     ? styles.categoryText2
              //     :
              selectedCategories.includes(item.name)
                ? {...styles.categoryText, color: COLORS.white}
                : styles.categoryText
            }>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    marginTop: 8,
  },
  categoryView: {
    borderColor: COLORS.black,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 6,
    paddingVertical: 4,
  },
  categoryView2: {
    borderColor: COLORS.black,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 6,
    paddingVertical: 4.8,
    backgroundColor: COLORS.black,
  },
  categoryText: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.black,
    fontFamily: FONT_FAMILIES.regular,
  },
  categoryText2: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.white,
    fontFamily: FONT_FAMILIES.regular,
  },
});
