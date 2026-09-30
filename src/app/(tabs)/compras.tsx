import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { StorageLocation, useAppState } from '@/context/AppStateContext';

const locations: { name: StorageLocation; icon: string; detail: string }[] = [
  { name: 'Heladera', icon: '❄', detail: 'Lácteos y frescos' },
  { name: 'Freezer', icon: '◇', detail: 'Para congelar' },
  { name: 'Alacena', icon: '▤', detail: 'Secos y enlatados' },
];

export default function ComprasScreen() {
  const { shopping, markPurchased, storeShoppingItem, addShoppingItem } = useAppState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [manualOpen, setManualOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const pending = shopping.filter((item) => !item.purchased);
  const toStore = shopping.filter((item) => item.purchased && !item.storage);

  const openStorage = (id: string) => {
    markPurchased(id);
    setSelectedId(id);
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>Casa Palermo</Text>
            <Text style={styles.title}>Compras</Text>
            <Text style={styles.subtitle}>{pending.length} productos pendientes · compartido con tu hogar</Text>
          </View>
          <Pressable accessibilityLabel="Agregar compra manual" style={styles.manualButton} onPress={() => setManualOpen(true)}>
            <Text style={styles.manualPlus}>＋</Text><Text style={styles.manualText}>Manual</Text>
          </Pressable>
        </View>

        <View style={styles.filterRow}>
          <View style={styles.activeFilter}><Text style={styles.activeFilterText}>Por comprar ({pending.length})</Text></View>
          <View style={styles.filter}><Text style={styles.filterText}>En casa ({toStore.length})</Text></View>
        </View>

        {pending.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>✓</Text>
            <Text style={styles.emptyTitle}>Todo al día</Text>
            <Text style={styles.emptyBody}>No quedan productos pendientes. Lo que compren puede guardarse en Casa.</Text>
          </View>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Para comprar</Text>
            {pending.map((item) => (
              <ShoppingRow key={item.id} item={item} onPress={() => openStorage(item.id)} />
            ))}
          </View>
        )}

        {toStore.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeading}><Text style={styles.sectionLabel}>Por guardar en Casa</Text><Text style={styles.sectionHint}>Un paso más</Text></View>
            {toStore.map((item) => <ShoppingRow key={item.id} item={item} onPress={() => setSelectedId(item.id)} toStore />)}
          </View>
        )}

        <View style={styles.explanation}><Text style={styles.explanationIcon}>i</Text><Text style={styles.explanationText}>Cada producto explica de dónde salió. Así pueden revisar la lista antes de comprar.</Text></View>
      </ScrollView>

      <Modal visible={selectedId !== null} transparent animationType="slide" onRequestClose={() => setSelectedId(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedId(null)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.sheetEyebrow}>Compra registrada</Text>
            <Text style={styles.sheetTitle}>¿Dónde guardas {shopping.find((item) => item.id === selectedId)?.name}?</Text>
            <Text style={styles.sheetCopy}>Si elegís una ubicación, el producto aparece en Casa con estado Hay. También podés dejarlo para después.</Text>
            <View style={styles.locationGrid}>
              {locations.map((location) => <Pressable key={location.name} style={styles.locationButton} onPress={() => { if (selectedId) storeShoppingItem(selectedId, location.name); setSelectedId(null); }}><Text style={styles.locationIcon}>{location.icon}</Text><Text style={styles.locationName}>{location.name}</Text><Text style={styles.locationDetail}>{location.detail}</Text></Pressable>)}
            </View>
            <Pressable style={styles.laterButton} onPress={() => setSelectedId(null)}><Text style={styles.laterText}>Ahora no, dejar por guardar</Text></Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={manualOpen} transparent animationType="slide" onRequestClose={() => setManualOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setManualOpen(false)}><Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.handle} /><Text style={styles.sheetTitle}>Agregar a Compras</Text><Text style={styles.sheetCopy}>Sumá algo que no venga del plan.</Text>
          <TextInput autoFocus value={manualName} onChangeText={setManualName} placeholder="Ej: café, detergente..." placeholderTextColor={colors.textMuted} style={styles.input} />
          <Pressable style={styles.primaryButton} onPress={() => { if (manualName.trim()) { addShoppingItem(manualName.trim()); setManualName(''); setManualOpen(false); } }}><Text style={styles.primaryButtonText}>Agregar producto</Text></Pressable>
        </Pressable></Pressable>
      </Modal>
    </View>
  );
}

function ShoppingRow({ item, onPress, toStore = false }: { item: ReturnType<typeof useAppState>['shopping'][number]; onPress: () => void; toStore?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${item.name}, ${toStore ? 'asignar ubicación' : 'marcar como comprado'}`} style={[styles.shoppingRow, toStore && styles.toStoreRow]} onPress={onPress}>
    <View style={[styles.checkbox, item.purchased && styles.checked]}><Text style={styles.checkboxText}>{item.purchased ? '✓' : ''}</Text></View>
    <View style={styles.rowCopy}><Text style={[styles.itemName, item.purchased && styles.purchasedName]}>{item.name}</Text><Text style={styles.itemMeta}>{item.quantity}</Text><Text style={styles.source}>{item.source}</Text></View>
    {toStore && <Text style={styles.assignText}>Asignar</Text>}
  </Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, content: { padding: spacing.md, paddingBottom: spacing.xxl, gap: spacing.lg }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, eyebrow: { color: colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }, title: { color: colors.text, fontSize: 28, fontWeight: '700', marginTop: 2 }, subtitle: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs }, manualButton: { minHeight: 48, borderRadius: 12, backgroundColor: colors.primary, paddingHorizontal: spacing.sm, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 2 }, manualPlus: { color: colors.surface, fontSize: 22 }, manualText: { color: colors.surface, fontWeight: '700', fontSize: 13 }, filterRow: { flexDirection: 'row', gap: spacing.sm }, activeFilter: { borderRadius: 999, backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: 10 }, activeFilterText: { color: colors.surface, fontSize: 13, fontWeight: '700' }, filter: { borderRadius: 999, backgroundColor: colors.surfaceStrong, paddingHorizontal: spacing.md, paddingVertical: 10 }, filterText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' }, section: { gap: spacing.sm }, sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }, sectionHint: { color: colors.warningText, fontSize: 12, fontWeight: '600' }, shoppingRow: { minHeight: 82, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, toStoreRow: { backgroundColor: colors.warningBackground, borderColor: '#E7D28B' }, checkbox: { height: 48, width: 48, borderRadius: 14, backgroundColor: colors.surfaceStrong, alignItems: 'center', justifyContent: 'center' }, checked: { backgroundColor: colors.successText }, checkboxText: { color: colors.surface, fontSize: 23, fontWeight: '700' }, rowCopy: { flex: 1 }, itemName: { color: colors.text, fontSize: 16, fontWeight: '700' }, purchasedName: { textDecorationLine: 'line-through', color: colors.textMuted }, itemMeta: { color: colors.textMuted, fontSize: 13, marginTop: 2 }, source: { color: colors.primaryDark, fontSize: 12, fontWeight: '600', marginTop: 5 }, assignText: { color: colors.primaryDark, fontSize: 13, fontWeight: '700' }, emptyCard: { backgroundColor: colors.surface, borderRadius: 20, padding: spacing.xl, alignItems: 'center', borderWidth: 1, borderColor: colors.border }, emptyIcon: { backgroundColor: colors.successBackground, color: colors.successText, borderRadius: 999, padding: 18, fontSize: 26, fontWeight: '700' }, emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: spacing.md }, emptyBody: { color: colors.textMuted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: spacing.sm }, explanation: { backgroundColor: colors.surfaceWarm, borderRadius: 16, padding: spacing.md, flexDirection: 'row', gap: spacing.sm }, explanationIcon: { backgroundColor: colors.primary, color: colors.surface, borderRadius: 999, width: 26, height: 26, textAlign: 'center', paddingTop: 3, fontWeight: '700' }, explanationText: { color: colors.textMuted, flex: 1, fontSize: 13, lineHeight: 19 }, modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(32,48,43,0.38)' }, sheet: { backgroundColor: colors.surface, borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: spacing.lg, gap: spacing.md }, handle: { alignSelf: 'center', width: 46, height: 5, borderRadius: 999, backgroundColor: colors.border }, sheetEyebrow: { color: colors.successText, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }, sheetTitle: { color: colors.text, fontSize: 21, fontWeight: '700' }, sheetCopy: { color: colors.textMuted, fontSize: 14, lineHeight: 20 }, locationGrid: { flexDirection: 'row', gap: spacing.sm }, locationButton: { flex: 1, minHeight: 110, borderRadius: 16, backgroundColor: colors.surfaceStrong, padding: spacing.sm, justifyContent: 'center' }, locationIcon: { color: colors.primary, fontSize: 25 }, locationName: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: spacing.xs }, locationDetail: { color: colors.textMuted, fontSize: 11, marginTop: 3 }, laterButton: { minHeight: 48, alignItems: 'center', justifyContent: 'center' }, laterText: { color: colors.textMuted, fontWeight: '700' }, input: { minHeight: 52, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceStrong, paddingHorizontal: spacing.md, color: colors.text, fontSize: 16 }, primaryButton: { minHeight: 50, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, primaryButtonText: { color: colors.surface, fontWeight: '700', fontSize: 15 },
});
