import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {COLORS, FONT_FAMILIES, FONT_SIZES} from '../utils/constants';
// import i18n from '../translation/i18n';
// import AddNew from '../screens/modals/AddNew';
// import {AddnewCategoryApi} from '../services/AppApi';
import {capitalizeFirstLetter} from '../utils/helperFunction';

export default function CategorySelections({
  navigation,
  Data,
  onSelectedCategory,
  category,
}) {
  console.log('categoryyy', category);
  const [selectedCategories, setSelectedCategories] = useState(category || []);
  const [data, setData] = useState(Data);
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  // for single selection
  const handleCategorySelect = id => {
    if (selectedCategories?.includes(id)) {
      setSelectedCategories(prevSelected => {
        onSelectedCategory(
          prevSelected.filter(categoryId => categoryId !== id),
        );
        return prevSelected.filter(categoryId => categoryId !== id);
      });
    } else {
      setSelectedCategories([id]);
      onSelectedCategory([id]);
    }
  };

  // catergory add api
  // const handleAddNewCategory = async newCategory => {
  //   const data = {
  //     name: newCategory,
  //   };
  //   const response = await AddnewCategoryApi(data);
  //   console.log('response', response);
  //   if (response?.responseCode === 200) {
  //     closeModal();
  //   } else {
  //     ToastMessage(response?.data?.responseMessage);
  //   }
  // };

  return (
    <View style={styles.container}>
      {Data.map(item => (
        <TouchableOpacity
          key={item._id}
          style={
            selectedCategories.includes(item._id)
              ? {
                  ...styles.categoryView,
                  backgroundColor: COLORS.primary,
                  borderWidth: 1,
                  borderColor: COLORS.primary,
                }
              : styles.categoryView
          }
          onPress={() => handleCategorySelect(item._id)}>
          <Text
            style={
              selectedCategories.includes(item._id)
                ? {...styles.categoryText, color: COLORS.white}
                : styles.categoryText
            }>
            {capitalizeFirstLetter(item.name)}
          </Text>
        </TouchableOpacity>
      ))}
      {/* <TouchableOpacity style={styles.addView} onPress={openModal}>
        <Text style={styles.addnew}>{i18n.t('category.add')}</Text>
      </TouchableOpacity> */}
      {/* <AddNew
        visible={modalVisible}
        closeModal={closeModal}
        navigation={navigation}
        handleAddNewCategory={handleAddNewCategory}
      /> */}
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
  addView: {
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
  addnew: {
    fontSize: FONT_SIZES.twelve,
    color: COLORS.white,
    fontFamily: FONT_FAMILIES.regular,
  },
});

// for multiple selection
// const handleCategorySelect = id => {
//   if (selectedCategories.includes(id)) {
//     setSelectedCategories(prevSelected =>
//       prevSelected.filter(categoryId => categoryId !== id),
//     );
//   } else {
//     setSelectedCategories(prevSelected => [...prevSelected, id]);
//   }
// };
// FOR ADDING NEWW ITEMS IN UI
// console.log('newcategory', newCategory);
// const newItem = {
//   id: data.length + 1,
//   name: newCategory,
// };
// setData(prevData => [...prevData, newItem]);
// setSelectedCategories(prevSelected => [...prevSelected, newItem.id]);
// closeModal();

// const DummyData = [
//   {
//     id: 1,
//     name: i18n.t('category.sweat'),
//   },
//   {
//     id: 2,
//     name: i18n.t('category.jeans'),
//   },
//   {
//     id: 3,
//     name: i18n.t('category.shirt'),
//   },
//   {
//     id: 4,
//     name: i18n.t('category.track'),
//   },
//   {
//     id: 5,
//     name: i18n.t('category.jackets'),
//   },
//   {
//     id: 6,
//     name: i18n.t('category.summer'),
//   },
//   {
//     id: 7,
//     name: i18n.t('category.winter'),
//   },
// ];
