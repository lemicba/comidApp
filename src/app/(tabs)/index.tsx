import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { mockMeals, mockWeek } from '@/features/plan/mock-data';
import { PlannedMeal, WeekDay } from '@/features/plan/types';

function AvailabilityBadge({ availability }: Pick<PlannedMeal, 'availability'>) {
  const isReady = availability === 'ready';

  return (
    <View
      style={[
        styles.availabilityBadge,
        isReady ? styles.readyBadge : styles.missingBadge,
      ]}>
      <Text style={styles.availabilityIcon}>{isReady ? '✓' : '!'}</Text>
      <Text
        style={[
          styles.availabilityText,
          isReady ? styles.readyText : styles.missingText,
        ]}>
        {isReady ? 'Todo en casa' : 'Faltan 2 ingredientes'}
      </Text>
    </View>
  );
}

function DayChip({ day, selected, onPress }: { day: WeekDay; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityLabel={`${day.shortName} ${day.date}`}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.dayChip, selected && styles.selectedDayChip]}>
      <Text style={[styles.dayName, selected && styles.selectedDayText]}>
        {day.isToday ? 'Hoy' : day.shortName}
      </Text>
      <Text style={[styles.dayNumber, selected && styles.selectedDayText]}>
        {day.date}
      </Text>
      <View style={styles.mealDots}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={`${day.id}-${index}`}
            style={[
              styles.mealDot,
              index < day.plannedMeals
                ? selected
                  ? styles.selectedMealDot
                  : styles.plannedMealDot
                : styles.emptyMealDot,
            ]}
          />
        ))}
      </View>
    </Pressable>
  );
}

function MealCard({ meal }: { meal: PlannedMeal }) {
  const hasMissingIngredients = meal.availability === 'missing';

  return (
    <View style={[styles.mealCard, hasMissingIngredients && styles.featuredMealCard]}>
      {hasMissingIngredients && <View style={styles.featuredLine} />}
      <View style={styles.mealHeader}>
        <Text style={styles.mealSlot}>
          {meal.slot} · {meal.time}
        </Text>
        <AvailabilityBadge availability={meal.availability} />
      </View>
      <Text style={styles.mealName}>{meal.name}</Text>
      <Text style={styles.mealDescription}>{meal.description}</Text>
      {meal.missingIngredients && (
        <View style={styles.ingredientsPanel}>
          <View style={styles.ingredientsHeader}>
            <Text style={styles.ingredientsTitle}>Revisión de ingredientes</Text>
            <Text style={styles.ingredientsCount}>2 faltantes</Text>
          </View>
          {meal.missingIngredients.map((ingredient) => (
            <View key={ingredient} style={styles.ingredientRow}>
              <Text style={styles.ingredientIcon}>○</Text>
              <Text style={styles.ingredientName}>{ingredient}</Text>
              <Text style={styles.ingredientStatus}>Falta</Text>
            </View>
          ))}
          <Text style={styles.explanation}>
            Estos faltantes pueden sumarse a Compras desde el detalle de la comida.
          </Text>
        </View>
      )}
    </View>
  );
}

export default function PlanScreen() {
  const [selectedDayId, setSelectedDayId] = useState('wed');
  const selectedDay = mockWeek.find((day) => day.id === selectedDayId) ?? mockWeek[0];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.screenTitle}>Plan</Text>
            <Text style={styles.weekLabel}>Semana del 18 al 24 de noviembre</Text>
          </View>
          <View style={styles.progressBadge}>
            <Text style={styles.progressIcon}>✓</Text>
            <Text style={styles.progressText}>4/4 hoy</Text>
          </View>
        </View>

        <View style={styles.weekNavigator}>
          <Pressable accessibilityLabel="Semana anterior" style={styles.arrowButton}>
            <Text style={styles.arrowText}>‹</Text>
          </Pressable>
          <Text style={styles.weekNavigatorLabel}>18 — 24 Nov</Text>
          <Pressable accessibilityLabel="Semana siguiente" style={styles.arrowButton}>
            <Text style={styles.arrowText}>›</Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.dayStrip}
          horizontal
          showsHorizontalScrollIndicator={false}>
          {mockWeek.map((day) => (
            <DayChip
              day={day}
              key={day.id}
              onPress={() => setSelectedDayId(day.id)}
              selected={day.id === selectedDayId}
            />
          ))}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Comidas del miércoles</Text>
            <Text style={styles.sectionSubtitle}>{selectedDay.plannedMeals} momentos planificados</Text>
          </View>
          <Text style={styles.reorderText}>Ver semana</Text>
        </View>

        {mockMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} />
        ))}

        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Text style={styles.tipIconText}>i</Text>
          </View>
          <View style={styles.tipCopy}>
            <Text style={styles.tipTitle}>La lista se arma con lo que falta</Text>
            <Text style={styles.tipText}>
              Casa compara este plan con los alimentos que ya tienen para evitar compras duplicadas.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.background,
    flex: 1,
  },
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  screenTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  weekLabel: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  progressBadge: {
    alignItems: 'center',
    backgroundColor: colors.successBackground,
    borderRadius: 999,
    flexDirection: 'row',
    gap: spacing.xs,
    minHeight: 36,
    paddingHorizontal: spacing.sm,
  },
  progressIcon: {
    color: colors.successText,
    fontSize: 16,
    fontWeight: '700',
  },
  progressText: {
    color: colors.successText,
    fontSize: 13,
    fontWeight: '700',
  },
  weekNavigator: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  arrowButton: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 999,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  arrowText: {
    color: colors.textMuted,
    fontSize: 28,
    lineHeight: 30,
  },
  weekNavigatorLabel: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: spacing.md,
  },
  dayStrip: {
    gap: spacing.sm,
  },
  dayChip: {
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    height: 86,
    justifyContent: 'space-between',
    padding: spacing.sm,
    width: 62,
  },
  selectedDayChip: {
    backgroundColor: colors.primary,
    height: 92,
  },
  dayName: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  dayNumber: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
  },
  selectedDayText: {
    color: colors.surface,
  },
  mealDots: {
    flexDirection: 'row',
    gap: 3,
  },
  mealDot: {
    borderRadius: 4,
    height: 5,
    width: 5,
  },
  plannedMealDot: {
    backgroundColor: colors.successText,
  },
  selectedMealDot: {
    backgroundColor: colors.surface,
  },
  emptyMealDot: {
    backgroundColor: colors.border,
  },
  sectionHeader: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '600',
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
  },
  reorderText: {
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '700',
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: spacing.sm,
    overflow: 'hidden',
    padding: spacing.md,
  },
  featuredMealCard: {
    borderColor: colors.primary,
  },
  featuredLine: {
    backgroundColor: colors.primary,
    height: 4,
    marginHorizontal: -spacing.md,
    marginTop: -spacing.md,
  },
  mealHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealSlot: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  availabilityBadge: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    minHeight: 28,
    paddingHorizontal: spacing.sm,
  },
  readyBadge: {
    backgroundColor: colors.successBackground,
  },
  missingBadge: {
    backgroundColor: colors.warningBackground,
  },
  availabilityIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '700',
  },
  readyText: {
    color: colors.successText,
  },
  missingText: {
    color: colors.warningText,
  },
  mealName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '600',
  },
  mealDescription: {
    color: colors.textMuted,
    fontSize: 14,
  },
  ingredientsPanel: {
    backgroundColor: colors.background,
    borderRadius: 12,
    gap: spacing.sm,
    marginTop: spacing.xs,
    padding: spacing.sm,
  },
  ingredientsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ingredientsTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  ingredientsCount: {
    color: colors.textMuted,
    fontSize: 12,
  },
  ingredientRow: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    flexDirection: 'row',
    minHeight: 40,
    paddingHorizontal: spacing.sm,
  },
  ingredientIcon: {
    color: colors.primary,
    fontSize: 18,
    marginRight: spacing.sm,
  },
  ingredientName: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
  },
  ingredientStatus: {
    color: colors.primaryDark,
    fontSize: 12,
    fontWeight: '700',
  },
  explanation: {
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  tipCard: {
    alignItems: 'flex-start',
    backgroundColor: colors.surfaceWarm,
    borderRadius: 18,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
  },
  tipIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  tipIconText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  tipCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  tipTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  tipText: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
});
