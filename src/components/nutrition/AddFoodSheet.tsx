import React, { useEffect, useRef, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import CircularProgress from '@mui/material/CircularProgress';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded';

import { FoodUnit, MEAL_LABELS, MEAL_TYPES, MealType } from '../../types';
import { searchFood, FoodSearchResult } from '../../services/food/foodService';
import { scaleNutrition } from '../../utils/nutritionCalculations';

interface AddFoodSheetProps {
  open: boolean;
  initialMealType: MealType;
  onClose: () => void;
  onSave: (input: {
    mealType: MealType;
    foodName: string;
    brand?: string;
    quantity: number;
    unit: FoodUnit;
    caloriesPer100: number;
    proteinPer100: number;
    carbsPer100: number;
    fatPer100: number;
  }) => void;
}

const SEARCH_DEBOUNCE_MS = 450;

export default function AddFoodSheet({ open, initialMealType, onClose, onSave }: AddFoodSheetProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const [selected, setSelected] = useState<FoodSearchResult | null>(null);
  const [quantity, setQuantity] = useState('100');
  const [unit, setUnit] = useState<FoodUnit>('g');
  const [mealType, setMealType] = useState<MealType>(initialMealType);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset everything each time the sheet opens, and default the meal to whichever
  // section the user tapped "+" on.
  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setSearched(false);
      setSelected(null);
      setQuantity('100');
      setUnit('g');
      setMealType(initialMealType);
    }
  }, [open, initialMealType]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const found = await searchFood(query);
      setResults(found);
      setSearched(true);
      setLoading(false);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const quantityNum = Number(quantity);
  const preview =
    selected && quantityNum > 0
      ? scaleNutrition(selected, quantityNum, unit)
      : { calories: 0, protein: 0, carbs: 0, fat: 0 };

  function handleSave() {
    if (!selected || quantityNum <= 0) return;
    onSave({
      mealType,
      foodName: selected.name,
      brand: selected.brand,
      quantity: quantityNum,
      unit,
      caloriesPer100: selected.caloriesPer100,
      proteinPer100: selected.proteinPer100,
      carbsPer100: selected.carbsPer100,
      fatPer100: selected.fatPer100,
    });
  }

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxWidth: 560,
          mx: 'auto',
          maxHeight: '88vh',
        },
      }}
    >
      <Box sx={{ p: 2.5, pb: 3 }}>
        {/* Drag handle */}
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: '#E2E8F0',
            mx: 'auto',
            mb: 2,
          }}
        />

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {selected && (
              <IconButton size="small" onClick={() => setSelected(null)}>
                <ArrowBackRoundedIcon fontSize="small" />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={700}>
              {selected ? selected.name : 'Add Food'}
            </Typography>
          </Stack>
          <IconButton size="small" onClick={onClose}>
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        {!selected ? (
          <>
            <TextField
              fullWidth
              placeholder="Search Food — e.g. Chicken Breast, Rice, Egg, Banana"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: loading ? (
                  <InputAdornment position="end">
                    <CircularProgress size={18} />
                  </InputAdornment>
                ) : undefined,
              }}
            />

            <Box sx={{ mt: 1, maxHeight: '46vh', overflowY: 'auto' }}>
              {!loading && searched && results.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  No food results found.
                </Typography>
              )}
              {results.length > 0 && (
                <List disablePadding>
                  {results.map((food) => (
                    <ListItemButton
                      key={food.id}
                      onClick={() => setSelected(food)}
                      sx={{ borderRadius: 2, mb: 0.5 }}
                    >
                      <RestaurantRoundedIcon
                        fontSize="small"
                        sx={{ mr: 1.5, color: 'text.secondary' }}
                      />
                      <ListItemText
                        primary={food.name}
                        secondary={`${food.brand ? food.brand + ' · ' : ''}${Math.round(
                          food.caloriesPer100
                        )} kcal / 100g`}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Box>
          </>
        ) : (
          <Stack spacing={2.5}>
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

            <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#F1F5F9' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                This entry
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Metric label="Calories" value={`${Math.round(preview.calories)}`} />
                <Metric label="Protein" value={`${preview.protein.toFixed(1)}g`} />
                <Metric label="Carbs" value={`${preview.carbs.toFixed(1)}g`} />
                <Metric label="Fat" value={`${preview.fat.toFixed(1)}g`} />
              </Stack>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={quantityNum <= 0}
              onClick={handleSave}
            >
              Save
            </Button>
          </Stack>
        )}
      </Box>
    </Drawer>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography variant="body2" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
