import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import EggRoundedIcon from '@mui/icons-material/EggRounded';
import GrainRoundedIcon from '@mui/icons-material/GrainRounded';
import OpacityRoundedIcon from '@mui/icons-material/OpacityRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { motion } from 'framer-motion';

import { useAppData } from '../context/AppDataContext';
import NutrientProgressCard from '../components/nutrition/NutrientProgressCard';
import MealSection from '../components/nutrition/MealSection';
import AddFoodSheet from '../components/nutrition/AddFoodSheet';
import EditFoodEntryDialog from '../components/nutrition/EditFoodEntryDialog';
import { FoodEntry, MEAL_LABELS, MEAL_TYPES, MealType } from '../types';
import {
  calcDailyTotals,
  calcMacroGoals,
  calcWaterTotal,
  entriesForMeal,
} from '../utils/nutritionCalculations';
import { todayISO } from '../utils/dateUtils';

const WATER_STEP_ML = 250;

export default function Nutrition() {
  const { data, addFoodEntry, updateFoodEntry, deleteFoodEntry, addWater } = useAppData();
  const profile = data.profile!;
  const today = todayISO();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMealType, setSheetMealType] = useState<MealType>('breakfast');
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null);

  const totals = calcDailyTotals(data.foodEntries, today);
  const goals = calcMacroGoals(profile);
  const waterMl = calcWaterTotal(data.waterLogs, today);
  const remainingCalories = Math.max(goals.calories - totals.calories, 0);

  function openSheetFor(mealType: MealType) {
    setSheetMealType(mealType);
    setSheetOpen(true);
  }

  return (
    <Box sx={{ position: 'relative', minHeight: 'calc(100dvh - 180px)' }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Nutrition
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Log meals and track your macros for the day
          </Typography>
        </Box>

        {/* Remaining calories hero */}
        <Card sx={{ p: 2.5 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline">
            <Box>
              <Typography variant="caption" color="text.secondary">
                Remaining Calories
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                {Math.round(remainingCalories)}
                <Typography component="span" variant="body2" color="text.secondary">
                  {' '}
                  kcal
                </Typography>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" textAlign="right">
              {Math.round(totals.calories)} / {Math.round(goals.calories)} kcal eaten
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={goals.calories > 0 ? Math.min((totals.calories / goals.calories) * 100, 100) : 0}
            sx={{ mt: 1.5 }}
          />
        </Card>

        {/* Dashboard cards: calories / protein / carbs / fat / water */}
        <Grid container spacing={1.5}>
          <Grid item xs={6}>
            <NutrientProgressCard
              icon={LocalFireDepartmentRoundedIcon}
              label="Calories"
              current={totals.calories}
              goal={goals.calories}
              unit="kcal"
              color="#4F46E5"
            />
          </Grid>
          <Grid item xs={6}>
            <NutrientProgressCard
              icon={EggRoundedIcon}
              label="Protein"
              current={totals.protein}
              goal={goals.protein}
              unit="g"
              color="#22C55E"
            />
          </Grid>
          <Grid item xs={6}>
            <NutrientProgressCard
              icon={GrainRoundedIcon}
              label="Carbs"
              current={totals.carbs}
              goal={goals.carbs}
              unit="g"
              color="#F59E0B"
            />
          </Grid>
          <Grid item xs={6}>
            <NutrientProgressCard
              icon={OpacityRoundedIcon}
              label="Fat"
              current={totals.fat}
              goal={goals.fat}
              unit="g"
              color="#EF4444"
            />
          </Grid>
        </Grid>

        {/* Water intake */}
        <Card sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={0.75} alignItems="center">
              <WaterDropRoundedIcon sx={{ fontSize: 18, color: '#0EA5E9' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={500}>
                Water Intake
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                size="small"
                onClick={() => addWater(-WATER_STEP_ML, today)}
                disabled={waterMl <= 0}
              >
                <RemoveRoundedIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => addWater(WATER_STEP_ML, today)}
                sx={{ bgcolor: '#EFF6FF' }}
              >
                <AddRoundedIcon fontSize="small" color="primary" />
              </IconButton>
            </Stack>
          </Stack>
          <Typography variant="body2" fontWeight={700} sx={{ mt: 1, mb: 0.75 }}>
            {waterMl}
            <Typography component="span" variant="caption" color="text.secondary">
              {' '}
              / {data.waterGoalMl} ml
            </Typography>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.min((waterMl / data.waterGoalMl) * 100, 100)}
            sx={{ height: 6, '& .MuiLinearProgress-bar': { backgroundColor: '#0EA5E9' } }}
          />
        </Card>

        {/* Meal sections */}
        {MEAL_TYPES.map((mealType) => (
          <MealSection
            key={mealType}
            title={MEAL_LABELS[mealType]}
            mealType={mealType}
            entries={entriesForMeal(data.foodEntries, mealType, today)}
            onAdd={() => openSheetFor(mealType)}
            onEdit={(entry) => setEditingEntry(entry)}
            onDelete={(entry) => deleteFoodEntry(entry.id)}
          />
        ))}
      </Stack>

      {/* Add Food FAB */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        style={{ position: 'fixed', right: 24, bottom: 96, zIndex: 20 }}
      >
        <Fab color="primary" onClick={() => openSheetFor('breakfast')} aria-label="Add Food">
          <AddRoundedIcon />
        </Fab>
      </motion.div>

      <AddFoodSheet
        open={sheetOpen}
        initialMealType={sheetMealType}
        onClose={() => setSheetOpen(false)}
        onSave={(input) => {
          addFoodEntry({ ...input, date: today });
          setSheetOpen(false);
        }}
      />

      <EditFoodEntryDialog
        entry={editingEntry}
        onClose={() => setEditingEntry(null)}
        onSave={(id, values) => {
          updateFoodEntry(id, values);
          setEditingEntry(null);
        }}
      />
    </Box>
  );
}
