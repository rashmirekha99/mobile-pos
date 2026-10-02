import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import useTheme from '../../../shared/theme/useTheme';
import GetCartItemRowStyles from './CartItemRowStyles';
import { formatCurrency } from '../../../shared/utils/format';

interface CartItemRowProps {
  name: string;
  price: number;
  quantity: number;
  isService?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

const CartItemRow = ({
  name,
  price,
  quantity,
  isService,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemRowProps) => {
  const { colors } = useTheme();
  const styles = GetCartItemRowStyles(colors);

  const subtotal = price * quantity;

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {isService ? `[S] ${name}` : name}
        </Text>
        <Text style={styles.price}>{formatCurrency(price)}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.qtyButton} onPress={onDecrement}>
          <Text style={styles.qtyButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
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
