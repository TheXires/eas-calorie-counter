import { useNavigation, useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import AddNewItemCard from '../components/AddNewItemCard';
import ItemCard from '../components/ItemCard';
import Searchbar from '../components/Searchbar';
import { HistoryContext } from '../contexts/HistoryContext';
import { ItemContext } from '../contexts/ItemContext';
import { HistoryContextType, ItemContextType } from '../interfaces/context';
import { Item } from '../interfaces/item';
import { AddItemNavigationProp } from '../navigation/types.navigation';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
});

function Separator() {
  return <View style={{ height: 20 }} />;
}

function AddItemScreen() {
  const { items, refreshItems, refreshingItems } =
    useContext<ItemContextType>(ItemContext);
  const { consumeItem } = useContext<HistoryContextType>(HistoryContext);
  const { colors } = useTheme();
  const navigation = useNavigation<AddItemNavigationProp>();

  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    if (searchTerm === '') return setFilteredItems(items);
    return setFilteredItems(
      items.filter((element) =>
        element.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()),
      ),
    );
  }, [searchTerm, items]);

  const onPress = async (item: Item) => {
    consumeItem(0, item, 1);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FlatList
        data={filteredItems}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ItemCard item={item} onPress={() => onPress(item)} />}
        ListHeaderComponent={
          <AddNewItemCard onPress={() => navigation.navigate('CreateItem')} />
        }
        ItemSeparatorComponent={() => Separator()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshingItems}
            onRefresh={refreshItems}
            tintColor={colors.primary}
          />
        }
      />
    </View>
  );
}

export default AddItemScreen;