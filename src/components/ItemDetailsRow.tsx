import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  description: string;
  unit: string;
  value: number | null;
}

function ItemDetailsRow({ description, unit, value }: Props) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.text, { color: colors.text }]}>{description}</Text>
      <View style={{ alignItems: 'center', flexDirection: 'row' }}>
        <Text style={[styles.text, { color: colors.text }]}>{`${value} ${unit}`}</Text>
      </View>
    </View>
  );
}

export default ItemDetailsRow;

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
    paddingVertical: 15,
  },
});
