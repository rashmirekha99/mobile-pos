import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import useTheme from '../../../shared/theme/useTheme';
import GetCartItemRowStyles from './CartItemRowStyles';
import { CartItem } from '../../../shared/types';
import { formatCurrency } from '../../../shared/utils/format';

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CartItemRow = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) => {
  const { colors } = useTheme();
  const styles = GetCartItemRowStyles(colors);

  const subtotal = item.product.price * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {item.product.name}
        </Text>
        <Text style={styles.price}>{formatCurrency(item.product.price)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.qtyButton} onPress={onDecrement}>
          <Text style={styles.qtyButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity style={styles.qtyButton} onPress={onIncrement}>
          <Text style={styles.qtyButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtotal}>{formatCurrency(subtotal)}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={onRemove}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartItemRow;
