import { useNavigation } from '@react-navigation/core';
import { useTheme } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import FloatingActionButton from '../components/FloatingActionButton';
import ItemListElement from '../components/ItemListElement';
import Searchbar from '../components/Searchbar';
import Spacer from '../components/Spacer';
import { ItemContext } from '../contexts/ItemContext';
import { ItemContextType } from '../types/context';
import { Item } from '../types/item';
import { ItemsNavigationProp } from '../types/navigation';

function ItemsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<ItemsNavigationProp>();
  const { items, refreshingItems, refreshItems } = useContext<ItemContextType>(ItemContext);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    if (searchTerm === '') return setFilteredItems(items);
    const tmpItems: Item[] = items.filter((item: Item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    return setFilteredItems(tmpItems);
  }, [searchTerm, items]);

  return (
    <>
      <View style={styles.container}>
        <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <FlatList
          data={filteredItems}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ItemListElement
              item={item}
              onPress={() => navigation.navigate('ItemDetails', { itemId: item.id })}
            />
          )}
          ListFooterComponent={<Spacer height={100} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshingItems}
              onRefresh={refreshItems}
              tintColor={colors.primary}
            />
          }
        />
      </View>
      <FloatingActionButton icon="edit-2" onPress={() => navigation.navigate('CreateItem')} />
    </>
  );
}

export default ItemsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
});
