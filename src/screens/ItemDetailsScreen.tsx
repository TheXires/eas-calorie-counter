import { useNavigation, useRoute } from '@react-navigation/core';
import { useTheme } from '@react-navigation/native';
import I18n from 'i18n-js';
import React, { useContext, useEffect, useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, View } from 'react-native';
import placeholderImage from '../../assets/itemPlaceholderImage.png';
import CustomActivityIndicator from '../components/CustomActivityIndicator';
import CustomButton from '../components/CustomButton';
import HorizontalLine from '../components/HorizontalLine';
import ItemDetailsRow from '../components/ItemDetailsRow';
import NavigationHeaderButton from '../components/NavigationHeaderButton';
import { ItemContext } from '../contexts/ItemContext';
import { LoadingContext } from '../contexts/LoadingContext';
import { firebaseRemoveItem } from '../firebase/items.firebase';
import { ItemContextType, LoadingContextType } from '../types/context';
import { CustomError } from '../types/error';
import { Item } from '../types/item';
import { ItemDetailsNavigationProp, ItemDetailsRouteProp } from '../types/navigation';
import { permanentColors } from '../theme/colors';

function ItemDetailsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<ItemDetailsNavigationProp>();
  const route = useRoute<ItemDetailsRouteProp>();

  const { items, refreshItems } = useContext<ItemContextType>(ItemContext);
  const { showLoadingPopup } = useContext<LoadingContextType>(LoadingContext);

  const [item, setItem] = useState<Item | undefined>(undefined);

  useEffect(() => {
    if (!route.params.itemId) return;
    setItem(items.find((element: Item) => element.id === route.params.itemId));
    navigation.setOptions({
      headerRight: () =>
        NavigationHeaderButton({
          onPress: () => navigation.navigate('EditItem', { itemId: route.params.itemId }),
          text: I18n.t('edit'),
        }),
    });
  }, [route, items, navigation]);

  const deleteItem = async () => {
    showLoadingPopup(true, I18n.t('deleteItem'));
    try {
      if (!item) throw new CustomError('unexpectedError');
      await firebaseRemoveItem(item);
      await refreshItems();
      showLoadingPopup(false);
      navigation.goBack();
    } catch (error: any) {
      showLoadingPopup(false);
      Alert.alert(
        I18n.t('errorTitle'),
        I18n.t(error.code, { defaults: [{ scope: 'unexpectedError' }] }),
      );
    }
  };

  const deleteItemPopup = () => {
    Alert.alert(I18n.t('deleteItemDialogTitle'), I18n.t('deleteItemDialogText'), [
      { style: 'cancel', text: I18n.t('cancel') },
      { onPress: () => deleteItem(), style: 'destructive', text: I18n.t('delete') },
    ]);
  };

  if (!item) return <CustomActivityIndicator />;

  return (
    <View style={styles.container}>
      <View>
        {/* Item image */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={item.imgUrl !== '' ? { uri: item.imgUrl } : placeholderImage}
          />
          {/* Item name */}
          <Text
            style={[styles.itemName, { color: colors.text }]}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
        </View>
        <View style={styles.dataContainer}>
          {/* calories */}
          <ItemDetailsRow
            description={I18n.t('calories')}
            unit={I18n.t('calorieAbbreviation')}
            value={item.calories}
          />
          <HorizontalLine />

          {/* fat */}
          <ItemDetailsRow
            description={I18n.t('fat')}
            unit={I18n.t('gramAbbreviation')}
            value={item.fat}
          />
          <HorizontalLine />

          {/* carbohydrates */}
          <ItemDetailsRow
            description={I18n.t('carbohydrates')}
            unit={I18n.t('gramAbbreviation')}
            value={item.carbohydrates}
          />
          <HorizontalLine />

          {/* protein */}
          <ItemDetailsRow
            description={I18n.t('protein')}
            unit={I18n.t('gramAbbreviation')}
            value={item.protein}
          />
        </View>
      </View>

      {/* delete button */}
      <View style={styles.buttonContainer}>
        <CustomButton
          value={I18n.t('deleteItem')}
          onPress={deleteItemPopup}
          textColor={permanentColors.error}
          buttonColor={colors.background}
        />
      </View>
    </View>
  );
}

export default ItemDetailsScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dataContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  image: {
    aspectRatio: 1 / 1,
    borderRadius: 100,
    height: 200,
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: 'center',
    height: '42%',
    marginVertical: 20,
  },
  itemName: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
});
