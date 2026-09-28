import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import useTheme from '../../../shared/theme/useTheme';
import GetProductCardStyles from './ProductCardStyles';
import { Product } from '../../../shared/types';
import { formatCurrency } from '../../../shared/utils/format';

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onLongPress?: () => void;
}

const ProductCard = ({ product, onPress, onLongPress }: ProductCardProps) => {
  const { colors } = useTheme();
  const styles = GetProductCardStyles(colors);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        {product.sku && <Text style={styles.sku}>SKU: {product.sku}</Text>}
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        <View style={styles.tagRow}>
          {product.barcode && (
            <Text style={styles.barcodeTag}>{product.barcode_type}</Text>
          )}
          <Text
            style={[
              styles.stockTag,
              product.stock <= 5 && styles.stockTagLow,
              product.stock <= 0 && styles.stockTagOut,
            ]}>
            {product.stock <= 0
              ? 'Out of Stock'
              : product.stock <= 5
              ? `Low: ${product.stock}`
              : `Stock: ${product.stock}`}
          </Text>
        </View>
      </View>
      <Text style={styles.chevron}>{'>'}</Text>
    </TouchableOpacity>
  );
};

export default ProductCard;
