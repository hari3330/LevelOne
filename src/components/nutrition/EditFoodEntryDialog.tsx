import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

import { FoodEntry, FoodUnit, MEAL_LABELS, MEAL_TYPES, MealType } from '../../types';
import { scaleNutrition } from '../../utils/nutritionCalculations';

interface EditFoodEntryDialogProps {
  entry: FoodEntry | null;
  onClose: () => void;
  onSave: (id: string, values: { quantity: number; unit: FoodUnit; mealType: MealType }) => void;
}

export default function EditFoodEntryDialog({ entry, onClose, onSave }: EditFoodEntryDialogProps) {
  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState<FoodUnit>('g');
  const [mealType, setMealType] = useState<MealType>('breakfast');

  useEffect(() => {
    if (entry) {
      setQuantity(String(entry.quantity));
      setUnit(entry.unit);
      setMealType(entry.mealType);
    }
  }, [entry]);

  if (!entry) return null;

  const quantityNum = Number(quantity);
  const preview = quantityNum > 0 ? scaleNutrition(entry, quantityNum, unit) : null;

  function handleSave() {
    if (!entry || quantityNum <= 0) return;
    onSave(entry.id, { quantity: quantityNum, unit, mealType });
  }

  return (
    <Dialog open={!!entry} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 700 }}>Edit {entry.foodName}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 0.5 }}>
          <Stack direction="row" spacing={2}>
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <TextField
              select
              label="Unit"
              fullWidth
              value={unit}
              onChange={(e) => setUnit(e.target.value as FoodUnit)}
              SelectProps={{ native: true }}
            >
              <option value="g">grams (g)</option>
              <option value="ml">milliliters (ml)</option>
              <option value="serving">serving</option>
            </TextField>
          </Stack>

          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Meal
            </Typography>
            <ToggleButtonGroup
              exclusive
              fullWidth
              value={mealType}
              onChange={(_, v) => v !== null && setMealType(v)}
              size="small"
            >
              {MEAL_TYPES.map((m) => (
                <ToggleButton key={m} value={m} sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                  {MEAL_LABELS[m]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {preview && (
            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#F1F5F9' }}>
              <Typography variant="body2">
                {Math.round(preview.calories)} kcal · P {preview.protein.toFixed(1)}g · C{' '}
                {preview.carbs.toFixed(1)}g · F {preview.fat.toFixed(1)}g
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={quantityNum <= 0}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
